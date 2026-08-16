import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';

import { GOOGLE_MAPS_API_KEY } from '../../../core/config/google-maps.generated';

@Injectable({ providedIn: 'root' })
export class GoogleMapsLoaderService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private loadPromise: Promise<typeof google> | null = null;
  private optionsSet = false;

  readonly hasApiKey = GOOGLE_MAPS_API_KEY.length > 0;

  load(): Promise<typeof google> {
    if (!this.isBrowser) {
      return Promise.reject(new Error('Google Maps can only load in the browser.'));
    }

    if (!GOOGLE_MAPS_API_KEY) {
      return Promise.reject(new Error('Missing GOOGLE_MAPS_API_KEY.'));
    }

    this.loadPromise ??= this.loadLibraries();

    return this.loadPromise;
  }

  private async loadLibraries(): Promise<typeof google> {
    if (!this.optionsSet) {
      setOptions({
        key: GOOGLE_MAPS_API_KEY,
        v: 'weekly',
        language: 'zh-HK',
        region: 'HK',
      });
      this.optionsSet = true;
    }

    /*
     * Keep the bootstrap minimal: failing `routes` or `marker` here would block *every* Maps
     * consumer (booking + map). Load those libraries lazily instead:
     * - `routes` → `MapService` when computing a driving route (`Route.computeRoutes`)
     * - `marker` → `Map` after the base map is created (advanced markers only)
     */
    await Promise.all([importLibrary('maps'), importLibrary('geocoding'), importLibrary('places')]);

    return google;
  }
}
