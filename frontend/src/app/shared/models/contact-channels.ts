/**
 * Canonical shape of the business's public contact channels.
 *
 * Source spec: initial-design/WheelchairTaxiPro_Communication.md
 *
 * Kept under shared/ because both the Contact Strip (Phase 1) and the
 * Booking slice (later — for a "Contact instead" fallback) will read it.
 */
export interface ContactChannels {
  /** E.164, with leading "+". Used directly in `tel:` href. */
  readonly phone: string;

  /** Digits only, no "+" or spaces. Used in `https://wa.me/<digits>`. */
  readonly whatsapp: string;

  /** Pre-filled WhatsApp message. URL-encoded at render time, not here. */
  readonly whatsappPrefill: string;

  /** Human-readable WeChat ID shown in the modal and copied to clipboard. */
  readonly wechatId: string;

  /** Path to the WeChat QR image served from `public/`, e.g. "/wechat-qr.svg". */
  readonly wechatQrUrl: string;
}
