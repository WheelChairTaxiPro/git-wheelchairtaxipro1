import { Routes } from '@angular/router';

export const pricingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pricing').then(m => m.Pricing),
    title: '輪的 · 收費',
  },
];
