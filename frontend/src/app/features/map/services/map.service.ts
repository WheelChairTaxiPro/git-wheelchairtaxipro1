import { Injectable } from '@angular/core';

import type { LatLng, Place } from '../../../shared/models/trip.models';
import type { RouteSummary } from '../map.models';

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
      // ZERO_RESULTS is expected when the user taps open water, remote parks, etc.
      // Fall back to coordinates instead of surfacing an error.
      if (status === 'ZERO_RESULTS') {
        return { coords, address: coordsLabel };
      }
      console.warn('[map] reverseGeocode failed', { coords, status, err });
      throw err;
    }
  }

  async calculateRoute(
    directionsService: google.maps.DirectionsService,
    pickup: Place,
    dropoff: Place,
  ): Promise<{ result: google.maps.DirectionsResult; summary: RouteSummary }> {
    const result = await directionsService.route({
      origin: pickup.coords,
      destination: dropoff.coords,
      travelMode: google.maps.TravelMode.DRIVING,
      region: 'HK',
    });

    const leg = result.routes[0]?.legs[0];
    if (!leg?.distance || !leg.duration) {
      throw new Error('Directions response did not include distance/duration.');
    }

    return {
      result,
      summary: {
        pickup,
        dropoff,
        distanceKm: Math.round((leg.distance.value / 1000) * 10) / 10,
        durationText: this.formatDurationZh(leg.duration.value),
      },
    };
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
