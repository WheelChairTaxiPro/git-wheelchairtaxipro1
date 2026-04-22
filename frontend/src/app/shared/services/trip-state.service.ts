import { Injectable, computed, signal } from '@angular/core';
import { TripSelection } from '../models/trip.models';

/**
 * Canonical shared state for the user's currently-selected trip.
 *
 * Signals-first per frontend/ARCHITECTURE.md §4a — no BehaviorSubject.
 * Owning service holds a private mutable signal; consumers get read-only access.
 */
@Injectable({ providedIn: 'root' })
export class TripStateService {
  private readonly _selection = signal<TripSelection | null>(null);

  readonly selection = this._selection.asReadonly();
  readonly hasTrip = computed(() => this._selection() !== null);

  set(selection: TripSelection): void {
    this._selection.set(selection);
  }

  clear(): void {
    this._selection.set(null);
  }
}
