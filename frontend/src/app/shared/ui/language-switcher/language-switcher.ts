import { Component, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

type Lang = 'zh' | 'en';

/**
 * Segmented 中 | EN toggle inside the hamburger drawer.
 *
 * UI-only stub for Phase 1: tapping a button swaps the pressed state but does
 * NOT yet change the page language. Real language switching (updating the
 * `<html lang>` attribute, swapping translation bundles, persisting choice)
 * lands in Phase 1.5 with `LanguageService` + Angular i18n.
 *
 * Tracked as tech debt in `docs/design/11-risks-and-technical-debts.md`.
 */
@Component({
  selector: 'app-language-switcher',
  imports: [MatButtonToggleModule],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
})
export class LanguageSwitcher {
  protected readonly currentLang = signal<Lang>('zh');

  protected onLangChange(next: Lang): void {
    this.currentLang.set(next);
    // TODO (Phase 1.5): LanguageService.set(next) + update <html lang> + persist.
  }
}
