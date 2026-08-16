import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

import { GA_MEASUREMENT_ID } from '../config/google-analytics.generated';

/**
 * Loads GA4 (gtag.js) in the browser when a measurement ID is configured.
 * No-op during SSR/prerender and when `GA_MEASUREMENT_ID` is empty, so local
 * builds without the env var simply skip analytics.
 *
 * `contact-strip` fires `gtag('event', 'contact_tap', …)` once this is loaded.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly document = inject(DOCUMENT);
  private initialized = false;

  init(): void {
    if (this.initialized || !GA_MEASUREMENT_ID) {
      return;
    }
    const win = this.document.defaultView as
      | (Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void })
      | null;
    if (!win) {
      return; // SSR/prerender
    }
    this.initialized = true;

    win.dataLayer = win.dataLayer ?? [];
    win.gtag = function gtag(...args: unknown[]) {
      win.dataLayer!.push(args);
    };
    win.gtag('js', new Date());
    win.gtag('config', GA_MEASUREMENT_ID);

    const script = this.document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    this.document.head.appendChild(script);
  }
}
