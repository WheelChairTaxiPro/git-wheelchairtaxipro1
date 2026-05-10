import { Injectable } from '@angular/core';

import type { LatLng, Place, TripEtaLeg } from '../../../shared/models/trip.models';
import type { RouteSummary } from '../map.models';

const SCHEDULE_NEAR_NOW_MS = 120_000;

@Injectable({ providedIn: 'root' })
export class MapService {
  async reverseGeocode(geocoder: google.maps.Geocoder, coords: LatLng): Promise<Place> {
    const coordsLabel = `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
    try {
      const response = await geocoder.geocode({ location: coords });
      const first = response.results[0];
      return {
        coords,
        address: first?.formatted_address ?? coordsLabel,
      };
    } catch (err) {
      const status = (err as { code?: string })?.code;
      if (status === 'ZERO_RESULTS') {
        return { coords, address: coordsLabel };
      }
      console.warn('[map] reverseGeocode failed', { coords, status, err });
      throw err;
    }
  }

  /**
   * Baseline ETA + departure-time-aware ETAs using up to three Directions route() calls:
   * 1) No `drivingOptions` → typical leg duration without departure-time traffic.
   * 2) `departureTime = Date.now()` → `duration_in_traffic` when Maps returns it.
   * 3) Optional `scheduledDeparture` when far enough from now → traffic projection for pickup time.
   */
  async calculateRouteVariants(
    directionsService: google.maps.DirectionsService,
    pickup: Place,
    dropoff: Place,
    options?: { readonly scheduledDeparture?: Date },
  ): Promise<{ result: google.maps.DirectionsResult; summary: RouteSummary }> {
    const baselineResult = await this.route(directionsService, pickup, dropoff);

    const now = new Date();
    const trafficNowResult = await this.route(directionsService, pickup, dropoff, now);

    const baseLeg = this.requireLeg(baselineResult);
    const nowLeg = this.requireLeg(trafficNowResult);

    const baselineSeconds = this.baselineSecondsFromLeg(baseLeg);
    const trafficNowSeconds = this.trafficSecondsFromLeg(nowLeg, baselineSeconds);

    let scheduledSlice: TripEtaLeg | undefined;
    const sched = options?.scheduledDeparture;
    if (sched && Number.isFinite(sched.getTime())) {
      const delta = Math.abs(sched.getTime() - now.getTime());
      if (delta <= SCHEDULE_NEAR_NOW_MS) {
        scheduledSlice = this.buildEtaTrafficSlice(
          nowLeg.duration_in_traffic?.value ?? trafficNowSeconds,
          sched.toISOString(),
          '預約出發時間接近此刻',
          `Scheduled pickup almost now — estimated same live-traffic ETA (${this.formatUtcIso(sched)}).`,
          true,
        );
      } else {
        try {
          const schedResult = await this.route(directionsService, pickup, dropoff, sched);
          const sl = this.requireLeg(schedResult);
          const sec =
            sl.duration_in_traffic?.value ?? sl.duration?.value ?? baselineSeconds;
          scheduledSlice = this.buildEtaTrafficSlice(
            sec,
            sched.toISOString(),
            '依預約出發時間估計路况',
            `Estimated using traffic outlook for pickup time (${this.formatUtcIso(sched)}).`,
          );
        } catch (e) {
          console.warn('[map] scheduled-directions failed', e);
        }
      }
    }

    const etaRoutingBaseline: TripEtaLeg = {
      durationText: this.formatDurationZh(baselineSeconds),
      departureIso: null,
      captionZh: '不依賴出發時間／即時路况的路線規劃估算。',
      captionEn: 'Routing estimate without tying to a departure time or live-traffic outlook.',
    };

    const etaTrafficNow = this.buildEtaTrafficSlice(
      trafficNowSeconds,
      now.toISOString(),
      '以「現在」為出發時間推算',
      `Departure anchored to browser "now": ${this.formatUtcIso(now)}.`,
    );

    const distanceKm =
      Math.round(
        (((nowLeg.distance?.value ?? baseLeg.distance?.value) ?? 0) / 1000) * 10,
      ) / 10;

    const summary: RouteSummary = {
      pickup,
      dropoff,
      distanceKm,
      durationText: etaTrafficNow.durationText,
      etaRoutingBaseline,
      etaTrafficNow,
      etaAtScheduledPickup: scheduledSlice,
    };

    return { result: trafficNowResult, summary };
  }

  /** @deprecated Prefer `calculateRouteVariants` — kept for callers that only need one matrix. */
  async calculateRoute(
    directionsService: google.maps.DirectionsService,
    pickup: Place,
    dropoff: Place,
  ): Promise<{ result: google.maps.DirectionsResult; summary: RouteSummary }> {
    return this.calculateRouteVariants(directionsService, pickup, dropoff);
  }

  private async route(
    directionsService: google.maps.DirectionsService,
    pickup: Place,
    dropoff: Place,
    departure?: Date,
  ): Promise<google.maps.DirectionsResult> {
    const request: google.maps.DirectionsRequest = {
      origin: pickup.coords,
      destination: dropoff.coords,
      travelMode: google.maps.TravelMode.DRIVING,
      region: 'HK',
    };
    if (departure && Number.isFinite(departure.getTime())) {
      request.drivingOptions = {
        departureTime: departure,
        trafficModel: google.maps.TrafficModel.BEST_GUESS,
      };
    }

    const result = await directionsService.route(request);

    const leg = result.routes[0]?.legs?.[0];
    if (!leg?.distance?.value || !leg.duration?.value) {
      throw new Error('Directions response did not include distance/duration.');
    }

    return result;
  }

  private requireLeg(result: google.maps.DirectionsResult): google.maps.DirectionsLeg {
    const leg = result.routes[0]?.legs?.[0];
    if (!leg) {
      throw new Error('Directions response did not include legs.');
    }
    const dist = leg.distance?.value;
    const dur = leg.duration?.value;
    if (dist == null || dur == null) {
      throw new Error('Directions response did not include distance/duration.');
    }
    return leg;
  }

  private baselineSecondsFromLeg(leg: google.maps.DirectionsLeg): number {
    const dur = leg.duration?.value;
    if (dur == null) throw new Error('Directions leg missing baseline duration.');
    return dur;
  }

  private trafficSecondsFromLeg(leg: google.maps.DirectionsLeg, fallback: number): number {
    const t = leg.duration_in_traffic?.value ?? leg.duration?.value ?? fallback;
    return t ?? fallback;
  }

  private buildEtaTrafficSlice(
    seconds: number,
    departureIso: string,
    captionZhLead: string,
    captionEn: string,
    nearNowNote = false,
  ): TripEtaLeg {
    return {
      durationText: this.formatDurationZh(seconds),
      departureIso,
      captionZh: nearNowNote
        ? `${captionZhLead}（與上列「現在」推算相同）／${this.formatDepartureZhHk(departureIso)}／UTC：${this.formatUtcIso(new Date(departureIso))}`
        : `${captionZhLead}／${this.formatDepartureZhHk(departureIso)}／UTC：${this.formatUtcIso(new Date(departureIso))}`,
      captionEn: `${captionEn} Local (zh-Hant-HK styled): ${this.formatDepartureZhHk(departureIso)} UTC: ${this.formatUtcIso(new Date(departureIso))}`,
    };
  }

  private formatUtcIso(d: Date): string {
    return d.toISOString();
  }

  /** Human anchoring datetime in Hong Kong (display only). */
  private formatDepartureZhHk(departureIso: string): string {
    const d = new Date(departureIso);
    try {
      return new Intl.DateTimeFormat('zh-Hant-HK', {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Hong_Kong',
      }).format(d);
    } catch {
      return departureIso;
    }
  }

  /** Format Directions duration (seconds) as "X 分鐘" / "X 小時 Y 分鐘" regardless of Google's locale string. */
  private formatDurationZh(seconds: number): string {
    const totalMinutes = Math.max(1, Math.round(seconds / 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
      return `${minutes} 分鐘`;
    }
    if (minutes === 0) {
      return `${hours} 小時`;
    }
    return `${hours} 小時 ${minutes} 分鐘`;
  }
}
