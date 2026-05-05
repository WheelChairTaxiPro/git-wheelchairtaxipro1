import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import type { LatLng, Place } from '../../shared/models/trip.models';
import { TripStateService } from '../../shared/services/trip-state.service';
import { formatPlaceDisplayAddress } from '../../shared/util/format-place-address';
import { DEFAULT_MAP_ZOOM, HONG_KONG_CENTER, MAP_COPY, SELECTED_ROUTE_ZOOM_PADDING_PX, USER_LOCATION_ZOOM } from './map.config';
import type { MapError, RouteSummary, SelectionStep } from './map.models';
import { GoogleMapsLoaderService } from './services/google-maps-loader.service';
import { MapService } from './services/map.service';

const RECENT_PICKUP_STORAGE_KEY = 'wheelchairTaxiPro.recentPickupPlaces';
const RECENT_DROPOFF_STORAGE_KEY = 'wheelchairTaxiPro.recentDropoffPlaces';
const MAX_RECENT_PLACES = 5;

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class Map implements AfterViewInit, OnDestroy {
  @ViewChild('mapCanvas') private mapCanvas?: ElementRef<HTMLDivElement>;
  @ViewChild('pickupSearchField') private pickupSearchField?: ElementRef<HTMLElement>;
  @ViewChild('dropoffSearchField') private dropoffSearchField?: ElementRef<HTMLElement>;
  @ViewChild('pickupInput') private pickupInput?: ElementRef<HTMLInputElement>;
  @ViewChild('dropoffInput') private dropoffInput?: ElementRef<HTMLInputElement>;

  protected readonly selectionStep = signal<SelectionStep>('pickup');
  protected readonly pickup = signal<Place | null>(null);
  protected readonly dropoff = signal<Place | null>(null);
  protected readonly routeSummary = signal<RouteSummary | null>(null);
  protected readonly error = signal<MapError | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly recentPickupPlaces = signal<readonly Place[]>([]);
  protected readonly recentDropoffPlaces = signal<readonly Place[]>([]);
  protected readonly activeRecentList = signal<'pickup' | 'dropoff' | null>(null);

  protected readonly prompt = computed(() => {
    switch (this.selectionStep()) {
      case 'pickup':
        return { zh: MAP_COPY.pickupPromptZh, en: MAP_COPY.pickupPromptEn };
      case 'dropoff':
        return { zh: MAP_COPY.dropoffPromptZh, en: MAP_COPY.dropoffPromptEn };
      case 'complete':
        return { zh: MAP_COPY.completePromptZh, en: MAP_COPY.completePromptEn };
    }
  });

  private readonly loader = inject(GoogleMapsLoaderService);
  private readonly mapService = inject(MapService);
  private readonly tripState = inject(TripStateService);
  private readonly router = inject(Router);

  private mapsApi: typeof google | null = null;
  private googleMap: google.maps.Map | null = null;
  private geocoder: google.maps.Geocoder | null = null;
  private directionsService: google.maps.DirectionsService | null = null;
  private directionsRenderer: google.maps.DirectionsRenderer | null = null;
  private pickupMarker: google.maps.Marker | null = null;
  private dropoffMarker: google.maps.Marker | null = null;
  private userLocationMarker: google.maps.Marker | null = null;
  private latestDirectionsResult: google.maps.DirectionsResult | null = null;
  private clickListener: google.maps.MapsEventListener | null = null;
  private pickupAutocompleteListener: google.maps.MapsEventListener | null = null;
  private dropoffAutocompleteListener: google.maps.MapsEventListener | null = null;

  async ngAfterViewInit(): Promise<void> {
    if (!this.loader.hasApiKey) {
      this.setError('missing-api-key');
      return;
    }

    const canvas = this.mapCanvas?.nativeElement;
    if (!canvas) {
      this.setError('map-load-failed');
      return;
    }

    this.isLoading.set(true);
    try {
      const maps = await this.loader.load();
      this.mapsApi = maps;
      this.googleMap = new maps.maps.Map(canvas, {
        center: HONG_KONG_CENTER,
        zoom: DEFAULT_MAP_ZOOM,
        clickableIcons: false,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
      });
      this.geocoder = new maps.maps.Geocoder();
      this.directionsService = new maps.maps.DirectionsService();
      this.directionsRenderer = new maps.maps.DirectionsRenderer({
        map: this.googleMap,
        suppressMarkers: true,
      });
      this.clickListener = this.googleMap.addListener('click', (event: google.maps.MapMouseEvent) => {
        void this.handleMapClick(event);
      });
      this.loadRecentPlaces();
      this.setupAutocomplete();

      const restored = await this.restoreTripState();
      if (!restored) {
        await this.centerOnCurrentLocation();
      }
    } catch {
      this.setError('map-load-failed');
    } finally {
      this.isLoading.set(false);
    }
  }

  ngOnDestroy(): void {
    this.clickListener?.remove();
    this.pickupAutocompleteListener?.remove();
    this.dropoffAutocompleteListener?.remove();
    this.pickupMarker?.setMap(null);
    this.dropoffMarker?.setMap(null);
    this.userLocationMarker?.setMap(null);
    this.directionsRenderer?.setMap(null);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    const activeList = this.activeRecentList();
    if (!activeList) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      this.activeRecentList.set(null);
      return;
    }

    const activeField = activeList === 'pickup'
      ? this.pickupSearchField?.nativeElement
      : this.dropoffSearchField?.nativeElement;

    if (!activeField?.contains(target)) {
      this.activeRecentList.set(null);
    }
  }

  protected showMyLocation(): void {
    void this.centerOnCurrentLocation();
  }

  protected showRoute(): void {
    if (!this.googleMap) {
      return;
    }

    if (this.latestDirectionsResult) {
      this.fitRouteBounds(this.latestDirectionsResult);
      return;
    }

    const pickup = this.pickup();
    const dropoff = this.dropoff();
    if (pickup && dropoff) {
      this.fitSelectedPlaceBounds([pickup, dropoff]);
      return;
    }

    if (pickup || dropoff) {
      const place = pickup ?? dropoff;
      if (place) {
        this.googleMap.setCenter(place.coords);
        this.googleMap.setZoom(USER_LOCATION_ZOOM);
      }
      return;
    }

    this.googleMap.setCenter(HONG_KONG_CENTER);
    this.googleMap.setZoom(DEFAULT_MAP_ZOOM);
  }

  protected resetRoute(): void {
    this.activeRecentList.set(null);
    this.pickupMarker?.setMap(null);
    this.dropoffMarker?.setMap(null);
    this.clearRenderedRoute();
    this.pickupMarker = null;
    this.dropoffMarker = null;
    this.pickup.set(null);
    this.dropoff.set(null);
    this.routeSummary.set(null);
    this.latestDirectionsResult = null;
    this.selectionStep.set('pickup');
    this.error.set(null);
    this.tripState.clear();
    if (this.pickupInput) {
      this.pickupInput.nativeElement.value = '';
    }
    if (this.dropoffInput) {
      this.dropoffInput.nativeElement.value = '';
    }
  }

  protected clearPickup(): void {
    this.activeRecentList.set(null);
    this.pickupMarker?.setMap(null);
    this.pickupMarker = null;
    this.pickup.set(null);
    this.routeSummary.set(null);
    this.latestDirectionsResult = null;
    this.clearRenderedRoute();
    this.tripState.clearPickup();
    this.selectionStep.set('pickup');
    if (this.pickupInput) {
      this.pickupInput.nativeElement.value = '';
    }
  }

  protected clearDropoff(): void {
    this.activeRecentList.set(null);
    this.dropoffMarker?.setMap(null);
    this.dropoffMarker = null;
    this.dropoff.set(null);
    this.routeSummary.set(null);
    this.latestDirectionsResult = null;
    this.clearRenderedRoute();
    this.tripState.clearDropoff();
    this.selectionStep.set(this.pickup() ? 'dropoff' : 'pickup');
    if (this.dropoffInput) {
      this.dropoffInput.nativeElement.value = '';
    }
  }

  protected onPickupSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const nextValue = input.value;
    this.activeRecentList.set(nextValue.trim() ? null : 'pickup');
    const selectedPickup = this.pickup();
    if (selectedPickup && nextValue !== selectedPickup.address) {
      this.clearPickup();
      input.value = nextValue;
    }
  }

  protected onDropoffSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const nextValue = input.value;
    this.activeRecentList.set(nextValue.trim() ? null : 'dropoff');
    const selectedDropoff = this.dropoff();
    if (selectedDropoff && nextValue !== selectedDropoff.address) {
      this.clearDropoff();
      input.value = nextValue;
    }
  }

  protected showRecentPickupPlaces(): void {
    if (!this.pickupInput?.nativeElement.value.trim() && this.recentPickupPlaces().length > 0) {
      this.activeRecentList.set('pickup');
    }
  }

  protected showRecentDropoffPlaces(): void {
    if (!this.dropoffInput?.nativeElement.value.trim() && this.recentDropoffPlaces().length > 0) {
      this.activeRecentList.set('dropoff');
    }
  }

  protected async selectRecentPickup(place: Place): Promise<void> {
    this.activeRecentList.set(null);
    this.applyPickupPlace(place);
    this.rememberRecentPlace('pickup', place);
    if (this.dropoff()) {
      await this.calculateAndRenderRoute();
    }
  }

  protected async selectRecentDropoff(place: Place): Promise<void> {
    this.activeRecentList.set(null);
    this.applyDropoffPlace(place);
    this.rememberRecentPlace('dropoff', place);
    if (this.pickup()) {
      await this.calculateAndRenderRoute();
    }
  }

  protected removeRecentPickup(place: Place): void {
    this.removeRecentPlace('pickup', place);
    if (this.pickup()?.address === place.address) {
      this.clearPickup();
    }
  }

  protected removeRecentDropoff(place: Place): void {
    this.removeRecentPlace('dropoff', place);
    if (this.dropoff()?.address === place.address) {
      this.clearDropoff();
    }
  }

  protected continueToBooking(): void {
    const summary = this.routeSummary();
    if (!summary) {
      return;
    }

    this.tripState.set({
      pickup: summary.pickup,
      dropoff: summary.dropoff,
      estimatedDistanceKm: summary.distanceKm,
      estimatedDurationText: summary.durationText,
    });

    void this.router.navigate(['/booking']);
  }

  private async handleMapClick(event: google.maps.MapMouseEvent): Promise<void> {
    const latLng = event.latLng;
    if (!latLng || !this.geocoder) {
      return;
    }

    const coords: LatLng = { lat: latLng.lat(), lng: latLng.lng() };
    const step = this.selectionStep();

    if (step === 'complete') {
      this.resetRoute();
    }

    if (this.selectionStep() === 'pickup') {
      await this.setPickup(coords);
      return;
    }

    if (this.selectionStep() === 'dropoff') {
      await this.setDropoff(coords);
    }
  }

  private async setPickup(coords: LatLng): Promise<void> {
    if (!this.geocoder) {
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    try {
      const place = await this.mapService.reverseGeocode(this.geocoder, coords);
      this.applyPickupPlace(place);
      this.rememberRecentPlace('pickup', place);
      this.selectionStep.set('dropoff');
      if (this.dropoff()) {
        await this.calculateAndRenderRoute();
      }
    } catch (err) {
      console.warn('[map] setPickup failed', err);
      this.setError('geocode-failed');
    } finally {
      this.isLoading.set(false);
    }
  }

  private async setDropoff(coords: LatLng): Promise<void> {
    if (!this.geocoder) {
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    try {
      const place = await this.mapService.reverseGeocode(this.geocoder, coords);
      this.applyDropoffPlace(place);
      this.rememberRecentPlace('dropoff', place);
      await this.calculateAndRenderRoute();
    } catch (err) {
      console.warn('[map] setDropoff failed', err);
      this.setError('geocode-failed');
    } finally {
      this.isLoading.set(false);
    }
  }

  private async calculateAndRenderRoute(): Promise<void> {
    const pickup = this.pickup();
    const dropoff = this.dropoff();
    if (!pickup || !dropoff || !this.directionsService || !this.directionsRenderer || !this.googleMap) {
      return;
    }

    try {
      const { result, summary } = await this.mapService.calculateRoute(
        this.directionsService,
        pickup,
        dropoff,
      );
      this.directionsRenderer.setDirections(result);
      this.latestDirectionsResult = result;
      this.fitRouteBounds(result);
      this.routeSummary.set(summary);
      this.selectionStep.set('complete');
      this.tripState.set({
        pickup: summary.pickup,
        dropoff: summary.dropoff,
        estimatedDistanceKm: summary.distanceKm,
        estimatedDurationText: summary.durationText,
      });
    } catch {
      this.setError('route-failed');
    }
  }

  private clearRenderedRoute(): void {
    if (!this.directionsRenderer) {
      return;
    }

    this.directionsRenderer.setMap(null);
    this.directionsRenderer.set('directions', null);
    if (this.googleMap) {
      this.directionsRenderer.setMap(this.googleMap);
    }
  }

  private async centerOnCurrentLocation(): Promise<void> {
    if (!this.googleMap || !('geolocation' in navigator)) {
      return;
    }

    try {
      const coords = await this.getBrowserLocation();
      this.googleMap.setCenter(coords);
      this.googleMap.setZoom(USER_LOCATION_ZOOM);
      this.setUserLocationMarker(coords);
    } catch {
      this.setError('geolocation-denied');
    }
  }

  private setupAutocomplete(): void {
    if (!this.mapsApi || !this.googleMap || !this.pickupInput || !this.dropoffInput) {
      return;
    }

    const options: google.maps.places.AutocompleteOptions = {
      componentRestrictions: { country: ['hk', 'nz'] },
      fields: ['formatted_address', 'geometry', 'name'],
    };

    const pickupAutocomplete = new this.mapsApi.maps.places.Autocomplete(
      this.pickupInput.nativeElement,
      options,
    );
    const dropoffAutocomplete = new this.mapsApi.maps.places.Autocomplete(
      this.dropoffInput.nativeElement,
      options,
    );

    pickupAutocomplete.bindTo('bounds', this.googleMap);
    dropoffAutocomplete.bindTo('bounds', this.googleMap);

    this.pickupAutocompleteListener = pickupAutocomplete.addListener('place_changed', () => {
      void this.handleAutocompletePlace(pickupAutocomplete, 'pickup');
    });
    this.dropoffAutocompleteListener = dropoffAutocomplete.addListener('place_changed', () => {
      void this.handleAutocompletePlace(dropoffAutocomplete, 'dropoff');
    });
  }

  private async handleAutocompletePlace(
    autocomplete: google.maps.places.Autocomplete,
    target: 'pickup' | 'dropoff',
  ): Promise<void> {
    const place = autocomplete.getPlace();
    const location = place.geometry?.location;
    if (!location) {
      this.setError('geocode-failed');
      return;
    }

    const coords: LatLng = { lat: location.lat(), lng: location.lng() };
    const selected: Place = {
      coords,
      address:
        formatPlaceDisplayAddress(place) ??
        `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
    };

    if (target === 'pickup') {
      this.activeRecentList.set(null);
      this.applyPickupPlace(selected);
      this.rememberRecentPlace('pickup', selected);
      this.selectionStep.set(this.dropoff() ? 'complete' : 'dropoff');
    } else {
      this.activeRecentList.set(null);
      this.applyDropoffPlace(selected);
      this.rememberRecentPlace('dropoff', selected);
      this.selectionStep.set(this.pickup() ? 'complete' : 'pickup');
    }

    this.googleMap?.panTo(coords);
    if (this.pickup() && this.dropoff()) {
      await this.calculateAndRenderRoute();
    } else {
      this.routeSummary.set(null);
    }
  }

  private async restoreTripState(): Promise<boolean> {
    const pickup = this.tripState.pickup();
    const dropoff = this.tripState.dropoff();
    if (!pickup && !dropoff) {
      return false;
    }

    if (pickup) {
      this.pickup.set(pickup);
      this.pickupMarker?.setMap(null);
      this.pickupMarker = this.createMarker(pickup.coords, '上車 Pickup', 'A');
      if (this.pickupInput) {
        this.pickupInput.nativeElement.value = pickup.address;
      }
    }

    if (dropoff) {
      this.dropoff.set(dropoff);
      this.dropoffMarker?.setMap(null);
      this.dropoffMarker = this.createMarker(dropoff.coords, '目的地 Destination', 'B');
      if (this.dropoffInput) {
        this.dropoffInput.nativeElement.value = dropoff.address;
      }
    }

    if (pickup && dropoff) {
      this.selectionStep.set('complete');
      await this.calculateAndRenderRoute();
    } else {
      this.selectionStep.set(pickup ? 'dropoff' : 'pickup');
      this.showRoute();
    }

    return true;
  }

  private applyPickupPlace(place: Place): void {
    this.pickup.set(place);
    this.tripState.setPickup(place);
    this.pickupMarker?.setMap(null);
    this.pickupMarker = this.createMarker(place.coords, '上車 Pickup', 'A');
    if (this.pickupInput) {
      this.pickupInput.nativeElement.value = place.address;
    }
  }

  private applyDropoffPlace(place: Place): void {
    this.dropoff.set(place);
    this.tripState.setDropoff(place);
    this.dropoffMarker?.setMap(null);
    this.dropoffMarker = this.createMarker(place.coords, '目的地 Destination', 'B');
    if (this.dropoffInput) {
      this.dropoffInput.nativeElement.value = place.address;
    }
  }

  private loadRecentPlaces(): void {
    this.recentPickupPlaces.set(this.readRecentPlaces(RECENT_PICKUP_STORAGE_KEY));
    this.recentDropoffPlaces.set(this.readRecentPlaces(RECENT_DROPOFF_STORAGE_KEY));
  }

  private rememberRecentPlace(type: 'pickup' | 'dropoff', place: Place): void {
    const storageKey = type === 'pickup' ? RECENT_PICKUP_STORAGE_KEY : RECENT_DROPOFF_STORAGE_KEY;
    const existing = type === 'pickup' ? this.recentPickupPlaces() : this.recentDropoffPlaces();
    const nextPlaces = [
      place,
      ...existing.filter((item) => item.address !== place.address),
    ].slice(0, MAX_RECENT_PLACES);

    if (type === 'pickup') {
      this.recentPickupPlaces.set(nextPlaces);
    } else {
      this.recentDropoffPlaces.set(nextPlaces);
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(nextPlaces));
    } catch {
      // localStorage can be unavailable in private browsing or locked-down browsers.
    }
  }

  private removeRecentPlace(type: 'pickup' | 'dropoff', place: Place): void {
    const storageKey = type === 'pickup' ? RECENT_PICKUP_STORAGE_KEY : RECENT_DROPOFF_STORAGE_KEY;
    const existing = type === 'pickup' ? this.recentPickupPlaces() : this.recentDropoffPlaces();
    const nextPlaces = existing.filter((item) => item.address !== place.address);

    if (type === 'pickup') {
      this.recentPickupPlaces.set(nextPlaces);
      this.activeRecentList.set(nextPlaces.length > 0 ? 'pickup' : null);
    } else {
      this.recentDropoffPlaces.set(nextPlaces);
      this.activeRecentList.set(nextPlaces.length > 0 ? 'dropoff' : null);
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(nextPlaces));
    } catch {
      // localStorage can be unavailable in private browsing or locked-down browsers.
    }
  }

  private readRecentPlaces(storageKey: string): readonly Place[] {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter((item): item is Place => this.isPlace(item)).slice(0, MAX_RECENT_PLACES);
    } catch {
      return [];
    }
  }

  private isPlace(value: unknown): value is Place {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const place = value as Partial<Place>;
    return (
      typeof place.address === 'string' &&
      typeof place.coords?.lat === 'number' &&
      typeof place.coords?.lng === 'number'
    );
  }

  private getBrowserLocation(): Promise<LatLng> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        reject,
        { enableHighAccuracy: true, maximumAge: 60_000, timeout: 10_000 },
      );
    });
  }

  private createMarker(position: LatLng, title: string, label: string): google.maps.Marker | null {
    if (!this.mapsApi || !this.googleMap) {
      return null;
    }

    return new this.mapsApi.maps.Marker({
      map: this.googleMap,
      position,
      title,
      label,
    });
  }

  private setUserLocationMarker(position: LatLng): void {
    if (!this.mapsApi || !this.googleMap) {
      return;
    }

    this.userLocationMarker?.setMap(null);
    this.userLocationMarker = new this.mapsApi.maps.Marker({
      map: this.googleMap,
      position,
      title: '我的位置 My location',
      icon: {
        path: this.mapsApi.maps.SymbolPath.CIRCLE,
        scale: 9,
        fillColor: '#1a73e8',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeOpacity: 1,
        strokeWeight: 3,
      },
      zIndex: 1000,
    });
  }

  private fitSelectedPlaceBounds(places: readonly Place[]): void {
    if (!this.mapsApi || !this.googleMap || places.length === 0) {
      return;
    }

    const bounds = new this.mapsApi.maps.LatLngBounds();
    for (const place of places) {
      bounds.extend(place.coords);
    }

    this.googleMap.fitBounds(bounds, SELECTED_ROUTE_ZOOM_PADDING_PX);
  }

  private fitRouteBounds(result: google.maps.DirectionsResult): void {
    const bounds = result.routes[0]?.bounds;
    if (!bounds || !this.googleMap) {
      return;
    }

    this.googleMap.fitBounds(bounds, SELECTED_ROUTE_ZOOM_PADDING_PX);
  }

  private setError(code: MapError['code']): void {
    const messages: Record<MapError['code'], Omit<MapError, 'code'>> = {
      'missing-api-key': {
        messageZh: '未設定 Google Maps API key，暫時未能載入地圖。',
        messageEn: 'Google Maps API key is not configured yet.',
      },
      'geolocation-denied': {
        messageZh: '未能取得目前位置，已使用香港作為預設位置。',
        messageEn: 'Current location is unavailable. Hong Kong is used as the default area.',
      },
      'map-load-failed': {
        messageZh: '地圖載入失敗，請稍後再試。',
        messageEn: 'Map failed to load. Please try again later.',
      },
      'geocode-failed': {
        messageZh: '未能讀取地址，請在地圖上再試一次。',
        messageEn: 'Address lookup failed. Please tap the map again.',
      },
      'route-failed': {
        messageZh: '未能計算路線，請重新選擇地點。',
        messageEn: 'Route calculation failed. Please choose the locations again.',
      },
    };

    this.error.set({ code, ...messages[code] });
  }
}
