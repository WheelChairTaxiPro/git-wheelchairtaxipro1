import { Injectable } from '@angular/core';

import type { LatLng, Place } from '../../../shared/models/trip.models';
import type { RouteSummary } from '../map.models';

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
   * One `computeRoutes` (`TRAFFIC_UNAWARE`) — distance, duration, map geometry (fewer billed requests).
   */
  async calculateRouteVariants(
    _mapsApi: typeof google,
    pickup: Place,
    dropoff: Place,
    _options?: { readonly scheduledDeparture?: Date },
  ): Promise<RouteVariantsComputed> {
    const routeForMap = await this.computeDrivingRoute(pickup, dropoff, {
      routingPreference: 'TRAFFIC_UNAWARE',
    });

    const seconds = this.durationSecondsFromRoute(routeForMap);
    const durationText = this.formatDurationZh(seconds);

    const distanceKm = Math.round(((routeForMap.distanceMeters ?? 0) / 1000) * 10) / 10;

    const summary: RouteSummary = {
      pickup,
      dropoff,
      distanceKm,
      durationText,
    };

    return { routeForMap, summary };
  }

  async calculateRoute(
    mapsApi: typeof google,
    pickup: Place,
    dropoff: Place,
  ): Promise<RouteVariantsComputed> {
    return this.calculateRouteVariants(mapsApi, pickup, dropoff);
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
     * Omit `regionCode` when using explicit lat/lng: a HK bias broke routes outside HK.
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

  private durationSecondsFromRoute(route: ComputedDrivingRoute): number {
    const ms = route.staticDurationMillis ?? route.durationMillis;
    if (ms == null || !Number.isFinite(ms)) {
      throw new Error('Route duration missing.');
    }
    return Math.max(1, ms / 1000);
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
