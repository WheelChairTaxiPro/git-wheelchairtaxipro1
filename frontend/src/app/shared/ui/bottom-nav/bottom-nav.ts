import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IsActiveMatchOptions, RouterLink, RouterLinkActive } from '@angular/router';

interface Tab {
  /** Material Symbol icon name — see https://fonts.google.com/icons. */
  readonly icon: string;
  /** Chinese label (primary per wireframe §3). */
  readonly labelZh: string;
  /** English label (secondary, stacked below). */
  readonly labelEn: string;
  /** Route this tab navigates to. Matches `app.routes.ts`. */
  readonly route: string;
  /**
   * Match options for RouterLinkActive.
   * - Route tab uses `paths: 'exact'` so `/booking` does NOT highlight it
   *   (every URL starts with `/`).
   * - Booking & Pricing tabs use `paths: 'subset'` so `/booking/confirm`
   *   still highlights Booking later.
   */
  readonly matchOptions: IsActiveMatchOptions;
}

const EXACT: IsActiveMatchOptions = {
  paths: 'exact',
  matrixParams: 'ignored',
  queryParams: 'ignored',
  fragment: 'ignored',
};

const SUBSET: IsActiveMatchOptions = {
  paths: 'subset',
  matrixParams: 'ignored',
  queryParams: 'ignored',
  fragment: 'ignored',
};

/**
 * Primary bottom-nav tabs. Pricing lives in the hamburger menu now, so only
 * Route and Booking appear here.
 */
const TABS: readonly Tab[] = [
  { icon: 'map',   labelZh: '路線', labelEn: 'Route',   route: '/',        matchOptions: EXACT  },
  { icon: 'event', labelZh: '預約', labelEn: 'Booking', route: '/booking', matchOptions: SUBSET },
];

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.scss',
})
export class BottomNav {
  protected readonly tabs = TABS;
}
