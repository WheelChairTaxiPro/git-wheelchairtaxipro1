import { Component, inject, signal } from '@angular/core';

import type { Place } from '../../shared/models/trip.models';
import { TripStateService } from '../../shared/services/trip-state.service';

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
export class Booking {
  protected readonly trip = inject(TripStateService);
  protected readonly vehicleOptions = VEHICLE_OPTIONS;
  protected readonly submitted = signal(false);
  protected readonly recentPickupPlaces = signal<readonly Place[]>([]);
  protected readonly recentDropoffPlaces = signal<readonly Place[]>([]);
  protected readonly activeRecentList = signal<'pickup' | 'dropoff' | null>(null);

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
  }

  protected clearDestination(): void {
    this.activeRecentList.set(null);
    this.trip.clearDropoff();
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
  }

  protected selectRecentDropoff(place: Place): void {
    this.activeRecentList.set(null);
    this.trip.setDropoff(place);
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
