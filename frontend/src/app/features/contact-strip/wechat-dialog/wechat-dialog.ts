import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import type { ContactChannels } from '../../../shared/models/contact-channels';

@Component({
  selector: 'app-wechat-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './wechat-dialog.html',
  styleUrl: './wechat-dialog.scss',
})
export class WechatDialog {
  protected readonly data = inject<ContactChannels>(MAT_DIALOG_DATA);
  protected readonly ref = inject<MatDialogRef<WechatDialog>>(MatDialogRef);
  protected readonly copied = signal(false);

  protected async copyId(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.data.wechatId);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      /* Clipboard API denied (iOS Safari in some contexts). User can long-press
         the ID text to copy — that fallback needs no code. */
    }
  }
}
