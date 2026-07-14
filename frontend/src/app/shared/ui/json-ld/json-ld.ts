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
    if (!this.script) {
      // Reuse prerendered script so hydration does not duplicate JSON-LD in <head>.
      this.script =
        this.document.head.querySelector<HTMLScriptElement>(
          'script[type="application/ld+json"][data-app-json-ld="true"]',
        ) ?? null;
      if (!this.script) {
        this.script = this.document.createElement('script');
        this.script.type = 'application/ld+json';
        this.script.setAttribute('data-app-json-ld', 'true');
        this.document.head.appendChild(this.script);
      }
    }
    this.script.textContent = JSON.stringify(data);
  }

  private removeScript(): void {
    this.script?.remove();
    this.script = null;
  }
}
