import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import type { RouteSeoConfig } from '../models/seo.models';

const SITE_ORIGIN = 'https://wheelchairtaxipro.com';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private listening = false;

  /** Subscribe once from the root app so titles/meta update on every navigation. */
  listenForRouteChanges(): void {
    if (this.listening) {
      return;
    }
    this.listening = true;
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.applyFromActivatedRoute());
  }

  applyFromActivatedRoute(): void {
    const root = this.router.routerState.snapshot.root;
    const { seo, title } = this.findSeoData(root);
    if (!seo) {
      return;
    }
    const pageTitle = typeof title === 'string' && title.length > 0 ? title : this.title.getTitle();
    this.apply(pageTitle, seo);
  }

  apply(pageTitle: string, seo: RouteSeoConfig): void {
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: seo.description });

    const canonical = `${SITE_ORIGIN}${seo.canonicalPath}`;
    this.setLinkTag('canonical', canonical);

    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:type', content: seo.ogType ?? 'website' });
    this.meta.updateTag({ property: 'og:locale', content: 'zh_HK' });
    this.meta.updateTag({
      property: 'og:image',
      content: `${SITE_ORIGIN}${seo.ogImage ?? '/banner-header.png'}`,
    });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    if (seo.noindex) {
      this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    } else {
      this.meta.removeTag('name="robots"');
    }
  }

  private findSeoData(route: ActivatedRouteSnapshot): {
    seo?: RouteSeoConfig;
    title?: string;
  } {
    let seo = route.data['seo'] as RouteSeoConfig | undefined;
    let title = typeof route.title === 'string' ? route.title : undefined;
    for (const child of route.children) {
      const nested = this.findSeoData(child);
      if (nested.seo) {
        seo = nested.seo;
      }
      if (nested.title) {
        title = nested.title;
      }
    }
    return { seo, title };
  }

  private setLinkTag(rel: string, href: string): void {
    const selector = `link[rel="${rel}"]`;
    const existing = this.document.head.querySelector(selector);
    if (existing) {
      existing.setAttribute('href', href);
      return;
    }
    const link = this.document.createElement('link');
    link.setAttribute('rel', rel);
    link.setAttribute('href', href);
    this.document.head.appendChild(link);
  }
}
