export interface LatLng {
  readonly lat: number;
  readonly lng: number;
}

export interface Place {
  readonly address: string;
  readonly coords: LatLng;
}

/** Single ETA snapshot (routing baseline, live-traffic-at-departure-time, etc.). */
export interface TripEtaLeg {
  readonly durationText: string;
  readonly departureIso: string | null;
  readonly captionZh: string;
  readonly captionEn: string;
}

export interface TripSelection {
  readonly pickup: Place;
  readonly dropoff: Place;
  readonly estimatedFareHkd?: number;
  readonly estimatedDistanceKm?: number;
  /** Prefer `etaTrafficNow?.durationText` when present — kept for shortcuts / WhatsApp. */
  readonly estimatedDurationText?: string;
  /** Google directions without departure-time traffic option — typical drive time baseline. */
  readonly etaRoutingBaseline?: TripEtaLeg;
  /** `departureTime = now()` with live traffic projection. */
  readonly etaTrafficNow?: TripEtaLeg;
  /** `departureTime = user's scheduled pickup`; omitted on map-only flow or when redundant. */
  readonly etaAtScheduledPickup?: TripEtaLeg;
  readonly serviceFeeHkd?: number;
}
