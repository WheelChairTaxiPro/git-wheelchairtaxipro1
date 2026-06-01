import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DEFAULT_CONTACT_CHANNELS } from '../../shared/config/contact.config';

/** Local HK display for WhatsApp digits (e.g. 85296488582 → 9648 8582). */
function formatWhatsAppLocal(digits: string): string {
  const local = digits.startsWith('852') ? digits.slice(3) : digits;
  if (local.length === 8) {
    return `${local.slice(0, 4)} ${local.slice(4)}`;
  }
  return local;
}

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly contact = DEFAULT_CONTACT_CHANNELS;
  protected readonly whatsappDisplay = formatWhatsAppLocal(DEFAULT_CONTACT_CHANNELS.whatsapp);
  protected readonly whatsappUrl = `https://wa.me/${DEFAULT_CONTACT_CHANNELS.whatsapp}?text=${encodeURIComponent(DEFAULT_CONTACT_CHANNELS.whatsappPrefill)}`;
  /** Booking enquiry email from initial-design/16-WheelchairTaxiPro_About_Us_Final.md */
  protected readonly bookingEmail = 'dannyleungkkl@gmail.com';
  protected readonly facebookUrl = 'https://www.facebook.com/wheelchairtaxipro/';
}
