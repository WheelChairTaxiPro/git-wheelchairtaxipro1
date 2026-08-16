import { Routes } from '@angular/router';

export const pricingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pricing').then(m => m.Pricing),
    title: '輪椅的士收費及服務費 | 輪的',
    data: {
      seo: {
        description:
          '香港輪椅的士收費說明：按的士咪錶收費，另加預約服務費 $100 / $120 / $150（視車型而定），收費透明無隱藏費用。',
        canonicalPath: '/pricing/',
        ogImage: '/banner-header.png',
      },
    },
  },
];
