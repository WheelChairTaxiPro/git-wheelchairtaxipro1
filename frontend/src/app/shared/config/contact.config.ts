import type { ContactChannels } from '../models/contact-channels';

/**
 * The single source of truth for Phase 1 contact channels.
 *
 * Phase 1: single business identity, values committed directly (they are
 * public anyway). Phase 2 / multi-identity: replace with a value injected
 * at build time via Cloudflare Pages env vars (see
 * docs/LearningNotes/deploying-an-angular-pwa-to-cloudflare-pages.md §7).
 */
export const DEFAULT_CONTACT_CHANNELS: ContactChannels = {
  phone: '+642102824346',
  whatsapp: '642102824346',
  whatsappPrefill: '我想預約輪椅的士 / I need a wheelchair taxi',
  wechatId: 'wheelchairtaxipro',
  wechatQrUrl: '/wechat-qr.svg',
};
