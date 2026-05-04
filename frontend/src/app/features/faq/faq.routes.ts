import { Routes } from '@angular/router';

export const faqRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./faq').then(m => m.Faq),
    title: '輪的 · 常見問題',
  },
];
