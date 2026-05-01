import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Injector,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  effect,
  inject,
  signal,
} from '@angular/core';

import type { LatLng, Place } from '../../shared/models/trip.models';
import { TripStateService } from '../../shared/services/trip-state.service';
import { GoogleMapsLoaderService } from '../map/services/google-maps-loader.service';

const RECENT_PICKUP_STORAGE_KEY = 'wheelchairTaxiPro.recentPickupPlaces';
const RECENT_DROPOFF_STORAGE_KEY = 'wheelchairTaxiPro.recentDropoffPlaces';
const MAX_RECENT_PLACES = 5;

interface VehicleOption {
  readonly value: string;
  readonly label: string;
}

const VEHICLE_OPTIONS: readonly VehicleOption[] = [
  { value: 'small-new', label: '新款細輪椅的士' },
  { value: 'standard-old', label: '普通舊款輪椅的士' },
  { value: 'large-luxury', label: '特大豪華輪椅的士' },
  { value: 'system-arranged', label: '由系統安排' },
];

@Component({
  selector: 'app-booking',
  imports: [],
  templateUrl: './booking.html',
  styleUrl: './booking.scss',
})
export class Booking implements AfterViewInit, OnDestroy {
  @ViewChild('pickupLocationField') private pickupLocationField?: ElementRef<HTMLElement>;
  @ViewChild('destinationField') private destinationField?: ElementRef<HTMLElement>;
  @ViewChild('pickupAddrInput') private pickupAddrInput?: ElementRef<HTMLInputElement>;
  @ViewChild('dropoffAddrInput') private dropoffAddrInput?: ElementRef<HTMLInputElement>;

  private readonly injector = inject(Injector);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly mapsLoader = inject(GoogleMapsLoaderService);
  private pickupAutocompleteListener: google.maps.MapsEventListener | null = null;
  private dropoffAutocompleteListener: google.maps.MapsEventListener | null = null;

  protected readonly trip = inject(TripStateService);
  protected readonly vehicleOptions = VEHICLE_OPTIONS;
  protected readonly submitted = signal(false);
  protected readonly recentPickupPlaces = signal<readonly Place[]>([]);
  protected readonly recentDropoffPlaces = signal<readonly Place[]>([]);
  protected readonly activeRecentList = signal<'pickup' | 'dropoff' | null>(null);

  constructor() {
    effect(
      () => {
        void this.trip.pickup()?.address;
        void this.trip.dropoff()?.address;
        queueMicrotask(() => this.syncAddressInputsFromTrip());
      },
      { injector: this.injector },
    );
  }

  ngAfterViewInit(): void {
    this.syncAddressInputsFromTrip();
    if (isPlatformBrowser(this.platformId)) {
      void this.setupPlacesAutocomplete();
    }
  }

  ngOnDestroy(): void {
    this.pickupAutocompleteListener?.remove();
    this.dropoffAutocompleteListener?.remove();
  }

  /** Same Places Autocomplete wiring as Map page (`google.maps.places.Autocomplete`). */
  private async setupPlacesAutocomplete(): Promise<void> {
    if (
      !this.mapsLoader.hasApiKey ||
      !this.pickupAddrInput?.nativeElement ||
      !this.dropoffAddrInput?.nativeElement
    ) {
      return;
    }

    try {
      const mapsApi = await this.mapsLoader.load();
      const options: google.maps.places.AutocompleteOptions = {
        componentRestrictions: { country: ['hk', 'nz'] },
        fields: ['formatted_address', 'geometry', 'name'],
      };

      const pickupAutocomplete = new mapsApi.maps.places.Autocomplete(this.pickupAddrInput.nativeElement, options);
      const dropoffAutocomplete = new mapsApi.maps.places.Autocomplete(this.dropoffAddrInput.nativeElement, options);

      // Map page biases to the visible map; booking has no map — use HK-centered bounds instead.
      const hkBias = new mapsApi.maps.LatLngBounds({ lat: 22.12, lng: 113.78 }, { lat: 22.58, lng: 114.48 });
      pickupAutocomplete.setBounds(hkBias);
      dropoffAutocomplete.setBounds(hkBias);

      this.pickupAutocompleteListener = pickupAutocomplete.addListener('place_changed', () => {
        this.applyAutocompletePlace(pickupAutocomplete, 'pickup');
      });
      this.dropoffAutocompleteListener = dropoffAutocomplete.addListener('place_changed', () => {
        this.applyAutocompletePlace(dropoffAutocomplete, 'dropoff');
      });
    } catch {
      // Missing key, blocked network, etc. — form still accepts typed addresses only.
    }
  }

  private applyAutocompletePlace(
    autocomplete: google.maps.places.Autocomplete,
    target: 'pickup' | 'dropoff',
  ): void {
    const place = autocomplete.getPlace();
    const location = place.geometry?.location;
    if (!location) {
      return;
    }

    const coords: LatLng = { lat: location.lat(), lng: location.lng() };
    const selected: Place = {
      coords,
      address: place.formatted_address ?? place.name ?? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
    };

    this.activeRecentList.set(null);
    if (target === 'pickup') {
      this.trip.setPickup(selected);
      if (this.pickupAddrInput) {
        this.pickupAddrInput.nativeElement.value = selected.address;
      }
    } else {
      this.trip.setDropoff(selected);
      if (this.dropoffAddrInput) {
        this.dropoffAddrInput.nativeElement.value = selected.address;
      }
    }
    this.rememberRecentPlace(target, selected);
  }

  protected onPickupLocationInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.activeRecentList.set(input.value.trim() ? null : 'pickup');
    const selectedPickup = this.trip.pickup();
    if (!input.value.trim() || (selectedPickup && input.value !== selectedPickup.address)) {
      this.trip.clearPickup();
    }
  }

  protected onDestinationInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.activeRecentList.set(input.value.trim() ? null : 'dropoff');
    const selectedDropoff = this.trip.dropoff();
    if (!input.value.trim() || (selectedDropoff && input.value !== selectedDropoff.address)) {
      this.trip.clearDropoff();
    }
  }

  protected clearPickupLocation(): void {
    this.activeRecentList.set(null);
    this.trip.clearPickup();
    if (this.pickupAddrInput) {
      this.pickupAddrInput.nativeElement.value = '';
    }
  }

  protected clearDestination(): void {
    this.activeRecentList.set(null);
    this.trip.clearDropoff();
    if (this.dropoffAddrInput) {
      this.dropoffAddrInput.nativeElement.value = '';
    }
  }

  protected showRecentPickupPlaces(): void {
    this.recentPickupPlaces.set(this.readRecentPlaces(RECENT_PICKUP_STORAGE_KEY));
    if (!this.trip.pickup() && this.recentPickupPlaces().length > 0) {
      this.activeRecentList.set('pickup');
    }
  }

  protected showRecentDropoffPlaces(): void {
    this.recentDropoffPlaces.set(this.readRecentPlaces(RECENT_DROPOFF_STORAGE_KEY));
    if (!this.trip.dropoff() && this.recentDropoffPlaces().length > 0) {
      this.activeRecentList.set('dropoff');
    }
  }

  protected selectRecentPickup(place: Place): void {
    this.activeRecentList.set(null);
    this.trip.setPickup(place);
    if (this.pickupAddrInput) {
      this.pickupAddrInput.nativeElement.value = place.address;
    }
    this.rememberRecentPlace('pickup', place);
  }

  protected selectRecentDropoff(place: Place): void {
    this.activeRecentList.set(null);
    this.trip.setDropoff(place);
    if (this.dropoffAddrInput) {
      this.dropoffAddrInput.nativeElement.value = place.address;
    }
    this.rememberRecentPlace('dropoff', place);
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
      ? this.pickupLocationField?.nativeElement
      : this.destinationField?.nativeElement;

    if (!activeField?.contains(target)) {
      this.activeRecentList.set(null);
    }
  }

  protected removeRecentPickup(place: Place): void {
    this.removeRecentPlace('pickup', place);
    if (this.trip.pickup()?.address === place.address) {
      this.trip.clearPickup();
      if (this.pickupAddrInput) {
        this.pickupAddrInput.nativeElement.value = '';
      }
    }
  }

  protected removeRecentDropoff(place: Place): void {
    this.removeRecentPlace('dropoff', place);
    if (this.trip.dropoff()?.address === place.address) {
      this.trip.clearDropoff();
      if (this.dropoffAddrInput) {
        this.dropoffAddrInput.nativeElement.value = '';
      }
    }
  }

  /** Keep native inputs aligned with TripState except while the user is typing in that field. */
  private syncAddressInputsFromTrip(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const pickupPlace = this.trip.pickup();
    const dropoffPlace = this.trip.dropoff();

    const pickupEl = this.pickupAddrInput?.nativeElement;
    if (pickupEl && document.activeElement !== pickupEl) {
      const next = pickupPlace?.address ?? '';
      if (pickupEl.value !== next) {
        pickupEl.value = next;
      }
    }

    const dropoffEl = this.dropoffAddrInput?.nativeElement;
    if (dropoffEl && document.activeElement !== dropoffEl) {
      const next = dropoffPlace?.address ?? '';
      if (dropoffEl.value !== next) {
        dropoffEl.value = next;
      }
    }
  }

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Prototype only: real API submission lands with the backend booking slice.
    this.submitted.set(true);
    this.trip.clear();
    this.syncAddressInputsFromTrip();
    form.reset();
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

  private rememberRecentPlace(type: 'pickup' | 'dropoff', place: Place): void {
    const storageKey = type === 'pickup' ? RECENT_PICKUP_STORAGE_KEY : RECENT_DROPOFF_STORAGE_KEY;
    const existing = type === 'pickup' ? this.recentPickupPlaces() : this.recentDropoffPlaces();
    const nextPlaces = [place, ...existing.filter((item) => item.address !== place.address)].slice(
      0,
      MAX_RECENT_PLACES,
    );

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
}
