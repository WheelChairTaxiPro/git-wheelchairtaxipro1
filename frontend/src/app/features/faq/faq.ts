import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DEFAULT_CONTACT_CHANNELS } from '../../shared/config/contact.config';
import { JsonLd } from '../../shared/ui/json-ld/json-ld';
import { FAQ_PAGE_SCHEMA } from './faq.schema';

/** Local HK display for WhatsApp digits (e.g. 85296488582 → 9648 8582). */
function formatWhatsAppLocal(digits: string): string {
  const local = digits.startsWith('852') ? digits.slice(3) : digits;
  if (local.length === 8) {
    return `${local.slice(0, 4)} ${local.slice(4)}`;
  }
  return local;
}

@Component({
  selector: 'app-faq',
  imports: [RouterLink, JsonLd],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  protected readonly faqSchema = FAQ_PAGE_SCHEMA;
  protected readonly whatsappDisplay = formatWhatsAppLocal(DEFAULT_CONTACT_CHANNELS.whatsapp);
  protected readonly whatsappUrl = `https://wa.me/${DEFAULT_CONTACT_CHANNELS.whatsapp}?text=${encodeURIComponent(DEFAULT_CONTACT_CHANNELS.whatsappPrefill)}`;
  protected readonly bookingEmail = 'dannyleungkkl@gmail.com';
}
