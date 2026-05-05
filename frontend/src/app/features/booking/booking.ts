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

import { DEFAULT_CONTACT_CHANNELS } from '../../shared/config/contact.config';
import type { LatLng, Place } from '../../shared/models/trip.models';
import { TripStateService } from '../../shared/services/trip-state.service';
import { formatPlaceDisplayAddress } from '../../shared/util/format-place-address';
import { GoogleMapsLoaderService } from '../map/services/google-maps-loader.service';
import { MapService } from '../map/services/map.service';

const RECENT_PICKUP_STORAGE_KEY = 'wheelchairTaxiPro.recentPickupPlaces';
const RECENT_DROPOFF_STORAGE_KEY = 'wheelchairTaxiPro.recentDropoffPlaces';
const MAX_RECENT_PLACES = 5;

/** `datetime-local` string in the user's local timezone (minute precision). */
function formatDateTimeLocalValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** `YYYY-MM-DDTHH:mm` from `<input type="datetime-local">` → WhatsApp-readable line (e.g. 2026年05月04日, 21:59時). */
function formatPickupDateTimeForWhatsapp(datetimeLocalValue: string): string {
  const trimmed = datetimeLocalValue.trim();
  if (!trimmed) {
    return '';
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(trimmed);
  if (!m) {
    return trimmed;
  }
  const [, year, month, day, hour, minute] = m;
  return `${year}年${month}月${day}日, ${hour}:${minute}時`;
}

/** Native constraint validation uses English in many browsers; map to Traditional Chinese. */
function chineseValidityMessage(
  el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
): string {
  const v = el.validity;
  if (v.valueMissing) {
    if (el instanceof HTMLInputElement && el.type === 'datetime-local') {
      return '請選擇預約日期及時間';
    }
    if (el instanceof HTMLInputElement && el.type === 'number') {
      return '請填寫此欄位';
    }
    if (el instanceof HTMLSelectElement) {
      return el.name === 'vehicleType' ? '請選擇車型' : '請選擇選項';
    }
    return '請填寫此欄位';
  }
  if (v.typeMismatch) {
    return '格式不正確';
  }
  if (v.rangeUnderflow) {
    return '數值過小';
  }
  if (v.rangeOverflow) {
    return '數值過大';
  }
  if (v.stepMismatch) {
    return '請輸入有效數值';
  }
  if (v.patternMismatch) {
    return '格式不符要求';
  }
  if (v.tooLong) {
    return '內容過長';
  }
  if (v.tooShort) {
    return '內容過短';
  }
  return '此欄位有誤';
}

/** Keep WhatsApp URLs within common browser limits (UTF‑8 expands Chinese). */
const MAX_WHATSAPP_URL_ENCODED_LEN = 3600;

function clipMessageForWaUrlUtf8(raw: string): string {
  let t = raw;
  while (encodeURIComponent(t).length > MAX_WHATSAPP_URL_ENCODED_LEN && t.length > 120) {
    t = t.slice(0, Math.floor(t.length * 0.92)).trimEnd();
  }
  if (t.length < raw.trimEnd().length) {
    return `${t}\n…（其餘內容請以電話／WhatsApp 補充）`;
  }
  return t;
}

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
  @ViewChild('pickupDateTimeInput') private pickupDateTimeInput?: ElementRef<HTMLInputElement>;
  @ViewChild('bookingFormEl') private bookingFormEl?: ElementRef<HTMLFormElement>;

  private readonly injector = inject(Injector);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly mapsLoader = inject(GoogleMapsLoaderService);
  private readonly mapService = inject(MapService);
  private pickupAutocompleteListener: google.maps.MapsEventListener | null = null;
  private dropoffAutocompleteListener: google.maps.MapsEventListener | null = null;
  private formValidationListenersAbort: AbortController | null = null;
  private directionsService: google.maps.DirectionsService | null = null;
  private routeRequestId = 0;

  protected readonly trip = inject(TripStateService);
  protected readonly vehicleOptions = VEHICLE_OPTIONS;
  protected readonly submitted = signal(false);
  /** Same `wa.me` URL handed to `window.open` — shown as a link if the popup is blocked so this tab stays on the booking page. */
  protected readonly whatsappHandoffUrl = signal<string | null>(null);
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

    /** Whenever both endpoints are set (via autocomplete), compute a `TripSelection` with distance + ETA. */
    effect(
      () => {
        const pickup = this.trip.pickup();
        const dropoff = this.trip.dropoff();
        if (pickup && dropoff && isPlatformBrowser(this.platformId)) {
          void this.computeAndStoreTripRoute(pickup, dropoff);
        }
      },
      { injector: this.injector },
    );
  }

  /**
   * Use the existing `MapService.calculateRoute` so booking page shows the same
   * distance/duration the map page does, even if the user never visits `/map`.
   * Falls back to a selection without ETA if Maps is unavailable or the request fails.
   */
  private async computeAndStoreTripRoute(pickup: Place, dropoff: Place): Promise<void> {
    const requestId = ++this.routeRequestId;
    const existing = this.trip.selection();
    if (
      existing &&
      existing.pickup === pickup &&
      existing.dropoff === dropoff &&
      typeof existing.estimatedDistanceKm === 'number'
    ) {
      return;
    }

    if (!this.mapsLoader.hasApiKey) {
      this.trip.set({ pickup, dropoff });
      return;
    }

    try {
      const mapsApi = await this.mapsLoader.load();
      if (requestId !== this.routeRequestId) {
        return;
      }
      this.directionsService ??= new mapsApi.maps.DirectionsService();
      const { summary } = await this.mapService.calculateRoute(this.directionsService, pickup, dropoff);
      if (requestId !== this.routeRequestId) {
        return;
      }
      this.trip.set({
        pickup: summary.pickup,
        dropoff: summary.dropoff,
        estimatedDistanceKm: summary.distanceKm,
        estimatedDurationText: summary.durationText,
      });
    } catch (err) {
      console.warn('[booking] route calc failed', err);
      if (requestId !== this.routeRequestId) {
        return;
      }
      this.trip.set({ pickup, dropoff });
    }
  }

  ngAfterViewInit(): void {
    this.syncAddressInputsFromTrip();
    this.applyDefaultPickupDateTime();
    if (isPlatformBrowser(this.platformId)) {
      void this.setupPlacesAutocomplete();
      this.attachChineseFormValidation();
    }
  }

  ngOnDestroy(): void {
    this.formValidationListenersAbort?.abort();
    this.formValidationListenersAbort = null;
    this.pickupAutocompleteListener?.remove();
    this.dropoffAutocompleteListener?.remove();
  }

  /** Form uses `novalidate`; we validate in code on submit (`validateBookingFormZh`). Keeps clears on input/click. */
  private attachChineseFormValidation(): void {
    const form = this.bookingFormEl?.nativeElement;
    if (!form) {
      return;
    }

    this.formValidationListenersAbort?.abort();
    const ac = new AbortController();
    this.formValidationListenersAbort = ac;

    /** Before submit handler runs on click, strip stale errors on programmatically filled controls (no `input` event). */
    const clearStaleCustomValidityBeforeSubmit = (event: Event): void => {
      let submitControl: HTMLElement | null = null;
      const raw = event.target;
      if (raw instanceof HTMLButtonElement && raw.type === 'submit') {
        submitControl = raw;
      } else if (raw instanceof Element) {
        submitControl = raw.closest('button[type="submit"], input[type="submit"]');
      }
      if (!submitControl || !form.contains(submitControl)) {
        return;
      }
      for (const el of form.querySelectorAll('input, select')) {
        if (!(el instanceof HTMLInputElement) && !(el instanceof HTMLSelectElement)) {
          continue;
        }
        const hasNonEmpty =
          el instanceof HTMLSelectElement
            ? el.value.trim().length > 0
            : el.type === 'checkbox' || el.type === 'radio'
              ? el.checked
              : !!el.value?.trim?.();
        if (hasNonEmpty) {
          el.setCustomValidity('');
        }
      }
    };
    form.addEventListener('click', clearStaleCustomValidityBeforeSubmit, { capture: true, signal: ac.signal });

    const clearCustomValidity = (event: Event): void => {
      const el = event.target;
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLSelectElement ||
        el instanceof HTMLTextAreaElement
      ) {
        el.setCustomValidity('');
      }
    };
    form.addEventListener('input', clearCustomValidity, { signal: ac.signal });
    form.addEventListener('change', clearCustomValidity, { signal: ac.signal });
  }

  /** Clears `setCustomValidity()`; required after failed submit when value is set without an `input` event (Places, sync, recent list). */
  private clearNativeFieldValidity(el: HTMLInputElement | HTMLSelectElement | null | undefined): void {
    el?.setCustomValidity('');
  }

  /**
   * With `novalidate`, browsers never show implicit English balloons; apply Chinese via `reportValidity()`
   * only after assigning `customValidity`.
   */
  private validateBookingFormZh(form: HTMLFormElement): boolean {
    const controls: Array<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> = [];
    for (let i = 0; i < form.elements.length; i++) {
      const node = form.elements[i];
      if (
        !(node instanceof HTMLInputElement) &&
        !(node instanceof HTMLSelectElement) &&
        !(node instanceof HTMLTextAreaElement)
      ) {
        continue;
      }
      if (!node.willValidate) {
        continue;
      }
      controls.push(node);
    }

    for (const el of controls) {
      el.setCustomValidity('');
    }

    for (const el of controls) {
      if (!el.checkValidity()) {
        el.setCustomValidity(chineseValidityMessage(el));
        el.reportValidity();
        return false;
      }
    }

    return true;
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
      address:
        formatPlaceDisplayAddress(place) ??
        `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
    };

    this.activeRecentList.set(null);
    if (target === 'pickup') {
      this.trip.setPickup(selected);
      if (this.pickupAddrInput) {
        const el = this.pickupAddrInput.nativeElement;
        el.value = selected.address;
        this.clearNativeFieldValidity(el);
      }
    } else {
      this.trip.setDropoff(selected);
      if (this.dropoffAddrInput) {
        const el = this.dropoffAddrInput.nativeElement;
        el.value = selected.address;
        this.clearNativeFieldValidity(el);
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
      const el = this.pickupAddrInput.nativeElement;
      el.value = '';
      this.clearNativeFieldValidity(el);
    }
  }

  protected clearDestination(): void {
    this.activeRecentList.set(null);
    this.trip.clearDropoff();
    if (this.dropoffAddrInput) {
      const el = this.dropoffAddrInput.nativeElement;
      el.value = '';
      this.clearNativeFieldValidity(el);
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
      const el = this.pickupAddrInput.nativeElement;
      el.value = place.address;
      this.clearNativeFieldValidity(el);
    }
    this.rememberRecentPlace('pickup', place);
  }

  protected selectRecentDropoff(place: Place): void {
    this.activeRecentList.set(null);
    this.trip.setDropoff(place);
    if (this.dropoffAddrInput) {
      const el = this.dropoffAddrInput.nativeElement;
      el.value = place.address;
      this.clearNativeFieldValidity(el);
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
        const el = this.pickupAddrInput.nativeElement;
        el.value = '';
        this.clearNativeFieldValidity(el);
      }
    }
  }

  protected removeRecentDropoff(place: Place): void {
    this.removeRecentPlace('dropoff', place);
    if (this.trip.dropoff()?.address === place.address) {
      this.trip.clearDropoff();
      if (this.dropoffAddrInput) {
        const el = this.dropoffAddrInput.nativeElement;
        el.value = '';
        this.clearNativeFieldValidity(el);
      }
    }
  }

  /** Pre-fill empty `datetime-local` with now; user can change anytime. */
  private applyDefaultPickupDateTime(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const el = this.pickupDateTimeInput?.nativeElement;
    if (!el || el.value) {
      return;
    }
    el.value = formatDateTimeLocalValue(new Date());
    this.clearNativeFieldValidity(el);
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
      this.clearNativeFieldValidity(pickupEl);
    }

    const dropoffEl = this.dropoffAddrInput?.nativeElement;
    if (dropoffEl && document.activeElement !== dropoffEl) {
      const next = dropoffPlace?.address ?? '';
      if (dropoffEl.value !== next) {
        dropoffEl.value = next;
      }
      this.clearNativeFieldValidity(dropoffEl);
    }
  }

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;

    if (isPlatformBrowser(this.platformId)) {
      const dtEl = this.pickupDateTimeInput?.nativeElement;
      if (dtEl) {
        dtEl.value = formatDateTimeLocalValue(new Date());
        this.clearNativeFieldValidity(dtEl);
      }
    }

    if (!this.validateBookingFormZh(form)) {
      return;
    }

    const fd = new FormData(form);
    let messageBody = this.buildBookingWhatsappMessage(fd);
    messageBody = clipMessageForWaUrlUtf8(messageBody);
    const waUrl =
      `https://wa.me/${DEFAULT_CONTACT_CHANNELS.whatsapp}?text=${encodeURIComponent(messageBody)}`;

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.submitted.set(true);
    this.whatsappHandoffUrl.set(waUrl);

    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // Popup may be blocked; same-tab navigation is deliberately avoided — see `whatsappHandoffUrl` in the UI.
    }
  }

  /** Plain-text bundle for WhatsApp prefilled compose. */
  private buildBookingWhatsappMessage(fd: FormData): string {
    const g = (k: string): string => (fd.get(k)?.toString() ?? '').trim();

    const vehicleValue = g('vehicleType');
    const vehicleLabel = VEHICLE_OPTIONS.find((opt) => opt.value === vehicleValue)?.label ?? vehicleValue;

    const lines: string[] = [
      '我想預約輪椅的士',
      '',
      `預約日期及時間：${formatPickupDateTimeForWhatsapp(g('pickupDateTime'))}`,
      `總人數（包括輪椅乘客）：${g('passengerCount')}`,
      `輪椅數量：${g('wheelchairCount')}`,
      `上車地點：${g('pickupLocation')}`,
      `目的地：${g('destination')}`,
      `聯絡電話：${g('phone')}`,
      `稱謂：${g('contactName')}`,
      `指定車型：${vehicleLabel}`,
    ];

    const selectedTrip = this.trip.selection();
    if (selectedTrip) {
      lines.push('', '—— 已由地圖選路 ——');
      if (typeof selectedTrip.estimatedDistanceKm === 'number') {
        lines.push(`預估距離：${selectedTrip.estimatedDistanceKm} km`);
      }
      if (selectedTrip.estimatedDurationText) {
        lines.push(`預估時間：${selectedTrip.estimatedDurationText}`);
      }
    }

    return lines.join('\n');
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
