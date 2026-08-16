import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

import { TAXI_SERVICE_SCHEMA } from './core/config/business.schema';
import { SeoService } from './core/services/seo.service';
import { ContactStrip } from './features/contact-strip/contact-strip';
import { DrawerService } from './shared/services/drawer.service';
import { BottomNav } from './shared/ui/bottom-nav/bottom-nav';
import { HamburgerMenu } from './shared/ui/hamburger-menu/hamburger-menu';
import { JsonLd } from './shared/ui/json-ld/json-ld';
import { TopBanner } from './shared/ui/top-banner/top-banner';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    TopBanner,
    BottomNav,
    ContactStrip,
    HamburgerMenu,
    JsonLd,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly drawerService = inject(DrawerService);
  protected readonly taxiServiceSchema = TAXI_SERVICE_SCHEMA;
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.listenForRouteChanges();
    this.seo.applyFromActivatedRoute();
  }

  /** Close when the user taps anywhere inside <main> while the drawer is open (D6c). */
  protected onMainWrapClick(): void {
    if (this.drawerService.isOpen()) {
      this.drawerService.close();
    }
  }

  /**
   * Keep the signal in sync when Material Sidenav closes itself via swipe or
   * Esc — prevents the signal and the DOM from drifting out of sync.
   */
  protected onDrawerOpenedChange(opened: boolean): void {
    if (opened) {
      this.drawerService.open();
    } else {
      this.drawerService.close();
    }
  }
}
