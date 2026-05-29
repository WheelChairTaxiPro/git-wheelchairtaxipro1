import type { LatLng, Place } from '../../shared/models/trip.models';

export type SelectionStep = 'pickup' | 'dropoff' | 'complete';

export interface RouteSummary {
  readonly pickup: Place;
  readonly dropoff: Place;
  readonly distanceKm: number;
  /** Single drive-time line (TRAFFIC_UNAWARE baseline). */
  readonly durationText: string;
}

export interface MapError {
  readonly code:
    | 'missing-api-key'
    | 'geolocation-denied'
    | 'map-load-failed'
    | 'geocode-failed'
    | 'route-failed';
  readonly messageZh: string;
  readonly messageEn: string;
}

export interface MapMarkerState {
  readonly pickup?: LatLng;
  readonly dropoff?: LatLng;
}
