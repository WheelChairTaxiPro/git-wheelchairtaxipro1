import { Injectable, computed, signal } from '@angular/core';
import { Place, TripSelection } from '../models/trip.models';

/**
 * Canonical shared state for the user's currently-selected trip.
 *
 * Signals-first per frontend/ARCHITECTURE.md §4a — no BehaviorSubject.
 * Owning service holds a private mutable signal; consumers get read-only access.
 */
@Injectable({ providedIn: 'root' })
export class TripStateService {
  private readonly _selection = signal<TripSelection | null>(null);
  private readonly _pickup = signal<Place | null>(null);
  private readonly _dropoff = signal<Place | null>(null);

  readonly selection = this._selection.asReadonly();
  readonly pickup = this._pickup.asReadonly();
  readonly dropoff = this._dropoff.asReadonly();
  readonly hasTrip = computed(() => this._selection() !== null);

  set(selection: TripSelection): void {
    this._pickup.set(selection.pickup);
    this._dropoff.set(selection.dropoff);
    this._selection.set(selection);
  }

  setPickup(pickup: Place): void {
    this._pickup.set(pickup);
    this._selection.set(null);
  }

  setDropoff(dropoff: Place): void {
    this._dropoff.set(dropoff);
    this._selection.set(null);
  }

  clearPickup(): void {
    this._pickup.set(null);
    this._selection.set(null);
  }

  clearDropoff(): void {
    this._dropoff.set(null);
    this._selection.set(null);
  }

  clear(): void {
    this._pickup.set(null);
    this._dropoff.set(null);
    this._selection.set(null);
  }
}
