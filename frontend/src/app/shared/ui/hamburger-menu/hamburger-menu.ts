import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';

import { LanguageSwitcher } from '../language-switcher/language-switcher';

interface MenuLink {
  readonly icon: string;
  readonly labelZh: string;
  readonly labelEn: string;
  readonly route: string;
}

/**
 * Menu item order matches locked-in design decision D1:
 *   1. About   — 關於我們
 *   2. FAQ     — 常見問題
 *   3. Language switch — rendered below the divider, not as a nav link.
 */
const MENU_LINKS: readonly MenuLink[] = [
  { icon: 'info_outline', labelZh: '關於我們', labelEn: 'About', route: '/about' },
  { icon: 'help_outline', labelZh: '常見問題', labelEn: 'FAQ', route: '/faq' },
];

@Component({
  selector: 'app-hamburger-menu',
  imports: [RouterLink, MatIconModule, MatListModule, MatDividerModule, LanguageSwitcher],
  templateUrl: './hamburger-menu.html',
  styleUrl: './hamburger-menu.scss',
})
export class HamburgerMenu {
  protected readonly links = MENU_LINKS;
}
