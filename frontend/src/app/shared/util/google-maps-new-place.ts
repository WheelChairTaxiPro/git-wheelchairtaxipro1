import type { LatLng } from '../models/trip.models';

/**
 * Narrow typing for Google's new `<gmp-place-autocomplete>` (`PlaceAutocompleteElement`).
 * Older `@types/google.maps` bundles may omit this constructor.
 */
export type GmpPlaceAutocompleteElementCtor = new (options?: GmpPlaceAutocompleteOptions) =>
  GmpPlaceAutocompleteElement;

export type GmpPlaceAutocompleteElement = HTMLElement & {
  /** Search text shown in the widget. */
  value: string;
  name?: string;
  placeholder?: string;
  includedRegionCodes?: string[];
  locationBias?: google.maps.LatLngBounds | google.maps.Circle | google.maps.LatLngLiteral;
  locationRestriction?: google.maps.LatLngBounds | google.maps.Circle;
  noInputIcon?: boolean;
  requestedLanguage?: string;
  requestedRegion?: string;
};

export interface GmpPlaceAutocompleteOptions {
  name?: string;
  placeholder?: string;
  requestedLanguage?: string;
  requestedRegion?: string;
  includedRegionCodes?: string[];
  locationBias?: google.maps.LatLngBounds | google.maps.Circle | google.maps.LatLngLiteral;
  locationRestriction?: google.maps.LatLngBounds | google.maps.Circle;
  noInputIcon?: boolean;
}

/** Place returned by PlacePrediction.toPlace(); fields filled after fetchFields(). */
export type GooglePlaceFetched = {
  readonly fetchFields: (opts: { fields: string[] }) => Promise<void>;
  displayName?: unknown;
  formattedAddress?: string | null;
  location?: google.maps.LatLng | google.maps.LatLngLiteral | null;
};

export interface GmpPlacePredictionSelectEvent extends Event {
  readonly placePrediction: {
    toPlace(): GooglePlaceFetched;
  };
}

export async function importPlaceAutocompleteCtor(): Promise<GmpPlaceAutocompleteElementCtor> {
  const lib = (await google.maps.importLibrary(
    'places',
  )) as unknown as GooglePlacesLibraryImported;
  return lib.PlaceAutocompleteElement as unknown as GmpPlaceAutocompleteElementCtor;
}

interface GooglePlacesLibraryImported {
  PlaceAutocompleteElement: GmpPlaceAutocompleteElementCtor;
}

export function hkLatLngBiasBounds(latLngBoundsCtor: typeof google.maps.LatLngBounds): google.maps.LatLngBounds {
  return new latLngBoundsCtor({ lat: 22.12, lng: 113.78 }, { lat: 22.58, lng: 114.48 });
}

/** After `fetchFields`, read coordinates from the new Place object. */
export function latLngFromGooglePlaceLocation(place: GooglePlaceFetched): LatLng | null {
  const loc = place.location;
  if (!loc) {
    return null;
  }
  const asFn = loc as google.maps.LatLng;
  if (typeof asFn.lat === 'function' && typeof asFn.lng === 'function') {
    return { lat: asFn.lat(), lng: asFn.lng() };
  }
  const lit = loc as google.maps.LatLngLiteral;
  if (typeof lit.lat === 'number' && typeof lit.lng === 'number') {
    return { lat: lit.lat, lng: lit.lng };
  }
  return null;
}
