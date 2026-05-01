import { Injectable } from '@angular/core';

import type { LatLng, Place } from '../../../shared/models/trip.models';
import type { RouteSummary } from '../map.models';

@Injectable({ providedIn: 'root' })
export class MapService {
  async reverseGeocode(geocoder: google.maps.Geocoder, coords: LatLng): Promise<Place> {
    const response = await geocoder.geocode({ location: coords });
    const first = response.results[0];

    return {
      coords,
      address: first?.formatted_address ?? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
    };
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
        durationText: leg.duration.text,
      },
    };
  }
}
