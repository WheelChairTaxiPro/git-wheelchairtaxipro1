import { Routes } from '@angular/router';

export const mapRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./map').then(m => m.Map),
    title: '輪椅的士路程及時間預覽 | 輪的',
    data: {
      seo: {
        description:
          '查閱香港輪椅的士上車點至目的地的大約路程及行車時間，方便預約前預覽行程。',
        canonicalPath: '/route',
        ogImage: '/banner-header.png',
      },
    },
  },
];
