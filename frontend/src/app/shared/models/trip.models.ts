export interface LatLng {
  readonly lat: number;
  readonly lng: number;
}

export interface Place {
  readonly address: string;
  readonly coords: LatLng;
}

export interface TripSelection {
  readonly pickup: Place;
  readonly dropoff: Place;
  readonly estimatedFareHkd?: number;
  readonly estimatedDistanceKm?: number;
}
