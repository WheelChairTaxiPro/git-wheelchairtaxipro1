import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';

interface MenuLink {
  readonly icon: string;
  readonly labelZh: string;
  readonly labelEn: string;
  readonly route: string;
}

/**
 * Menu item order:
 *   1. About   — 關於我們
 *   2. Pricing — 收費 (moved here from the bottom nav)
 *   3. FAQ     — 常見問題
 */
const MENU_LINKS: readonly MenuLink[] = [
  { icon: 'info_outline', labelZh: '關於我們', labelEn: 'About',   route: '/about' },
  { icon: 'payments',     labelZh: '收費',     labelEn: 'Pricing', route: '/pricing' },
  { icon: 'help_outline', labelZh: '常見問題', labelEn: 'FAQ',     route: '/faq' },
];

@Component({
  selector: 'app-hamburger-menu',
  imports: [RouterLink, MatIconModule, MatListModule],
  templateUrl: './hamburger-menu.html',
  styleUrl: './hamburger-menu.scss',
})
export class HamburgerMenu {
  protected readonly links = MENU_LINKS;
}
