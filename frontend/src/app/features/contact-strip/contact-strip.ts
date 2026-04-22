import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { DEFAULT_CONTACT_CHANNELS } from '../../shared/config/contact.config';
import type { ContactChannels } from '../../shared/models/contact-channels';
import { WechatDialog } from './wechat-dialog/wechat-dialog';

/** Block accidental double-taps within this window (ms, per channel). */
const THROTTLE_MS = 3000;

type Channel = 'phone' | 'whatsapp' | 'wechat';

@Component({
  selector: 'app-contact-strip',
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './contact-strip.html',
  styleUrl: './contact-strip.scss',
})
export class ContactStrip {
  protected readonly channels: ContactChannels = DEFAULT_CONTACT_CHANNELS;
  protected readonly whatsappUrl = this.buildWhatsappUrl(this.channels);

  private readonly lastTap = signal<Record<Channel, number>>({
    phone: 0,
    whatsapp: 0,
    wechat: 0,
  });

  private readonly dialog = inject(MatDialog);

  protected onTap(channel: Channel, event: Event): void {
    const now = Date.now();
    const last = this.lastTap()[channel];
    if (now - last < THROTTLE_MS) {
      event.preventDefault();
      return;
    }
    this.lastTap.update((prev) => ({ ...prev, [channel]: now }));
    this.trackConversion(channel);

    if (channel === 'wechat') {
      event.preventDefault();
      this.dialog.open(WechatDialog, {
        data: this.channels,
        panelClass: 'contact-strip__wechat-dialog',
        ariaLabel: 'WeChat contact details',
      });
    }
  }

  private buildWhatsappUrl(c: ContactChannels): string {
    return `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(c.whatsappPrefill)}`;
  }

  private trackConversion(channel: Channel): void {
    if (typeof window === 'undefined' || !('gtag' in window)) {
      return;
    }
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', 'contact_tap', {
      channel,
    });
  }
}
