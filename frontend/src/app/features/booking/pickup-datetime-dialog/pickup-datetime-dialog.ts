import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface PickupDatetimeDialogData {
  readonly initialValue: string;
}

export type PickupDatetimeDialogResult =
  | { readonly kind: 'set'; readonly value: string }
  | { readonly kind: 'cancel' };

function splitDatetimeLocal(raw: string): { date: string; time: string } {
  const t = raw.trim();
  if (!t) {
    return { date: '', time: '' };
  }
  const parts = t.split('T');
  const date = parts[0] ?? '';
  const time = (parts[1] ?? '').slice(0, 5);
  return { date, time };
}

function mergeDatetimeLocal(date: string, time: string): string {
  const d = date.trim();
  const tm = time.trim();
  if (!d || !tm) {
    return '';
  }
  return `${d}T${tm}`;
}

function formatDateOnlyLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** `HH:mm` 24 h → 12 h clock + 上午／下午 */
function time24ToDisplayParts(time24: string): { hour12: number; minute: number; isPm: boolean } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time24.trim());
  if (!m) {
    return null;
  }
  const h24 = parseInt(m[1], 10);
  const minute = parseInt(m[2], 10);
  if (h24 < 0 || h24 > 23 || minute < 0 || minute > 59) {
    return null;
  }
  const isPm = h24 >= 12;
  let hour12 = h24 % 12;
  if (hour12 === 0) {
    hour12 = 12;
  }
  return { hour12, minute, isPm };
}

function displayPartsToTime24(hour12: number, minute: number, isPm: boolean): string {
  let h24: number;
  if (!isPm) {
    h24 = hour12 === 12 ? 0 : hour12;
  } else {
    h24 = hour12 === 12 ? 12 : hour12 + 12;
  }
  return `${pad2(h24)}:${pad2(minute)}`;
}

function parsePickupDialogInitialState(data: PickupDatetimeDialogData): {
  date: string;
  time: string;
  parts: { hour12: number; minute: number; isPm: boolean } | null;
} {
  const split = splitDatetimeLocal(data.initialValue);
  const parts = split.time ? time24ToDisplayParts(split.time) : null;
  return { date: split.date, time: split.time, parts };
}

@Component({
  selector: 'app-pickup-datetime-dialog',
  imports: [MatDialogModule, MatButtonModule, FormsModule],
  templateUrl: './pickup-datetime-dialog.html',
  styleUrl: './pickup-datetime-dialog.scss',
})
export class PickupDatetimeDialog {
  private readonly data = inject<PickupDatetimeDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<PickupDatetimeDialog, PickupDatetimeDialogResult>);
  private readonly initial = parsePickupDialogInitialState(this.data);

  protected readonly hour12Options: readonly number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  protected readonly minuteOptions: readonly number[] = Array.from({ length: 60 }, (_, i) => i);

  protected readonly datePart = signal(this.initial.date);
  protected readonly timeHour12 = signal(this.initial.parts?.hour12 ?? 12);
  protected readonly timeMinute = signal(this.initial.parts?.minute ?? 0);
  protected readonly timeIsPm = signal(this.initial.parts?.isPm ?? false);
  /** When true, no time chosen yet (e.g. after 清除). */
  protected readonly timeUnset = signal(!this.initial.parts);
  protected readonly showSetError = signal(false);

  /** Read-only line: always matches hour / minute / 上午—下午 (prefix when 清除 left time uncommitted). */
  protected readonly compactTimeZh = computed(() => {
    const segment = this.timeIsPm() ? '下午' : '上午';
    const line = `${segment} ${this.timeHour12()}:${pad2(this.timeMinute())}`;
    if (this.timeUnset()) {
      return `（未套用）${line}`;
    }
    return line;
  });

  private readonly effectiveTime24 = computed(() => {
    if (this.timeUnset()) {
      return '';
    }
    return displayPartsToTime24(this.timeHour12(), this.timeMinute(), this.timeIsPm());
  });

  protected setDate(event: Event): void {
    this.showSetError.set(false);
    const v = (event.target as HTMLInputElement).value;
    this.datePart.set(v);
  }

  protected onHourModelChange(value: unknown): void {
    this.touchTime();
    const v = typeof value === 'number' && !Number.isNaN(value) ? value : parseInt(String(value ?? ''), 10);
    if (!Number.isNaN(v) && v >= 1 && v <= 12) {
      this.timeHour12.set(v);
    }
  }

  protected onMinuteModelChange(value: unknown): void {
    this.touchTime();
    const v = typeof value === 'number' && !Number.isNaN(value) ? value : parseInt(String(value ?? ''), 10);
    if (!Number.isNaN(v) && v >= 0 && v <= 59) {
      this.timeMinute.set(v);
    }
  }

  protected setAmPm(isPm: boolean): void {
    this.touchTime();
    this.timeIsPm.set(isPm);
  }

  private touchTime(): void {
    this.showSetError.set(false);
    this.timeUnset.set(false);
  }

  protected onClear(): void {
    this.showSetError.set(false);
    this.datePart.set('');
    this.timeUnset.set(true);
  }

  protected onToday(): void {
    this.showSetError.set(false);
    const n = new Date();
    this.datePart.set(formatDateOnlyLocal(n));
    const parts = time24ToDisplayParts(`${pad2(n.getHours())}:${pad2(n.getMinutes())}`);
    if (parts) {
      this.timeHour12.set(parts.hour12);
      this.timeMinute.set(parts.minute);
      this.timeIsPm.set(parts.isPm);
    }
    this.timeUnset.set(false);
  }

  protected onCancel(): void {
    this.dialogRef.close({ kind: 'cancel' } satisfies PickupDatetimeDialogResult);
  }

  protected onSet(): void {
    const value = mergeDatetimeLocal(this.datePart(), this.effectiveTime24());
    if (!value) {
      this.showSetError.set(true);
      return;
    }
    this.showSetError.set(false);
    this.dialogRef.close({ kind: 'set', value });
  }
}
