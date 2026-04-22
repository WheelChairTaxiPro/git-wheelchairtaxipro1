import { Routes } from '@angular/router';

export const bookingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./booking').then(m => m.Booking),
    title: 'Booking | Wheelchair Taxi Pro',
  },
];
