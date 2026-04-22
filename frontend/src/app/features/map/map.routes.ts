import { Routes } from '@angular/router';

export const mapRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./map').then(m => m.Map),
    title: 'Map | Wheelchair Taxi Pro',
  },
];
