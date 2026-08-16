import { Routes } from '@angular/router';

export const aboutRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./about').then(m => m.About),
    title: '關於我們 | 輪的 · 香港輪椅的士',
    data: {
      seo: {
        description:
          '專業輪椅的士簡介：服務香港輪椅人士、長者及行動不便人士，合法的士營運，提供機場、覆診及院舍接送。',
        canonicalPath: '/about/',
        ogImage: '/banner-header.png',
      },
    },
  },
];
