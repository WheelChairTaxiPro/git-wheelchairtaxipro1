import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, PLATFORM_ID, ViewChild, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import type { LatLng, Place } from '../../shared/models/trip.models';
import { TripStateService } from '../../shared/services/trip-state.service';
import { formatGooglePlaceDisplayAddress } from '../../shared/util/format-place-address';
import {
  importPlaceAutocompleteCtor,
  latLngFromGooglePlaceLocation,
  type GmpPlaceAutocompleteElement,
  type GmpPlacePredictionSelectEvent,
} from '../../shared/util/google-maps-new-place';
import { DEFAULT_MAP_ZOOM, GOOGLE_CLOUD_MAP_VECTOR_ID, HONG_KONG_CENTER, MAP_COPY, SELECTED_ROUTE_ZOOM_PADDING_PX, USER_LOCATION_ZOOM } from './map.config';
import type { MapError, RouteSummary, SelectionStep } from './map.models';
import { GoogleMapsLoaderService } from './services/google-maps-loader.service';
import { MapService, type ComputedDrivingRoute } from './services/map.service';

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
  @ViewChild('pickupAutocompleteHost') private pickupAutocompleteHost?: ElementRef<HTMLElement>;
  @ViewChild('dropoffAutocompleteHost') private dropoffAutocompleteHost?: ElementRef<HTMLElement>;

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

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly loader = inject(GoogleMapsLoaderService);
  private readonly mapService = inject(MapService);
  private readonly tripState = inject(TripStateService);
  private readonly router = inject(Router);

  private mapsApi: typeof google | null = null;
  private googleMap: google.maps.Map | null = null;
  private geocoder: google.maps.Geocoder | null = null;
  /** Loaded once for {@link google.maps.marker.AdvancedMarkerElement}. */
  private markerLibrary: google.maps.MarkerLibrary | null = null;
  /** Route polylines from `ComputedDrivingRoute.createPolylines` (replaces DirectionsRenderer). */
  private readonly routePolylines: google.maps.Polyline[] = [];
  private latestComputedRoute: ComputedDrivingRoute | null = null;
  private pickupMarker: google.maps.marker.AdvancedMarkerElement | null = null;
  private dropoffMarker: google.maps.marker.AdvancedMarkerElement | null = null;
  private userLocationMarker: google.maps.marker.AdvancedMarkerElement | null = null;
  private clickListener: google.maps.MapsEventListener | null = null;
  private mapPlacesAutocompleteAbort: AbortController | null = null;
  /** Syncs autocomplete bias with the visible viewport (replaces `bindTo('bounds', map)`). */
  private mapPacBoundsIdleListener: google.maps.MapsEventListener | null = null;
  private pickupPac: GmpPlaceAutocompleteElement | null = null;
  private dropoffPac: GmpPlaceAutocompleteElement | null = null;

  async ngAfterViewInit(): Promise<void> {
    if (!this.isBrowser) {
      return;
    }

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
        mapId: GOOGLE_CLOUD_MAP_VECTOR_ID,
        clickableIcons: false,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
      });
      this.geocoder = new maps.maps.Geocoder();

      try {
        const markerNamespace = await google.maps.importLibrary('marker');
        this.markerLibrary = markerNamespace;
      } catch (markerErr) {
        console.warn('[map] Marker library failed to load — map works but pins/advanced markers unavailable.', markerErr);
      }
      this.clickListener = this.googleMap.addListener('click', (event: google.maps.MapMouseEvent) => {
        void this.handleMapClick(event);
      });
      this.loadRecentPlaces();
      await this.setupMapPlaceAutocompleteWidgets();

      const restored = await this.restoreTripState();
      if (!restored) {
        await this.centerOnCurrentLocation();
      }
    } catch (err) {
      console.error('[map] Map init failed', err);
      this.setError('map-load-failed');
    } finally {
      this.isLoading.set(false);
    }
  }

  ngOnDestroy(): void {
    this.clickListener?.remove();
    this.teardownMapPlaceAutocompleteWidgets();
    this.detachAdvancedMarker(this.pickupMarker);
    this.detachAdvancedMarker(this.dropoffMarker);
    this.detachAdvancedMarker(this.userLocationMarker);
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

    if (this.latestComputedRoute) {
      this.fitRouteFromComputed(this.latestComputedRoute);
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
    this.detachAdvancedMarker(this.pickupMarker);
    this.detachAdvancedMarker(this.dropoffMarker);
    this.clearRenderedRoute();
    this.pickupMarker = null;
    this.dropoffMarker = null;
    this.pickup.set(null);
    this.dropoff.set(null);
    this.routeSummary.set(null);
    this.latestComputedRoute = null;
    this.selectionStep.set('pickup');
    this.error.set(null);
    this.tripState.clear();
    if (this.pickupPac) {
      this.pickupPac.value = '';
    }
    if (this.dropoffPac) {
      this.dropoffPac.value = '';
    }
  }

  protected clearPickup(): void {
    this.activeRecentList.set(null);
    this.detachAdvancedMarker(this.pickupMarker);
    this.pickupMarker = null;
    this.pickup.set(null);
    this.routeSummary.set(null);
    this.latestComputedRoute = null;
    this.clearRenderedRoute();
    this.tripState.clearPickup();
    this.selectionStep.set('pickup');
    if (this.pickupPac) {
      this.pickupPac.value = '';
    }
  }

  protected clearDropoff(): void {
    this.activeRecentList.set(null);
    this.detachAdvancedMarker(this.dropoffMarker);
    this.dropoffMarker = null;
    this.dropoff.set(null);
    this.routeSummary.set(null);
    this.latestComputedRoute = null;
    this.clearRenderedRoute();
    this.tripState.clearDropoff();
    this.selectionStep.set(this.pickup() ? 'dropoff' : 'pickup');
    if (this.dropoffPac) {
      this.dropoffPac.value = '';
    }
  }

  protected showRecentPickupPlaces(): void {
    if (!this.pickupPac?.value.trim() && this.recentPickupPlaces().length > 0) {
      this.activeRecentList.set('pickup');
    }
  }

  protected showRecentDropoffPlaces(): void {
    if (!this.dropoffPac?.value.trim() && this.recentDropoffPlaces().length > 0) {
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
    if (!pickup || !dropoff || !this.mapsApi || !this.googleMap) {
      return;
    }

    try {
      const { routeForMap, summary } = await this.mapService.calculateRoute(this.mapsApi, pickup, dropoff);

      this.clearRenderedRoutePolylines();
      const polylines = await routeForMap.createPolylines({
        strokeColor: '#1a73e8',
        strokeOpacity: 0.92,
        strokeWeight: 5,
      });
      for (const line of [...polylines]) {
        line.setMap(this.googleMap);
        this.routePolylines.push(line);
      }

      this.latestComputedRoute = routeForMap;
      this.fitRouteFromComputed(routeForMap);

      this.routeSummary.set(summary);
      this.selectionStep.set('complete');
      this.tripState.set({
        pickup: summary.pickup,
        dropoff: summary.dropoff,
        estimatedDistanceKm: summary.distanceKm,
        estimatedDurationText: summary.durationText,
        etaRoutingBaseline: summary.etaRoutingBaseline,
        etaTrafficNow: summary.etaTrafficNow,
        etaAtScheduledPickup: summary.etaAtScheduledPickup,
      });
    } catch (err) {
      console.error('[map] calculateAndRenderRoute failed', err);
      this.setError('route-failed');
    }
  }

  private clearRenderedRoutePolylines(): void {
    for (const line of this.routePolylines) {
      line.setMap(null);
    }
    this.routePolylines.length = 0;
  }

  private clearRenderedRoute(): void {
    this.clearRenderedRoutePolylines();
  }

  private detachAdvancedMarker(marker: google.maps.marker.AdvancedMarkerElement | null): void {
    if (!marker) {
      return;
    }
    marker.map = null;
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

  private teardownMapPlaceAutocompleteWidgets(): void {
    this.mapPlacesAutocompleteAbort?.abort();
    this.mapPlacesAutocompleteAbort = null;
    this.mapPacBoundsIdleListener?.remove();
    this.mapPacBoundsIdleListener = null;
    this.pickupPac = null;
    this.dropoffPac = null;
    const pickupHost = this.pickupAutocompleteHost?.nativeElement;
    const dropoffHost = this.dropoffAutocompleteHost?.nativeElement;
    if (pickupHost) {
      pickupHost.innerHTML = '';
    }
    if (dropoffHost) {
      dropoffHost.innerHTML = '';
    }
  }

  private async setupMapPlaceAutocompleteWidgets(): Promise<void> {
    if (
      !this.mapsApi ||
      !this.googleMap ||
      !this.pickupAutocompleteHost?.nativeElement ||
      !this.dropoffAutocompleteHost?.nativeElement
    ) {
      return;
    }

    this.teardownMapPlaceAutocompleteWidgets();

    try {
      const PlaceAutocompleteCtor = await importPlaceAutocompleteCtor();

      const baseOpts = {
        requestedLanguage: 'zh-HK',
        requestedRegion: 'hk',
        includedRegionCodes: ['HK', 'NZ'],
        noInputIcon: true,
      };

      const pickup = new PlaceAutocompleteCtor({
        ...baseOpts,
        placeholder: '搜尋上車地點',
      });
      const dropoff = new PlaceAutocompleteCtor({
        ...baseOpts,
        placeholder: '搜尋目的地',
      });

      this.pickupAutocompleteHost.nativeElement.appendChild(pickup);
      this.dropoffAutocompleteHost.nativeElement.appendChild(dropoff);

      this.pickupPac = pickup;
      this.dropoffPac = dropoff;

      const boundsSync = (): void => {
        const bounds = this.googleMap?.getBounds();
        if (!bounds || !this.pickupPac || !this.dropoffPac) {
          return;
        }
        this.pickupPac.locationBias = bounds;
        this.dropoffPac.locationBias = bounds;
      };
      boundsSync();
      this.mapPacBoundsIdleListener = this.googleMap.addListener('idle', boundsSync);

      const ac = new AbortController();
      this.mapPlacesAutocompleteAbort = ac;

      pickup.addEventListener(
        'gmp-select',
        (ev: Event) => void this.handleMapPacSelect(ev as GmpPlacePredictionSelectEvent, 'pickup'),
        { signal: ac.signal },
      );
      dropoff.addEventListener(
        'gmp-select',
        (ev: Event) => void this.handleMapPacSelect(ev as GmpPlacePredictionSelectEvent, 'dropoff'),
        { signal: ac.signal },
      );

      pickup.addEventListener('focus', () => this.showRecentPickupPlaces(), { signal: ac.signal });
      pickup.addEventListener(
        'input',
        () => {
          const nextValue = pickup.value;
          this.activeRecentList.set(nextValue.trim() ? null : 'pickup');
          const selectedPickup = this.pickup();
          if (selectedPickup && nextValue !== selectedPickup.address) {
            const keep = nextValue;
            this.clearPickup();
            if (this.pickupPac) {
              this.pickupPac.value = keep;
            }
          }
        },
        { signal: ac.signal },
      );

      dropoff.addEventListener('focus', () => this.showRecentDropoffPlaces(), { signal: ac.signal });
      dropoff.addEventListener(
        'input',
        () => {
          const nextValue = dropoff.value;
          this.activeRecentList.set(nextValue.trim() ? null : 'dropoff');
          const selectedDropoff = this.dropoff();
          if (selectedDropoff && nextValue !== selectedDropoff.address) {
            const keep = nextValue;
            this.clearDropoff();
            if (this.dropoffPac) {
              this.dropoffPac.value = keep;
            }
          }
        },
        { signal: ac.signal },
      );
    } catch (err) {
      console.warn('[map] Places autocomplete widgets failed', err);
    }
  }

  private async handleMapPacSelect(
    event: GmpPlacePredictionSelectEvent,
    target: 'pickup' | 'dropoff',
  ): Promise<void> {
    const prediction = event.placePrediction;
    if (!prediction) {
      return;
    }

    let fetched;
    try {
      fetched = prediction.toPlace();
      await fetched.fetchFields({
        fields: ['displayName', 'formattedAddress', 'location'],
      });
    } catch {
      this.setError('geocode-failed');
      return;
    }

    const coords = latLngFromGooglePlaceLocation(fetched);
    if (!coords) {
      this.setError('geocode-failed');
      return;
    }

    const selected: Place = {
      coords,
      address:
        formatGooglePlaceDisplayAddress(fetched) ?? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
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
      this.detachAdvancedMarker(this.pickupMarker);
      this.pickupMarker = this.createMarker(pickup.coords, '上車 Pickup', 'A');
      if (this.pickupPac) {
        this.pickupPac.value = pickup.address;
      }
    }

    if (dropoff) {
      this.dropoff.set(dropoff);
      this.detachAdvancedMarker(this.dropoffMarker);
      this.dropoffMarker = this.createMarker(dropoff.coords, '目的地 Destination', 'B');
      if (this.dropoffPac) {
        this.dropoffPac.value = dropoff.address;
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
    this.detachAdvancedMarker(this.pickupMarker);
    this.pickupMarker = this.createMarker(place.coords, '上車 Pickup', 'A');
    if (this.pickupPac) {
      this.pickupPac.value = place.address;
    }
  }

  private applyDropoffPlace(place: Place): void {
    this.dropoff.set(place);
    this.tripState.setDropoff(place);
    this.detachAdvancedMarker(this.dropoffMarker);
    this.dropoffMarker = this.createMarker(place.coords, '目的地 Destination', 'B');
    if (this.dropoffPac) {
      this.dropoffPac.value = place.address;
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

  private createMarker(
    position: LatLng,
    title: string,
    label: string,
  ): google.maps.marker.AdvancedMarkerElement | null {
    if (!this.markerLibrary || !this.googleMap) {
      return null;
    }

    const { AdvancedMarkerElement, PinElement } = this.markerLibrary;
    const isPickup = label === 'A';

    const pin = new PinElement({
      glyph: label,
      background: isPickup ? '#1a73e8' : '#34a853',
      borderColor: isPickup ? '#0d47a1' : '#1e8e3e',
      glyphColor: '#ffffff',
    });

    return new AdvancedMarkerElement({
      map: this.googleMap,
      position,
      title,
      content: pin,
      zIndex: isPickup ? 12 : 11,
    });
  }

  private setUserLocationMarker(position: LatLng): void {
    if (!this.markerLibrary || !this.googleMap) {
      return;
    }

    const { AdvancedMarkerElement, PinElement } = this.markerLibrary;
    this.detachAdvancedMarker(this.userLocationMarker);

    const pin = new PinElement({
      background: '#1a73e8',
      borderColor: '#ffffff',
      glyph: '',
      glyphColor: '#ffffff',
    });

    this.userLocationMarker = new AdvancedMarkerElement({
      map: this.googleMap,
      position,
      title: '我的位置 My location',
      content: pin,
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

  private fitRouteFromComputed(route: ComputedDrivingRoute): void {
    if (!this.mapsApi || !this.googleMap) {
      return;
    }

    const viewport = route.viewport;
    if (viewport) {
      this.googleMap.fitBounds(viewport, SELECTED_ROUTE_ZOOM_PADDING_PX);
      return;
    }

    const rawPath = route.path;
    if (!rawPath?.length) {
      return;
    }

    const bounds = new this.mapsApi.maps.LatLngBounds();
    for (const pt of rawPath) {
      bounds.extend(pt as google.maps.LatLng | google.maps.LatLngLiteral | google.maps.LatLngAltitudeLiteral);
    }
    try {
      this.googleMap.fitBounds(bounds, SELECTED_ROUTE_ZOOM_PADDING_PX);
    } catch {
      // Bounds can be degenerate when path normalisation fails — ignore zoom fit.
    }
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
