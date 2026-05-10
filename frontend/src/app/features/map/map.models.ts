import type { LatLng, Place, TripEtaLeg } from '../../shared/models/trip.models';

export type SelectionStep = 'pickup' | 'dropoff' | 'complete';

export interface RouteSummary {
  readonly pickup: Place;
  readonly dropoff: Place;
  readonly distanceKm: number;
  /** Primary display line — mirrors `etaTrafficNow` when available, otherwise baseline. */
  readonly durationText: string;
  readonly etaRoutingBaseline: TripEtaLeg;
  readonly etaTrafficNow: TripEtaLeg;
  readonly etaAtScheduledPickup?: TripEtaLeg;
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
