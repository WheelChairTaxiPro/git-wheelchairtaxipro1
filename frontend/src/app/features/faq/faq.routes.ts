import { Routes } from '@angular/router';

export const faqRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./faq').then(m => m.Faq),
    title: '輪椅的士常見問題 | 輪的',
    data: {
      seo: {
        description:
          '香港輪椅的士常見問題：如何預約、收費及服務費、服務範圍、機場及醫院接送、車型選擇與聯絡方法。',
        canonicalPath: '/faq/',
        ogImage: '/banner-header.png',
      },
    },
  },
];
