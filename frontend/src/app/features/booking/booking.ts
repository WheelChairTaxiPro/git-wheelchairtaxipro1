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
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { DEFAULT_CONTACT_CHANNELS } from '../../shared/config/contact.config';
import type { Place } from '../../shared/models/trip.models';
import { TripStateService } from '../../shared/services/trip-state.service';
import { formatGooglePlaceDisplayAddress } from '../../shared/util/format-place-address';
import {
  hkLatLngBiasBounds,
  importPlaceAutocompleteCtor,
  latLngFromGooglePlaceLocation,
  type GmpPlaceAutocompleteElement,
  type GmpPlacePredictionSelectEvent,
} from '../../shared/util/google-maps-new-place';
import { GoogleMapsLoaderService } from '../map/services/google-maps-loader.service';
import { MapService } from '../map/services/map.service';
import {
  PickupDatetimeDialog,
  type PickupDatetimeDialogData,
  type PickupDatetimeDialogResult,
} from './pickup-datetime-dialog/pickup-datetime-dialog';

const RECENT_PICKUP_STORAGE_KEY = 'wheelchairTaxiPro.recentPickupPlaces';
const RECENT_DROPOFF_STORAGE_KEY = 'wheelchairTaxiPro.recentDropoffPlaces';
const MAX_RECENT_PLACES = 5;

/** `datetime-local` string in the user's local timezone (minute precision). */
function formatDateTimeLocalValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Booking trigger label — same 12 h + 上午／下午 as the picker (WhatsApp line stays 24 h). */
function formatPickupScheduleButtonLabel_zhHant(datetimeLocalValue: string): string {
  const trimmed = datetimeLocalValue.trim();
  if (!trimmed) {
    return '';
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(trimmed);
  if (!m) {
    return trimmed;
  }
  const [, year, month, day, hh, minute] = m;
  const h24 = parseInt(hh, 10);
  const minNum = parseInt(minute, 10);
  const isPm = h24 >= 12;
  let h12 = h24 % 12;
  if (h12 === 0) {
    h12 = 12;
  }
  const segment = isPm ? '下午' : '上午';
  const minStr = String(minNum).padStart(2, '0');
  return `${year}年${month}月${day}日，${segment} ${h12}:${minStr}`;
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

/** Splits map duration text so units (分鐘／小時) can use normal weight in the UI. */
function splitTripDurationParts(text: string): { readonly num: string; readonly unit: string } {
  const minMatch = text.match(/^(.+)\s+(分鐘)$/);
  if (minMatch) {
    return { num: minMatch[1], unit: ` ${minMatch[2]}` };
  }
  const hourMatch = text.match(/^(.+)\s+(小時)$/);
  if (hourMatch) {
    return { num: hourMatch[1], unit: ` ${hourMatch[2]}` };
  }
  return { num: text, unit: '' };
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
  imports: [MatDialogModule],
  templateUrl: './booking.html',
  styleUrl: './booking.scss',
})
export class Booking implements AfterViewInit, OnDestroy {
  protected readonly splitTripDurationParts = splitTripDurationParts;

  @ViewChild('pickupLocationField') private pickupLocationField?: ElementRef<HTMLElement>;
  @ViewChild('destinationField') private destinationField?: ElementRef<HTMLElement>;
  @ViewChild('pickupAutocompleteHost')
  private pickupAutocompleteHost?: ElementRef<HTMLElement>;
  @ViewChild('dropoffAutocompleteHost')
  private dropoffAutocompleteHost?: ElementRef<HTMLElement>;
  @ViewChild('pickupAddrInput') private pickupAddrInput?: ElementRef<HTMLInputElement>;
  @ViewChild('dropoffAddrInput') private dropoffAddrInput?: ElementRef<HTMLInputElement>;
  @ViewChild('pickupDateTimeInput') private pickupDateTimeInput?: ElementRef<HTMLInputElement>;
  @ViewChild('bookingFormEl') private bookingFormEl?: ElementRef<HTMLFormElement>;

  private readonly injector = inject(Injector);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly dialog = inject(MatDialog);
  private readonly mapsLoader = inject(GoogleMapsLoaderService);
  private readonly mapService = inject(MapService);
  private bookingPlacesAutocompleteAbort: AbortController | null = null;
  /** New Places widget (`gmp-place-autocomplete`); mirrored into hidden-named inputs for `FormData`. */
  private pickupPlaceAutocompleteEl: GmpPlaceAutocompleteElement | null = null;
  private dropoffPlaceAutocompleteEl: GmpPlaceAutocompleteElement | null = null;
  private formValidationListenersAbort: AbortController | null = null;
  private routeRequestId = 0;
  /**
   * After we finish one `computeRoutes` for `pickup|dropoff`, do not retry until endpoints change —
   * avoids hammering Routes API / the console when the API errors.
   */
  private finalizedRouteVariantsKey = '';
  /** Prevents overlapping duplicate calls for the same snapshot while `computeRoutes` is in flight. */
  private inFlightRouteVariantsKey: string | null = null;

  protected readonly trip = inject(TripStateService);
  protected readonly vehicleOptions = VEHICLE_OPTIONS;
  protected readonly submitted = signal(false);
  /** Same `wa.me` URL handed to `window.open` — shown as a link if the popup is blocked so this tab stays on the booking page. */
  protected readonly whatsappHandoffUrl = signal<string | null>(null);
  protected readonly recentPickupPlaces = signal<readonly Place[]>([]);
  protected readonly recentDropoffPlaces = signal<readonly Place[]>([]);
  protected readonly activeRecentList = signal<'pickup' | 'dropoff' | null>(null);
  /** Mirrors hidden `pickupDateTime` (minute-precision local string). */
  protected readonly pickupScheduleValue = signal('');
  protected readonly pickupScheduleInvalid = signal(false);
  protected readonly pickupScheduleDisplayLabel = computed(() => {
    const v = this.pickupScheduleValue().trim();
    return v ? formatPickupScheduleButtonLabel_zhHant(v) : '點選以選擇日期及時間';
  });

  constructor() {
    effect(
      () => {
        void this.trip.pickup()?.address;
        void this.trip.dropoff()?.address;
        queueMicrotask(() => this.syncAddressInputsFromTrip());
      },
      { injector: this.injector },
    );

    /** Whenever both endpoints are set (via autocomplete), compute distance + drive time (`computeRoutes` once). */
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
   * Same single baseline route as the map screen (`TRAFFIC_UNAWARE`); pickup schedule does not change polyline/time.
   */
  private async computeAndStoreTripRoute(pickup: Place, dropoff: Place): Promise<void> {
    const variantsContextKey = `${pickup.address}|${dropoff.address}`;

    if (variantsContextKey === this.finalizedRouteVariantsKey) {
      return;
    }
    if (this.inFlightRouteVariantsKey === variantsContextKey) {
      return;
    }

    const requestId = ++this.routeRequestId;
    this.inFlightRouteVariantsKey = variantsContextKey;

    try {
      if (!this.mapsLoader.hasApiKey) {
        this.finalizedRouteVariantsKey = variantsContextKey;
        this.trip.set({ pickup, dropoff });
        return;
      }

      const mapsApi = await this.mapsLoader.load();
      if (requestId !== this.routeRequestId) {
        return;
      }
      const { summary } = await this.mapService.calculateRouteVariants(mapsApi, pickup, dropoff);
      if (requestId !== this.routeRequestId) {
        return;
      }
      this.finalizedRouteVariantsKey = variantsContextKey;
      this.trip.set({
        pickup: summary.pickup,
        dropoff: summary.dropoff,
        estimatedDistanceKm: summary.distanceKm,
        estimatedDurationText: summary.durationText,
      });
    } catch (err) {
      if (requestId === this.routeRequestId) {
        console.warn(
          '[booking] route calc failed — enable Routes API for this GCP project/key and wait a few minutes for propagation:',
          err,
        );
        this.finalizedRouteVariantsKey = variantsContextKey;
        this.trip.set({ pickup, dropoff });
      }
    } finally {
      if (this.inFlightRouteVariantsKey === variantsContextKey) {
        this.inFlightRouteVariantsKey = null;
      }
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
    this.teardownBookingPlacesAutocomplete();
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
    this.copyPlacesWidgetsToBookingMirrors();

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

    if (!this.pickupScheduleValue().trim()) {
      this.pickupScheduleInvalid.set(true);
      return false;
    }
    this.pickupScheduleInvalid.set(false);

    for (const el of controls) {
      if (!el.checkValidity()) {
        el.setCustomValidity(chineseValidityMessage(el));
        el.reportValidity();
        return false;
      }
    }

    return true;
  }

  private teardownBookingPlacesAutocomplete(): void {
    this.bookingPlacesAutocompleteAbort?.abort();
    this.bookingPlacesAutocompleteAbort = null;
    this.pickupPlaceAutocompleteEl = null;
    this.dropoffPlaceAutocompleteEl = null;
    const pickupHost = this.pickupAutocompleteHost?.nativeElement;
    const dropoffHost = this.dropoffAutocompleteHost?.nativeElement;
    if (pickupHost) {
      pickupHost.innerHTML = '';
    }
    if (dropoffHost) {
      dropoffHost.innerHTML = '';
    }
  }

  /** Maps `gmp-select` selection → coords + TripState (`fetchFields` for display + geometry). */
  private async handleBookingPacSelect(event: GmpPlacePredictionSelectEvent, target: 'pickup' | 'dropoff'): Promise<void> {
    const prediction = event.placePrediction;
    if (!prediction) {
      return;
    }

    let place;
    try {
      place = prediction.toPlace();
      await place.fetchFields({
        fields: ['displayName', 'formattedAddress', 'location'],
      });
    } catch {
      return;
    }

    const coords = latLngFromGooglePlaceLocation(place);
    if (!coords) {
      return;
    }

    const selected: Place = {
      coords,
      address:
        formatGooglePlaceDisplayAddress(place) ?? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
    };

    this.activeRecentList.set(null);
    if (target === 'pickup') {
      this.trip.setPickup(selected);
      if (this.pickupPlaceAutocompleteEl) {
        this.pickupPlaceAutocompleteEl.value = selected.address;
      }
      this.copyPlacesWidgetsToBookingMirrors();
      this.clearNativeFieldValidity(this.pickupAddrInput?.nativeElement);
    } else {
      this.trip.setDropoff(selected);
      if (this.dropoffPlaceAutocompleteEl) {
        this.dropoffPlaceAutocompleteEl.value = selected.address;
      }
      this.copyPlacesWidgetsToBookingMirrors();
      this.clearNativeFieldValidity(this.dropoffAddrInput?.nativeElement);
    }
    this.rememberRecentPlace(target, selected);
  }

  /** Keep named mirror inputs aligned with autocomplete widgets (`FormData` + `reportValidity`). */
  private copyPlacesWidgetsToBookingMirrors(): void {
    const pu = this.pickupAddrInput?.nativeElement;
    const pac = this.pickupPlaceAutocompleteEl;
    if (pu && pac) {
      pu.value = pac.value;
    }
    const du = this.dropoffAddrInput?.nativeElement;
    const dac = this.dropoffPlaceAutocompleteEl;
    if (du && dac) {
      du.value = dac.value;
    }
  }

  private onPickupTypingChanged(raw: string): void {
    this.activeRecentList.set(raw.trim() ? null : 'pickup');
    const selectedPickup = this.trip.pickup();
    if (!raw.trim() || (selectedPickup && raw !== selectedPickup.address)) {
      this.trip.clearPickup();
    }
  }

  private onDropoffTypingChanged(raw: string): void {
    this.activeRecentList.set(raw.trim() ? null : 'dropoff');
    const selectedDropoff = this.trip.dropoff();
    if (!raw.trim() || (selectedDropoff && raw !== selectedDropoff.address)) {
      this.trip.clearDropoff();
    }
  }

  /**
   * `PlaceAutocompleteElement` (`gmp-place-autocomplete`): booking page has no map — bias to HK /
   * restrict to HK + NZ (same as legacy `componentRestrictions`).
   */
  private async setupPlacesAutocomplete(): Promise<void> {
    if (
      !this.mapsLoader.hasApiKey ||
      !this.pickupAutocompleteHost?.nativeElement ||
      !this.dropoffAutocompleteHost?.nativeElement
    ) {
      return;
    }

    try {
      const mapsApi = await this.mapsLoader.load();
      this.teardownBookingPlacesAutocomplete();

      const PlaceAutocompleteCtor = await importPlaceAutocompleteCtor();
      const hkBias = hkLatLngBiasBounds(mapsApi.maps.LatLngBounds);

      const baseOpts = {
        requestedLanguage: 'zh-HK',
        requestedRegion: 'hk',
        includedRegionCodes: ['HK', 'NZ'],
        locationBias: hkBias,
        noInputIcon: true,
      };

      const pickup = new PlaceAutocompleteCtor({
        ...baseOpts,
        placeholder: '請輸入或搜尋上車地點',
      });
      const dropoff = new PlaceAutocompleteCtor({
        ...baseOpts,
        placeholder: '請輸入或搜尋目的地',
      });

      this.pickupAutocompleteHost.nativeElement.appendChild(pickup);
      this.dropoffAutocompleteHost.nativeElement.appendChild(dropoff);

      this.pickupPlaceAutocompleteEl = pickup;
      this.dropoffPlaceAutocompleteEl = dropoff;

      const ac = new AbortController();
      this.bookingPlacesAutocompleteAbort = ac;

      pickup.addEventListener(
        'gmp-select',
        (ev: Event) => void this.handleBookingPacSelect(ev as GmpPlacePredictionSelectEvent, 'pickup'),
        { signal: ac.signal },
      );
      dropoff.addEventListener(
        'gmp-select',
        (ev: Event) => void this.handleBookingPacSelect(ev as GmpPlacePredictionSelectEvent, 'dropoff'),
        { signal: ac.signal },
      );

      pickup.addEventListener('focus', () => this.showRecentPickupPlaces(), { signal: ac.signal });
      pickup.addEventListener(
        'input',
        () => {
          this.copyPlacesWidgetsToBookingMirrors();
          this.onPickupTypingChanged(pickup.value);
        },
        { signal: ac.signal },
      );

      dropoff.addEventListener('focus', () => this.showRecentDropoffPlaces(), { signal: ac.signal });
      dropoff.addEventListener(
        'input',
        () => {
          this.copyPlacesWidgetsToBookingMirrors();
          this.onDropoffTypingChanged(dropoff.value);
        },
        { signal: ac.signal },
      );
    } catch {
      // Missing key, unsupported browser, Places (New) not enabled, blocked network …
    }
  }

  protected clearPickupLocation(): void {
    this.activeRecentList.set(null);
    this.trip.clearPickup();
    if (this.pickupPlaceAutocompleteEl) {
      this.pickupPlaceAutocompleteEl.value = '';
    }
    if (this.pickupAddrInput) {
      const el = this.pickupAddrInput.nativeElement;
      el.value = '';
      this.clearNativeFieldValidity(el);
    }
  }

  protected clearDestination(): void {
    this.activeRecentList.set(null);
    this.trip.clearDropoff();
    if (this.dropoffPlaceAutocompleteEl) {
      this.dropoffPlaceAutocompleteEl.value = '';
    }
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
    if (this.pickupPlaceAutocompleteEl) {
      this.pickupPlaceAutocompleteEl.value = place.address;
    }
    this.copyPlacesWidgetsToBookingMirrors();
    if (this.pickupAddrInput) {
      this.clearNativeFieldValidity(this.pickupAddrInput.nativeElement);
    }
    this.rememberRecentPlace('pickup', place);
  }

  protected selectRecentDropoff(place: Place): void {
    this.activeRecentList.set(null);
    this.trip.setDropoff(place);
    if (this.dropoffPlaceAutocompleteEl) {
      this.dropoffPlaceAutocompleteEl.value = place.address;
    }
    this.copyPlacesWidgetsToBookingMirrors();
    if (this.dropoffAddrInput) {
      this.clearNativeFieldValidity(this.dropoffAddrInput.nativeElement);
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
      if (this.pickupPlaceAutocompleteEl) {
        this.pickupPlaceAutocompleteEl.value = '';
      }
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
      if (this.dropoffPlaceAutocompleteEl) {
        this.dropoffPlaceAutocompleteEl.value = '';
      }
      if (this.dropoffAddrInput) {
        const el = this.dropoffAddrInput.nativeElement;
        el.value = '';
        this.clearNativeFieldValidity(el);
      }
    }
  }

  /** Pre-fill empty schedule with now (dialog + ETAs use the same string). */
  private applyDefaultPickupDateTime(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const el = this.pickupDateTimeInput?.nativeElement;
    if (!el) {
      return;
    }
    if (el.value) {
      this.pickupScheduleValue.set(el.value);
      return;
    }
    const v = formatDateTimeLocalValue(new Date());
    el.value = v;
    this.pickupScheduleValue.set(v);
    this.clearNativeFieldValidity(el);
  }

  private commitPickupSchedule(value: string): void {
    this.pickupScheduleValue.set(value);
    const el = this.pickupDateTimeInput?.nativeElement;
    if (el) {
      el.value = value;
      this.clearNativeFieldValidity(el);
    }
  }

  /** Opens the sheet with explicit 「設定」 — native pickers cannot add a Set button. */
  protected openPickupScheduleDialog(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const data: PickupDatetimeDialogData = { initialValue: this.pickupScheduleValue() };
    const ref = this.dialog.open(PickupDatetimeDialog, {
      data,
      width: 'min(100vw - 32px, 440px)',
      autoFocus: 'dialog',
    });
    ref.afterClosed().subscribe((result: PickupDatetimeDialogResult | undefined) => {
      if (!result || result.kind === 'cancel') {
        return;
      }
      if (result.kind === 'set') {
        this.commitPickupSchedule(result.value);
        this.pickupScheduleInvalid.set(false);
      }
    });
  }

  /** Keep Places widgets (+ mirror inputs) aligned with TripState unless the widget is focused. */
  private syncAddressInputsFromTrip(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const nextPickupAddr = this.trip.pickup()?.address ?? '';
    const nextDropoffAddr = this.trip.dropoff()?.address ?? '';

    const pacBusyPickup = !!this.pickupPlaceAutocompleteEl?.matches(':focus-within');
    if (!pacBusyPickup) {
      if (this.pickupPlaceAutocompleteEl) {
        if (this.pickupPlaceAutocompleteEl.value !== nextPickupAddr) {
          this.pickupPlaceAutocompleteEl.value = nextPickupAddr;
        }
      } else if (this.pickupAddrInput?.nativeElement) {
        const el = this.pickupAddrInput.nativeElement;
        if (el.value !== nextPickupAddr) {
          el.value = nextPickupAddr;
        }
        this.clearNativeFieldValidity(el);
      }
    }

    const pacBusyDrop = !!this.dropoffPlaceAutocompleteEl?.matches(':focus-within');
    if (!pacBusyDrop) {
      if (this.dropoffPlaceAutocompleteEl) {
        if (this.dropoffPlaceAutocompleteEl.value !== nextDropoffAddr) {
          this.dropoffPlaceAutocompleteEl.value = nextDropoffAddr;
        }
      } else if (this.dropoffAddrInput?.nativeElement) {
        const el = this.dropoffAddrInput.nativeElement;
        if (el.value !== nextDropoffAddr) {
          el.value = nextDropoffAddr;
        }
        this.clearNativeFieldValidity(el);
      }
    }

    this.copyPlacesWidgetsToBookingMirrors();

    const mirrorPick = this.pickupAddrInput?.nativeElement;
    if (mirrorPick) {
      this.clearNativeFieldValidity(mirrorPick);
    }
    const mirrorDrop = this.dropoffAddrInput?.nativeElement;
    if (mirrorDrop) {
      this.clearNativeFieldValidity(mirrorDrop);
    }
  }

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;

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
      lines.push('', '—— 路程估算 ——');
      if (typeof selectedTrip.estimatedDistanceKm === 'number') {
        lines.push(`預估距離：${selectedTrip.estimatedDistanceKm} km`);
      }
      if (selectedTrip.estimatedDurationText) {
        lines.push(`預估行車時間：${selectedTrip.estimatedDurationText}`);
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
