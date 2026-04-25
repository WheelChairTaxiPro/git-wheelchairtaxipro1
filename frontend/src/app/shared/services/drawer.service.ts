import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

/**
 * Single source of truth for the hamburger drawer's open/close state.
 *
 * Closes automatically on any successful route navigation — which covers both
 * menu links inside the drawer and bottom-nav tabs outside it (both are
 * routerLinks). Components that perform non-navigating actions (contact-strip
 * taps, outside clicks on the sidenav content) must call `close()` explicitly.
 */
@Injectable({ providedIn: 'root' })
export class DrawerService {
  private readonly _isOpen = signal(false);
  readonly isOpen = this._isOpen.asReadonly();

  constructor() {
    const router = inject(Router);
    const destroyRef = inject(DestroyRef);

    router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(destroyRef),
      )
      .subscribe(() => this._isOpen.set(false));
  }

  open(): void {
    this._isOpen.set(true);
  }

  close(): void {
    this._isOpen.set(false);
  }

  toggle(): void {
    this._isOpen.update((v) => !v);
  }
}
