import { DOCUMENT } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
} from '@angular/core';

/**
 * Injects a JSON-LD `<script>` into `<head>` so prerendered HTML includes structured data.
 */
@Component({
  selector: 'app-json-ld',
  template: '',
})
export class JsonLd {
  readonly schema = input.required<Record<string, unknown>>();

  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private script: HTMLScriptElement | null = null;

  constructor() {
    effect(() => {
      const data = this.schema();
      this.upsertScript(data);
    });

    this.destroyRef.onDestroy(() => this.removeScript());
  }

  private upsertScript(data: Record<string, unknown>): void {
    // Key scripts by schema @type so multiple JsonLd instances (e.g. sitewide
    // TaxiService + per-page FAQPage) each reuse their own prerendered tag.
    const key = typeof data['@type'] === 'string' ? (data['@type'] as string) : 'schema';
    if (!this.script) {
      this.script =
        this.document.head.querySelector<HTMLScriptElement>(
          `script[type="application/ld+json"][data-app-json-ld="${key}"]`,
        ) ?? null;
      if (!this.script) {
        this.script = this.document.createElement('script');
        this.script.type = 'application/ld+json';
        this.document.head.appendChild(this.script);
      }
    }
    this.script.setAttribute('data-app-json-ld', key);
    this.script.textContent = JSON.stringify(data);
  }

  private removeScript(): void {
    this.script?.remove();
    this.script = null;
  }
}
