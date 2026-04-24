import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
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

  // /map was removed to keep one canonical URL per screen.
  // Incoming redirect for anyone who bookmarked the old path during testing:
  { path: 'map', redirectTo: '', pathMatch: 'full' },

  // English mirror (Phase 1.2 — scaffold only, implement when i18n is wired):
  // { path: 'en', loadChildren: () => import('./features/en/en.routes').then(m => m.enRoutes) },

  { path: '**', redirectTo: '' },
];
