import { DEFAULT_CONTACT_CHANNELS } from '../../shared/config/contact.config';

const SITE_ORIGIN = 'https://wheelchairtaxipro.com';

/**
 * Sitewide TaxiService JSON-LD (rendered from the app root on every page).
 * Phone follows the per-operator build via `contact.config`.
 * Keep name/phone/areas consistent with the Google Business Profile (NAP).
 */
export const TAXI_SERVICE_SCHEMA: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'TaxiService',
  name: '輪的 專業輪椅的士',
  alternateName: 'WheelchairTaxiPro',
  description:
    '香港輪椅的士預約服務，為輪椅人士及長者提供無障礙接送，包括機場接送、醫院及覆診接送。合法的士咪錶收費，另加預約服務費。',
  url: `${SITE_ORIGIN}/booking/`,
  image: `${SITE_ORIGIN}/Logo.png`,
  telephone: DEFAULT_CONTACT_CHANNELS.phone,
  priceRange: '的士咪錶收費 + 預約服務費',
  areaServed: [
    { '@type': 'AdministrativeArea', name: '香港' },
    { '@type': 'AdministrativeArea', name: '九龍' },
    { '@type': 'AdministrativeArea', name: '新界' },
    { '@type': 'AdministrativeArea', name: '大嶼山' },
  ],
  availableLanguage: ['zh-Hant', 'en'],
  serviceType: '無障礙輪椅的士接送',
  provider: {
    '@type': 'LocalBusiness',
    name: '輪的 專業輪椅的士',
    telephone: DEFAULT_CONTACT_CHANNELS.phone,
    url: SITE_ORIGIN,
    image: `${SITE_ORIGIN}/Logo.png`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hong Kong',
      addressCountry: 'HK',
    },
  },
};
