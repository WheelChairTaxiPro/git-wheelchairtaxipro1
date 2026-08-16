import { Routes } from '@angular/router';

export const routes: Routes = [
  /** Landing: open the booking form first (`/booking` canonical URL stays for deep links). */
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'booking',
  },
  {
    path: 'route',
    loadChildren: () => import('./features/map/map.routes').then(m => m.mapRoutes),
  },
  {
    path: 'booking',
    loadChildren: () => import('./features/booking/booking.routes').then(m => m.bookingRoutes),
  },
  {
    path: 'pricing',
    loadChildren: () => import('./features/pricing/pricing.routes').then(m => m.pricingRoutes),
  },
  {
    path: 'faq',
    loadChildren: () => import('./features/faq/faq.routes').then(m => m.faqRoutes),
  },
  {
    path: 'about',
    loadChildren: () => import('./features/about/about.routes').then(m => m.aboutRoutes),
  },

  // /map → /route — map screen URL was `/` then briefly `/map` during iterations.
  { path: 'map', redirectTo: 'route', pathMatch: 'full' },

  // English mirror (Phase 1.2 — scaffold only, implement when i18n is wired):
  // { path: 'en', loadChildren: () => import('./features/en/en.routes').then(m => m.enRoutes) },

  { path: '**', redirectTo: 'booking' },
];
