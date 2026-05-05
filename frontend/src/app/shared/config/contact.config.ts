import type { ContactChannels } from '../models/contact-channels';

import { CONTACT_MANIFEST_LINE } from './contact.manifest';

/**
 * Public contact surfaces (strip, booking WhatsApp).
 *
 * **Phone / WhatsApp digits** switch per Angular build (`production` = kkleung,
 * `production-jameslo` = jameslo) via `./contact.manifest` file replacement.
 *
 * Multi-host Cloudflare: see `docs/LearningNotes/cloudflare-pages-multi-operator.md`.
 */
export const DEFAULT_CONTACT_CHANNELS: ContactChannels = {
  phone: CONTACT_MANIFEST_LINE.phone,
  whatsapp: CONTACT_MANIFEST_LINE.whatsapp,
  whatsappPrefill: '我想預約輪椅的士',
  wechatId: 'wheelchairtaxipro',
  wechatQrUrl: '/wechat-qr.svg',
};
