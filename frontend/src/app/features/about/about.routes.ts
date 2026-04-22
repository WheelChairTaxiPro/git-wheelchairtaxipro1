import { Routes } from '@angular/router';

export const aboutRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./about').then(m => m.About),
    title: 'About | Wheelchair Taxi Pro',
  },
];
