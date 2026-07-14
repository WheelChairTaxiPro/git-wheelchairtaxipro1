import { Routes } from '@angular/router';

export const bookingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./booking').then(m => m.Booking),
    title: '輪椅的士預約 | 輪的 · 香港',
    data: {
      seo: {
        description:
          '即時預約香港輪椅的士及無障礙接送。填寫網上表格後以 WhatsApp 確認，咪錶車資另加預約服務費，服務九龍、新界及大嶼山。',
        canonicalPath: '/booking',
        ogImage: '/banner-header.png',
      },
    },
  },
];
