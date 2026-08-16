/**
 * FAQPage JSON-LD for `/faq`. Keep answers aligned with visible copy in `faq.html`.
 */
export const FAQ_PAGE_SCHEMA: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '如何預約輪椅的士？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '您可以透過網站上的預約表格進行預約。提交資料後，我們會盡快與您聯絡確認行程安排。',
      },
    },
    {
      '@type': 'Question',
      name: '預約時需要提供什麼資料？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '請提供日期及時間、上車地點、目的地、乘客總人數、是否有輪椅使用者、聯絡電話，以及特別要求（如有）。',
      },
    },
    {
      '@type': 'Question',
      name: '可以即日預約嗎？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '可以。如有空車及司機可安排，我們會盡力提供即日服務。不過為確保能安排合適車輛，建議提前預約。',
      },
    },
    {
      '@type': 'Question',
      name: '服務覆蓋哪些地區？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '我們的服務覆蓋九龍、新界及大嶼山。如有特別路線需求，歡迎向我們查詢。',
      },
    },
    {
      '@type': 'Question',
      name: '是否提供機場接送？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '提供。我們提供香港國際機場接送服務，方便輪椅人士及家屬往返機場。',
      },
    },
    {
      '@type': 'Question',
      name: '是否提供醫院及覆診接送？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '提供。我們經常接送乘客前往公立醫院、私家醫院、專科診所及復康中心。',
      },
    },
    {
      '@type': 'Question',
      name: '有哪些車型可供選擇？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '我們提供新款細輪椅的士（適合 2–3 位乘客）、普通輪椅的士（最多 4 位乘客），以及新款特大豪華輪椅的士（最多 6 位乘客）。亦可按需要安排最合適車型。',
      },
    },
    {
      '@type': 'Question',
      name: '收費是否使用合法的士咪錶？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '是。我們使用香港政府認可的士咪錶收費，合法載客取酬，另加預約服務費視車型而定。',
      },
    },
    {
      '@type': 'Question',
      name: '如何聯絡你們？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '可透過 WhatsApp、電郵，或網站預約表格聯絡我們。',
      },
    },
  ],
};
