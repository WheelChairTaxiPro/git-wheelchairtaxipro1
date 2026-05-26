import type { LatLng } from '../../shared/models/trip.models';

export const HONG_KONG_CENTER: LatLng = {
  lat: 22.3193,
  lng: 114.1694,
};

export const DEFAULT_MAP_ZOOM = 12;
export const USER_LOCATION_ZOOM = 15;
export const SELECTED_ROUTE_ZOOM_PADDING_PX = 64;

/**
 * Required for Advanced Markers (`AdvancedMarkerElement`).
 * Replace with a Map ID from Google Cloud Console (Map Styles) for production traffic.
 */
export const GOOGLE_CLOUD_MAP_VECTOR_ID = 'DEMO_MAP_ID';

export const MAP_COPY = {
  pickupPromptZh: '請在地圖上點選上車地點。',
  pickupPromptEn: 'Tap the map to choose pickup location.',
  dropoffPromptZh: '請再點選目的地。',
  dropoffPromptEn: 'Tap again to choose destination.',
  completePromptZh: '路線已準備好，可前往預約。',
  completePromptEn: 'Route is ready. Continue to booking.',
} as const;
