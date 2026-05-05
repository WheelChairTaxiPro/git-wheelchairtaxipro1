/**
 * Per-deploy contact line (HK). Replaced via `angular.json` `fileReplacements` for `production-jameslo`.
 * @see contact.config.ts
 */
export const CONTACT_MANIFEST_LINE = {
  /** E.164 with leading "+"; used for `tel:` links. */
  phone: '+85296488582' as const,

  /** Digits only, no "+" — used for `wa.me/<digits>` (booking + strip). */
  whatsapp: '85296488582' as const,
};
