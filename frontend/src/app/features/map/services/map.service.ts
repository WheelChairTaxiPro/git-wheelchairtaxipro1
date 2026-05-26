import { Injectable } from '@angular/core';

import type { LatLng, Place, TripEtaLeg } from '../../../shared/models/trip.models';
import type { RouteSummary } from '../map.models';

const SCHEDULE_NEAR_NOW_MS = 120_000;

/**
 * Routes API with live traffic requires `departureTime` strictly in the future vs Google's clock.
 * `new Date()` often fails with INVALID_ARGUMENT ("Timestamp must be set to a future time.")
 * when the device clock lags or the request hits the same wall second.
 */
const TRAFFIC_DEPARTURE_MIN_LEAD_MS = 90_000;

/**
 * Route returned from `google.maps.routes.Route.computeRoutes` — only the fields we request.
 * (Full `Route` typing may lag in `@types/google.maps`.)
 */
export interface ComputedDrivingRoute {
  readonly durationMillis?: number | null;
  readonly staticDurationMillis?: number | null;
  readonly distanceMeters?: number | null;
  readonly viewport?: google.maps.LatLngBounds | null;
  readonly path?: ReadonlyArray<google.maps.LatLngLiteral | google.maps.LatLngAltitudeLiteral> | null;
  createPolylines(options?: Record<string, unknown>): Promise<readonly google.maps.Polyline[]>;
}

export interface RouteVariantsComputed {
  /** Traffic-aware @ "now" geometry for drawing on the map. */
  readonly routeForMap: ComputedDrivingRoute;
  readonly summary: RouteSummary;
}

interface RouteLibrary {
  Route: {
    computeRoutes(
      request: google.maps.routes.ComputeRoutesRequest,
    ): Promise<{ routes?: readonly ComputedDrivingRoute[] }>;
  };
}

@Injectable({ providedIn: 'root' })
export class MapService {
  private routeLibraryPromise: Promise<RouteLibrary['Route']> | null = null;

  private getRouteClass(): Promise<RouteLibrary['Route']> {
    this.routeLibraryPromise ??= (async () => {
      const lib = (await google.maps.importLibrary(
        'routes',
      )) as unknown as RouteLibrary;
      return lib.Route;
    })();
    return this.routeLibraryPromise;
  }

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
   * Baseline + departure-time-aware ETAs using Routes `computeRoutes`:
   * - static / TRAFFIC_UNAWARE baseline duration
   * - TRAFFIC_AWARE_OPTIMAL @ now → traffic duration (falls back to baseline if traffic routing fails)
   * - optional scheduled departure (third leg) when far enough from now
   */
  async calculateRouteVariants(
    _mapsApi: typeof google,
    pickup: Place,
    dropoff: Place,
    options?: { readonly scheduledDeparture?: Date },
  ): Promise<RouteVariantsComputed> {
    const baselineRoute = await this.computeDrivingRoute(pickup, dropoff, {
      routingPreference: 'TRAFFIC_UNAWARE',
    });

    const baselineSeconds = this.baselineSecondsFromRoute(baselineRoute);

    const now = new Date();
    const departureForTrafficNow = this.coerceDepartureTimeForTraffic(now);
    let trafficNowRoute = baselineRoute;
    let trafficFallback = false;
    try {
      trafficNowRoute = await this.computeDrivingRoute(pickup, dropoff, {
        routingPreference: 'TRAFFIC_AWARE_OPTIMAL',
        departureTime: departureForTrafficNow,
        trafficModel: google.maps.TrafficModel.BEST_GUESS,
      });
    } catch (err) {
      /*
       * Live-traffic routing can reject or return no route in regions with limited coverage
       * while the TRAFFIC_UNAWARE baseline still succeeds — keep geometry + baseline ETA instead of failing outright.
       */
      console.warn('[map] TRAFFIC_AWARE_OPTIMAL route failed; using TRAFFIC_UNAWARE fallback.', err);
      trafficNowRoute = baselineRoute;
      trafficFallback = true;
    }

    const trafficNowSeconds = trafficFallback
      ? baselineSeconds
      : this.trafficSecondsFromRoute(trafficNowRoute, baselineSeconds);

    let scheduledSlice: TripEtaLeg | undefined;
    const sched = options?.scheduledDeparture;
    if (sched && Number.isFinite(sched.getTime())) {
      const delta = Math.abs(sched.getTime() - now.getTime());
      if (delta <= SCHEDULE_NEAR_NOW_MS) {
        scheduledSlice = this.buildEtaTrafficSlice(
          trafficNowRoute.durationMillis != null
            ? trafficNowRoute.durationMillis / 1000
            : trafficNowSeconds,
          sched.toISOString(),
          '預約出發時間接近此刻',
          `Scheduled pickup almost now — estimated same live-traffic ETA (${this.formatUtcIso(sched)}).`,
          true,
        );
      } else {
        try {
          const schedRoute = await this.computeDrivingRoute(pickup, dropoff, {
            routingPreference: 'TRAFFIC_AWARE_OPTIMAL',
            departureTime: this.coerceDepartureTimeForTraffic(sched),
            trafficModel: google.maps.TrafficModel.BEST_GUESS,
          });
          const sec =
            schedRoute.durationMillis != null
              ? schedRoute.durationMillis / 1000
              : baselineSeconds;
          scheduledSlice = this.buildEtaTrafficSlice(
            sec,
            sched.toISOString(),
            '依預約出發時間估計路况',
            `Estimated using traffic outlook for pickup time (${this.formatUtcIso(sched)}).`,
          );
        } catch (e) {
          console.warn('[map] scheduled-route failed', e);
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
      trafficFallback
        ? '即時路况未能套用，沿用基本車程估算'
        : '以「現在」為出發時間推算',
      trafficFallback
        ? 'Live-traffic routing was unavailable; showing baseline drive-time estimate instead.'
        : `Departure anchored to browser "now": ${this.formatUtcIso(now)}.`,
    );

    const distanceKm =
      Math.round(
        (((trafficNowRoute.distanceMeters ?? baselineRoute.distanceMeters) ?? 0) / 1000) * 10,
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

    return { routeForMap: trafficNowRoute, summary };
  }

  async calculateRoute(
    mapsApi: typeof google,
    pickup: Place,
    dropoff: Place,
  ): Promise<RouteVariantsComputed> {
    return this.calculateRouteVariants(mapsApi, pickup, dropoff);
  }

  /**
   * Bump departure into the future so TRAFFIC_AWARE_* requests satisfy Routes API validation.
   * Preserves `when` when it is already sufficiently ahead (e.g. real future bookings).
   */
  private coerceDepartureTimeForTraffic(when: Date): Date {
    const anchor = Number.isFinite(when.getTime()) ? when.getTime() : Date.now();
    const minTs = Date.now() + TRAFFIC_DEPARTURE_MIN_LEAD_MS;
    return new Date(Math.max(anchor, minTs));
  }

  private async computeDrivingRoute(
    pickup: Place,
    dropoff: Place,
    opts: {
      readonly routingPreference:
        | 'TRAFFIC_UNAWARE'
        | 'TRAFFIC_AWARE'
        | 'TRAFFIC_AWARE_OPTIMAL';
      readonly departureTime?: Date;
      readonly trafficModel?: google.maps.TrafficModel;
    },
  ): Promise<ComputedDrivingRoute> {
    const Route = await this.getRouteClass();

    /*
     * Omit `regionCode` when using explicit lat/lng: a Hong Kong bias was breaking valid routes
     * outside HK (and the REST shape is `regionCode`, not `region`).
     */
    const request = {
      origin: pickup.coords,
      destination: dropoff.coords,
      travelMode: google.maps.TravelMode.DRIVING,
      routingPreference: opts.routingPreference,
      fields: ['durationMillis', 'distanceMeters', 'staticDurationMillis', 'path', 'viewport'],
      ...(opts.departureTime ? { departureTime: opts.departureTime } : {}),
      ...(opts.trafficModel != null ? { trafficModel: opts.trafficModel } : {}),
    } as google.maps.routes.ComputeRoutesRequest;

    const response = await Route.computeRoutes(request);
    const route = response.routes?.[0] as ComputedDrivingRoute | undefined;

    if (!route) {
      throw new Error('Routes response contained no routes.');
    }
    const dist = route.distanceMeters;
    const durMs = route.durationMillis ?? route.staticDurationMillis;
    if (dist == null || durMs == null) {
      throw new Error('Routes response missing distance/duration.');
    }

    return route;
  }

  private baselineSecondsFromRoute(route: ComputedDrivingRoute): number {
    const ms = route.staticDurationMillis ?? route.durationMillis;
    if (ms == null || !Number.isFinite(ms)) {
      throw new Error('Baseline route duration missing.');
    }
    return Math.max(1, ms / 1000);
  }

  private trafficSecondsFromRoute(route: ComputedDrivingRoute, fallbackSeconds: number): number {
    const dur =
      typeof route.durationMillis === 'number' && Number.isFinite(route.durationMillis)
        ? route.durationMillis / 1000
        : fallbackSeconds;
    return Math.max(1, dur);
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

  /** Format route duration (seconds) as "X 分鐘" / "X 小時 Y 分鐘". */
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
