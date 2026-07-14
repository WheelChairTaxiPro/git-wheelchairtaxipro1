# Advertisement & usage tracking — guide for Wheelchair Taxi Pro

This document explains **what you are trying to achieve**, **how it fits this project**, and **step-by-step instructions** to add:

1. **Advertisement** inside the web application  
2. **Tracking** of how people use the app and **how they arrived** (traffic source / campaign)  
3. **SEO, GEO, AEO, and AI search optimization** so people and AI tools can discover the site

It is written for the current stack: **Angular 21 PWA**, **Cloudflare Pages**, domain **`wheelchairtaxipro.com`**, Phase 1 (booking via WhatsApp, no backend database yet).

## Table of contents

- [Do we understand what you want?](#do-we-understand-what-you-want)
- [Current state of this repository (baseline)](#current-state-of-this-repository-baseline)
- [Part 1 — Advertisement in the application](#part-1--advertisement-in-the-application)
  - [1.1 What “advertisement” can mean](#11-what-advertisement-can-mean-for-this-product)
  - [1.2 Where to place ads in the UI](#12-where-to-place-ads-in-the-ui-without-breaking-booking)
  - [1.3 Implementation options (Angular)](#13-implementation-options-angular)
  - [1.4 Checklist — adding advertisement](#14-checklist--adding-advertisement)
- [Part 2 — Tracking usage and traffic source](#part-2--tracking-usage-and-traffic-source)
  - [2.1 What to measure](#21-what-to-measure)
  - [2.1a Traffic sources (Google, Facebook, organic, direct, QR)](#21a-traffic-sources-google-facebook-organic-direct-qr-code)
  - [2.2 Recommended tooling](#22-recommended-tooling)
  - [2.3 Implementation steps (GA4)](#23-implementation-steps-ga4-for-this-angular-spa)
  - [2.4 How to read reports (traffic source)](#24-where-they-getting-into-app--how-to-read-reports)
  - [2.5 Privacy, cookies, and Hong Kong](#25-privacy-cookies-and-hong-kong-context)
  - [2.6 Short pointer: Worker ad-click logging](#26-short-pointer-worker-ad-click-logging)
- [**Part 6 — End-to-end setup: Google Ad → Worker → GA4**](#part-6--end-to-end-setup-google-ad--cloudflare-worker--ga4) ⭐
  - [6.1 Services & accounts to join](#61-services--accounts-to-join)
  - [6.2 Target architecture](#62-target-architecture)
  - [6.3 Phase A — Google Ads (landing URL + auto-tagging)](#63-phase-a--google-ads-landing-url--auto-tagging)
  - [6.4 Phase B — Google Analytics 4 (GA4)](#64-phase-b--google-analytics-4-ga4)
  - [6.5 Phase C — Cloudflare Worker + D1 (IP / gclid logging)](#65-phase-c--cloudflare-worker--d1-ip--gclid-logging)
  - [6.6 Phase D — Angular code to add or change](#66-phase-d--angular-code-to-add-or-change)
  - [6.7 Phase E — Deploy & connect domain](#67-phase-e--deploy--connect-domain)
  - [6.8 End-to-end verification checklist](#68-end-to-end-verification-checklist)
  - [6.9 Using both GA4 and Worker together (rules)](#69-using-both-ga4-and-worker-together-rules)
- [Part 3 — Suggested order of work](#part-3--suggested-order-of-work)
- [Part 4 — Code touchpoints in this repo](#part-4--code-touchpoints-in-this-repo-when-you-implement)
- [Part 5 — Summary](#part-5--summary)
- [**Part 7 — SEO, GEO, AEO & AI search optimization**](#part-7--seo-geo-aeo--ai-search-optimization) ⭐
  - [7.1 What SEO, GEO, AEO, and AI search mean](#71-what-seo-geo-aeo-and-ai-search-mean)
  - [7.2 Current baseline in this repository](#72-current-baseline-in-this-repository)
  - [7.3 Services & accounts to join](#73-services--accounts-to-join)
  - [7.4 Foundation — technical SEO (all channels)](#74-foundation--technical-seo-all-channels)
  - [7.5 On-page SEO — every public route](#75-on-page-seo--every-public-route)
  - [7.6 Structured data (Schema.org JSON-LD)](#76-structured-data-schemaorg-json-ld)
  - [7.7 GEO — Generative Engine Optimization](#77-geo--generative-engine-optimization)
  - [7.8 AEO — Answer Engine Optimization](#78-aeo--answer-engine-optimization)
  - [7.9 Google AI Mode & other AI search surfaces](#79-google-ai-mode--other-ai-search-surfaces)
  - [7.10 Local & off-site signals (Hong Kong)](#710-local--off-site-signals-hong-kong)
  - [7.11 Angular code to add or change](#711-angular-code-to-add-or-change)
  - [7.12 Measurement & verification](#712-measurement--verification)
  - [7.13 Suggested order of work](#713-suggested-order-of-work)
  - [7.14 Master checklist](#714-master-checklist)

---

## Do we understand what you want?

**Yes.** In plain language:

| Goal | What you mean | What it is *not* |
|------|----------------|------------------|
| **1. Advertisement** | Show **promotional or third-party ad content** in the app UI (banners, slots, maybe video later) so you can earn revenue or promote partners. | Not the same as **Google Ads campaigns** that bring people *to* your site (that is marketing *outside* the app). |
| **2. Tracking** | See **what users do** (pages, booking flow, Call / WhatsApp taps) and **where they came from** (Google ad, Facebook link, direct, organic search, **QR code**). | Not the same as **server logs only**; you want analytics you can read in a dashboard (e.g. GA4). |

Both goals can work together: ads affect layout and performance; tracking must still record visits and conversions accurately.

---

## Current state of this repository (baseline)

| Area | Status |
|------|--------|
| **GA4 / gtag** | Planned in `initial-design/8-Guide.md` §7; **not yet installed** in `frontend/src/index.html`. |
| **Contact events** | `contact-strip` already calls `gtag('event', 'contact_tap', …)` **if** `gtag` exists on `window`. |
| **GCLID / ad landing** | Documented in `8-Guide.md` and `docs/LearningNotes/logging-google-ads-landing-page-visits.md` (focus: suspicious ad clicks + IP at edge). |
| **In-app ads** | **Not implemented.** |
| **Phase 1 policy** | `docs/design/10-quality-requirements.md` says: no third-party ad trackers in Phase 1 **beyond GA4 + Google Search Console**. Adding AdSense or similar is a **conscious Phase 1.5 / Phase 2** decision. |

---

# Part 1 — Advertisement in the application

## 1.1 What “advertisement” can mean for this product

Choose one or more models:

### A. Your own promotional banners (recommended first)

- Examples: “新款細輪椅的士 $100 服務費”、link to `/pricing`, seasonal offer.
- **Pros:** Full control, no Google approval, fast, matches brand, no extra cookies.
- **Cons:** No automatic revenue; you update content manually or via config.

### B. Google AdSense (or similar programmatic ads)

- Google places ads in slots you define.
- **Pros:** Passive income possible.
- **Cons:** Cookie/consent banner (HK PDPO), layout clutter on a **booking** app, policy review, can hurt trust for elderly/disabled users, Core Web Vitals impact, may show irrelevant ads.

### C. Affiliate / partner ads

- Fixed image + link (insurance, rehab equipment, care homes) under a “合作夥伴” section on **About** or **FAQ**, not on the booking form.

### D. Ads that bring traffic *to* the site (Google Ads campaigns)

- This is **acquisition**, not “ads inside the app.”
- Landing URL should be **`https://wheelchairtaxipro.com/booking`** (or `/`) with tracking parameters (see Part 2).
- Do **not** send Google Ads directly to Facebook only — see `docs/LearningNotes/logging-google-ads-landing-page-visits.md`.

**Practical recommendation:** Start with **A + C** (own + partner banners). Add **B (AdSense)** only after analytics and privacy/consent are in place.

---

## 1.2 Where to place ads in the UI (without breaking booking)

| Location | Suitability | Notes |
|----------|-------------|--------|
| **Below page title on Pricing / FAQ / About** | Good | User is reading; not mid-form. |
| **Footer of hamburger menu drawer** | OK | Low intrusion. |
| **Booking form** | **Avoid** | Friction, trust, and mistakes on submit. |
| **Contact strip (Phone / WhatsApp / WeChat)** | **Never** | Primary conversion path. |
| **Map route screen** | Poor | Map + ads compete for attention and API cost. |

Wireframe rule: **one primary action per screen** — booking and contact stay clean.

---

## 1.3 Implementation options (Angular)

### Option 1 — Static banner component (fastest)

1. Create `shared/ui/promo-banner/` (or `features/ads/` slice).
2. Input: `imageUrl`, `href`, `alt`, `labelZh` (or load from `public/ads/banner.json` at build time).
3. Insert in `about.html`, `faq.html`, or `pricing.html` only.
4. Track clicks: `gtag('event', 'promo_click', { promo_id: '…' })`.

### Option 2 — Config-driven slots

1. Add `frontend/src/app/shared/config/ads.config.ts` (or JSON in `public/`).
2. Array of `{ id, pages: ['pricing','faq'], html | image, link }`.
3. `App` or a layout wrapper renders `<app-ad-slot page="booking" />` that filters by route.

### Option 3 — Google AdSense

1. Apply at [Google AdSense](https://www.google.com/adsense/).
2. Add AdSense script to `index.html` or inject via **Google Tag Manager** (GTM).
3. Place `<ins class="adsbygoogle">` in a dedicated component; run `adsbygoogle.push({})` after view init (browser only).
4. **Must** add cookie/consent UI if serving EEA/HK users with personalized ads (legal review recommended).
5. Test Lighthouse — ads often hurt **LCP** and **CLS**; keep slots fixed height to reduce layout shift.

### Option 4 — Cloudflare Zaraz (optional)

- If you standardise on Cloudflare, [Zaraz](https://developers.cloudflare.com/zaraz/) can load third-party tools (including tags) from the edge with less client JS. More setup; good for centralising tags later.

---

## 1.4 Checklist — adding advertisement

- [ ] Decide model: own banner / partner / AdSense.
- [ ] Choose pages (not booking / not contact strip).
- [ ] Design mobile layout (full-width max height ~80–120px for banners).
- [ ] Add `alt` text and WCAG contrast (ads must not trap keyboard focus).
- [ ] Add click tracking event name (e.g. `promo_click`).
- [ ] Update privacy policy: what is shown, who is the advertiser, cookies if AdSense.
- [ ] Re-run Lighthouse on `/booking` after any global script change.

---

# Part 2 — Tracking usage and traffic source

## 2.1 What to measure

### A. **Acquisition** — “Where did they come from?”

Capture on **first visit** (landing):

| Signal | How | Stored |
|--------|-----|--------|
| **Full landing URL** | `window.location.href` on first load | GA4 automatically if configured; also save to `sessionStorage` |
| **Referrer** | `document.referrer` | GA4 |
| **UTM parameters** | `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` | GA4 (auto with correct config); persist in `localStorage` for conversions |
| **Google Ads click ID** | `gclid`, `wbraid`, `gbraid` in query string | Cookie or `localStorage` + send on conversion events |
| **Facebook / other** | `fbclid` if present | Same pattern as GCLID |
| **QR code campaigns** | **UTM tags in the QR destination URL** (required) | GA4 **source / medium / campaign**; persist UTMs like GCLID |

### 2.1a Traffic sources (Google, Facebook, organic, direct, QR code)

These are the **channels** you want to separate in reports. GA4 does not read your mind — you must give each channel a **consistent landing URL** (especially QR codes).

| Source | Typical user action | What you want in GA4 | How to set it up |
|--------|---------------------|----------------------|------------------|
| **Google ad** | Tap a Google Ads link | `google` / `cpc` (or Ads-linked auto-tagging) | Final URL → `/booking`; enable auto-tagging → `gclid` appended |
| **Facebook link** | Tap link in post, bio, Messenger | `facebook` / `social` or `referral` | Use a tagged link every time (do not rely on bare URL) |
| **Organic search** | Find you on Google without clicking an ad | `google` / `organic` | No extra setup; ensure site is indexed (Search Console) |
| **Direct** | Type URL, bookmark, open from home screen (PWA) | `(direct)` / `(none)` | Normal; no referrer — **do not confuse with QR** (see below) |
| **QR code** | Scan printed QR on vehicle, flyer, clinic | `qr` / `offline` (or your naming) | **Encode UTMs in the QR URL** — see examples below |

**Important — QR codes and “direct” traffic**

- A QR code opens the browser **with no referrer**. If the URL is only `https://wheelchairtaxipro.com/booking`, GA4 will often count the visit as **direct**, not “QR code”.
- To count QR scans separately, every QR must point to a URL that includes **UTM parameters** (or a short link that redirects to a UTM-tagged URL).

**Example landing URLs by source:**

```text
# Google Ads (auto-tagging adds gclid; you can also add UTMs)
https://wheelchairtaxipro.com/booking?utm_source=google&utm_medium=cpc&utm_campaign=wheelchair-hk
https://wheelchairtaxipro.com/booking?gclid=EAIaIQobChMI...

# Facebook
https://wheelchairtaxipro.com/booking?utm_source=facebook&utm_medium=social&utm_campaign=page-post

# QR — vehicle door sticker
https://wheelchairtaxipro.com/booking?utm_source=qr&utm_medium=offline&utm_campaign=taxi-door

# QR — hospital flyer (different campaign so you can compare)
https://wheelchairtaxipro.com/booking?utm_source=qr&utm_medium=offline&utm_campaign=qh-flyer

# QR — WeChat-shared image (if you print a QR that points here)
https://wheelchairtaxipro.com/booking?utm_source=qr&utm_medium=offline&utm_campaign=wechat-print
```

Use a **free QR generator** (Google Charts API alternatives, [qr-code-generator.com](https://www.qr-code-generator.com/), or Cloudflare — any tool) and paste the **full tagged URL**, not just the domain.

**Optional:** One QR per campaign (`utm_campaign=…`) so GA4 shows which flyer or vehicle performs best.

**Short links (optional):** `https://go.wheelchairtaxipro.com/qh` → redirect to the tagged `/booking?...` URL so printed QRs stay small. The redirect target must still carry UTMs.

### B. **Behaviour** — “What did they do in the app?”

| Event | When | Priority |
|-------|------|----------|
| `page_view` | Each route (`/booking`, `/route`, `/pricing`, …) | High — SPA must send manually (see below) |
| `contact_tap` | Phone / WhatsApp / WeChat | High — **partially wired** in `contact-strip.ts` |
| `booking_submit` | User submits booking form (before WhatsApp handoff) | High |
| `map_route_calculated` | Pickup + dropoff set, distance shown | Medium |
| `promo_click` | Ad banner clicked | If ads added |
| `language_switch` | If EN returns later | Low |

### C. **Outcomes (conversions)**

Mark these as **key events** in GA4 and link to Google Ads if you run ads:

- `click_call`
- `click_whatsapp`
- `submit_booking` (form submitted / WhatsApp opened)

Phase 1 has no server-side booking DB — browser events are the source of truth.

---

## 2.2 Recommended tooling

| Tool | Role |
|------|------|
| **Google Analytics 4 (GA4)** | Main dashboard: traffic source, pages, events, funnels. Free. |
| **Google Tag Manager (GTM)** | Optional: add/change tags without redeploying the app. |
| **Google Search Console** | SEO queries (not in-app behaviour). Already in architecture docs. |
| **Cloudflare Web Analytics** | Simple page views at edge; optional supplement, no replacement for GA4 events. |
| **Cloudflare Worker + D1** | Only if you need **raw IP logs** for suspicious **Google Ads** clicks — see `docs/LearningNotes/logging-google-ads-landing-page-visits.md`. |

**Recommendation:** Implement **GA4 + gtag** (or GTM loading GA4) first. Add Worker logging only if ad fraud investigation is active.

---

## 2.3 Implementation steps (GA4 for this Angular SPA)

### Step 1 — Create GA4 property

1. [Google Analytics](https://analytics.google.com/) → Admin → Create property **Wheelchair Taxi Pro**.
2. Add **Web** data stream: `https://wheelchairtaxipro.com`.
3. Copy **Measurement ID** (e.g. `G-XXXXXXXXXX`).

### Step 2 — Install the tag

**Option A — gtag in `index.html` (simplest)**

Add before `</head>` (use your real ID):

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', { send_page_view: false });
</script>
```

`send_page_view: false` because an SPA must send page views on route changes (Step 3).

**Option B — Google Tag Manager**

1. Create GTM container → snippet in `index.html`.
2. In GTM: tag **GA4 Configuration** + trigger **All Pages** (initial load).
3. Separate tag for **GA4 Event** on custom events pushed to `dataLayer`.

GTM is better if non-developers will change tags.

### Step 3 — Track Angular route changes (critical for SPA)

In `app.ts` or a small `AnalyticsService` in `core/`:

```typescript
// Pseudocode — implement with inject(Router) + filter(NavigationEnd)
router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
  const url = e.urlAfterRedirects;
  gtag('event', 'page_view', {
    page_path: url,
    page_title: document.title,
  });
});
```

Without this, GA4 only sees the first HTML load and **under-counts** `/pricing`, `/faq`, etc.

### Step 4 — Persist attribution (Google Ads GCLID + UTM / QR)

On **first load** (browser only), save click IDs and UTMs so later events (booking, WhatsApp) still know the original source after the user navigates inside the SPA.

```typescript
const params = new URLSearchParams(window.location.search);

// Google Ads
const gclid = params.get('gclid') ?? params.get('wbraid') ?? params.get('gbraid');
if (gclid) {
  localStorage.setItem('wtp_gclid', gclid);
}

// Facebook
const fbclid = params.get('fbclid');
if (fbclid) {
  localStorage.setItem('wtp_fbclid', fbclid);
}

// UTM — used for QR, Facebook links, manual campaigns (and optional Google Ads)
const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const utm: Record<string, string> = {};
for (const key of utmKeys) {
  const v = params.get(key);
  if (v) utm[key] = v;
}
if (Object.keys(utm).length > 0) {
  localStorage.setItem('wtp_utm', JSON.stringify(utm));
  // e.g. QR scan: { utm_source: "qr", utm_medium: "offline", utm_campaign: "taxi-door" }
}
```

On `booking_submit` / `contact_tap`, attach to GA4 events:

```typescript
gtag('event', 'submit_booking', {
  gclid: localStorage.getItem('wtp_gclid'),
  ...JSON.parse(localStorage.getItem('wtp_utm') ?? '{}'),
});
```

See `initial-design/8-Guide.md` §7.2.

**QR checklist:** Generate QR only after the tagged URL is final; test one scan and check GA4 **Realtime** → traffic source shows `qr` / `offline` (or your chosen `utm_source` / `utm_medium`).

### Step 5 — Wire existing and new events

| File | Action |
|------|--------|
| `contact-strip.ts` | Already calls `gtag` — ensure tag installed. |
| `booking.ts` | On successful submit / WhatsApp handoff: `submit_booking`. |
| `map.ts` / `booking.ts` | Optional: `route_preview` when distance/time shown. |

Use consistent event names; document them in `frontend/ARCHITECTURE.md` or a small `analytics-events.md`.

### Step 6 — Link Google Ads to GA4

1. Google Ads → Goals → Conversions → Import from GA4.
2. Mark `submit_booking`, `click_whatsapp` as **conversions** in GA4 first (Admin → Events → Mark as key event).

### Step 7 — Verify

- [ ] GA4 **Realtime** → open site, navigate tabs, see `page_view`.
- [ ] Tap WhatsApp → see `contact_tap` or your named event.
- [ ] Submit booking → see `submit_booking`.
- [ ] Open `?gclid=test123` → submit → event params include gclid.
- [ ] Open `?utm_source=qr&utm_medium=offline&utm_campaign=test` → Realtime shows **qr** / **offline** (not direct).
- [ ] **Exploration** → Traffic acquisition → see source/medium after 24–48h.

---

## 2.4 “Where they getting into app” — how to read reports

In **GA4**:

| Question | Report |
|----------|--------|
| Google Ads vs Facebook vs organic vs direct vs QR | **Acquisition** → Traffic acquisition (`Session source` / `Session medium`) |
| Which Google or QR campaign | Same report → **Session campaign** (needs UTMs on landing URL, or Ads linking for Google) |
| QR only (all offline QRs) | Filter: `Session source` = `qr` (if you standardise on `utm_source=qr`) |
| Compare two flyers / vehicles | Filter by `Session campaign` = `qh-flyer` vs `taxi-door` |
| Landing page | **Engagement** → Pages and screens (landing page dimension) |
| Did they book or only browse | **Explore** → Funnel: `page_view` (booking) → `submit_booking` |

**Tagged landing URLs (copy into each channel):**

```text
# Google Ads
https://wheelchairtaxipro.com/booking?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}

# Facebook
https://wheelchairtaxipro.com/booking?utm_source=facebook&utm_medium=social&utm_campaign=main-page

# QR code (example — one per placement)
https://wheelchairtaxipro.com/booking?utm_source=qr&utm_medium=offline&utm_campaign=taxi-door
```

(Google Ads auto-append `gclid` when auto-tagging is on. QR codes **must** include UTMs or they will look like **direct** traffic.)

---

## 2.5 Privacy, cookies, and Hong Kong context

- Inform users in **About** or a **私隱政策** page: what you collect (analytics, ad cookies if any).
- GA4 uses cookies / storage; consider a **simple consent banner** if you add AdSense or remarketing.
- Do not log **full booking PII** (phone, name) into GA4 event parameters — use event names only.
- Align with `docs/design/10-quality-requirements.md` (retention, cookie posture).

---

## 2.6 Short pointer: Worker ad-click logging

For the **full step-by-step setup** (Google Ad → Cloudflare Worker → GA4 + Angular), use **Part 6** below.

Background theory and fraud notes: **`docs/LearningNotes/logging-google-ads-landing-page-visits.md`**.

---

# Part 6 — End-to-end setup: Google Ad → Cloudflare Worker → GA4

This section is the **main implementation guide** for running **both** at the same time:

```text
User clicks Google Ad
        ↓
Cloudflare (Worker)  ← first hit: log IP, time, gclid, URL (edge)
        ↓
Cloudflare Pages     ← serves Angular static build
        ↓
Angular app + GA4    ← in browser: page views, WhatsApp, booking events
```

| Layer | Answers the question |
|-------|----------------------|
| **Google Ads** | How do people reach the site from paid search/display? |
| **Cloudflare Worker + D1** | Which **IP** landed with a **gclid**? (fraud / repeat clicks) |
| **GA4** | What did they do inside the app? Which channel converted? |

---

## 6.1 Services & accounts to join

| Service | Required? | What you use it for | Sign-up / link |
|---------|-----------|---------------------|----------------|
| **Google Ads** | Yes (for paid Google traffic) | Run campaigns; auto-tagging adds `gclid` | [ads.google.com](https://ads.google.com/) |
| **Google Analytics 4** | Yes | Traffic sources, page views, conversions | [analytics.google.com](https://analytics.google.com/) |
| **Google Tag Manager** | Optional | Manage GA4 tag without redeploying code | [tagmanager.google.com](https://tagmanager.google.com/) |
| **Google Search Console** | Recommended | Organic search performance (not ad clicks) | [search.google.com/search-console](https://search.google.com/search-console/) |
| **Cloudflare** | Yes (you already use Pages) | DNS, Pages hosting, **Workers**, **D1** database | [dash.cloudflare.com](https://dash.cloudflare.com/) |
| **Cloudflare Pages** | Yes | Host `dist/frontend/browser` | Same Cloudflare account — project `wheelchairtaxipro` |
| **Cloudflare D1** | Yes (for IP logs) | SQL table of ad landing visits | Cloudflare dashboard → **Workers & Pages** → **D1** |
| **Cloudflare Workers** | Yes | Edge code that logs before Pages serves HTML | Via Wrangler CLI or dashboard |
| **Facebook** | Optional | Social traffic (use UTM links, not GA4 for FB’s own analytics) | Your existing Page |
| **QR generator** | Optional | Offline campaigns with UTMs | Any QR tool — see §2.1a |

**Accounts you do *not* need for this pipeline:**

- Google AdSense (in-app ads — Part 1, separate)
- A .NET backend (Phase 1 — Worker + GA4 are enough)
- A third-party “what is my IP” API (IP comes from Cloudflare headers in the Worker)

**Cost (typical):** GA4 free; Google Ads pay-per-click; Cloudflare free tier often covers Pages + modest Worker + D1 for a small business site.

---

## 6.2 Target architecture

```text
                    ┌─────────────────────┐
                    │     Google Ads      │
                    │  (auto-tagging on)  │
                    └──────────┬──────────┘
                               │ click
                               ▼
              https://wheelchairtaxipro.com/booking?gclid=...&utm_...
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ Cloudflare edge (zone: wheelchairtaxipro.com)                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Pages Function / Worker middleware                      │  │
│  │  • read CF-Connecting-IP, CF-IPCountry, User-Agent      │  │
│  │  • if gclid|wbraid|gbraid → INSERT into D1              │  │
│  │  • forward request → static assets (Pages)                │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                               │
                               ▼
              Angular PWA (prerendered HTML + JS)
              ┌────────────────────────────────┐
              │ index.html: GA4 gtag           │
              │ AnalyticsService:              │
              │   • persist gclid / UTM          │
              │   • page_view on route change  │
              │ contact-strip: contact_tap     │
              │ booking: submit_booking        │
              └────────────────────────────────┘
                               │
                               ▼
              Google Analytics 4 (dashboard)
```

**Important:** Do **not** read IP in Angular. IP logging happens **only** in the Worker.

---

## 6.3 Phase A — Google Ads (landing URL + auto-tagging)

### A.1 Enable auto-tagging

1. Google Ads → **Settings** (account or campaign level) → **Account settings**.
2. Turn on **Auto-tagging**.
3. Google will append **`gclid`** (or sometimes `wbraid` / `gbraid`) to your final URLs automatically.

### A.2 Set final URLs (landing page)

**Do not** send ads to Facebook only. Send them to your site first:

```text
https://wheelchairtaxipro.com/booking
```

Recommended (optional UTMs for clearer GA4 reports):

```text
https://wheelchairtaxipro.com/booking?utm_source=google&utm_medium=cpc&utm_campaign=wheelchair-hk-search
```

(`gclid` is still appended by auto-tagging.)

### A.3 Link Google Ads to GA4 (later, after Phase B)

1. Google Ads → **Goals** → **Conversions** → **New conversion action** → **Import** → **Google Analytics 4 properties**.
2. In GA4, mark `submit_booking` and `click_whatsapp` (or `contact_tap`) as **key events** first (Phase B.6).

### A.4 IP exclusions (when you find bad IPs in D1)

1. Google Ads → **Campaign** → **Settings** → **Additional settings** → **IP address exclusions**.
2. Add IPs you confirmed as fraudulent from D1 queries.
3. This reduces **future ad charges** from that IP. Cloudflare blocking alone does not refund a click that already happened.

### A.5 Checklist — Google Ads

- [ ] Auto-tagging ON.
- [ ] Final URL is `https://wheelchairtaxipro.com/booking` (or `/` with redirect).
- [ ] Test ad preview URL contains `gclid=` after click.
- [ ] Conversion import from GA4 configured after events exist.

---

## 6.4 Phase B — Google Analytics 4 (GA4)

Follow §2.3 in detail; summary for the combined pipeline:

### B.1 Create property

1. [analytics.google.com](https://analytics.google.com/) → **Admin** → **Create property** → name: `Wheelchair Taxi Pro`.
2. **Web** data stream → URL: `https://wheelchairtaxipro.com`.
3. Copy **Measurement ID**: `G-XXXXXXXXXX`.

### B.2 Add hosts to data stream

Under the web stream → **Configure tag settings** → ensure these are allowed:

- `wheelchairtaxipro.com`
- `www.wheelchairtaxipro.com` (if used)
- `*.wheelchairtaxipro.pages.dev` (for preview testing)

### B.3 Install tag in the app

**File to change:** `frontend/src/index.html` — add before `</head>`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', { send_page_view: false });
</script>
```

Use your real Measurement ID. Prefer injecting the ID at build time (see §6.6 — `write-ga-config.mjs` pattern) so it is not hard-coded in git.

Set `send_page_view: false` because Angular routes must send `page_view` manually.

### B.4 SPA route tracking + attribution + events

Implemented in new **`AnalyticsService`** (§6.6) — not only in `index.html`.

### B.5 Mark key events in GA4

Admin → **Events** → toggle **Mark as key event** for:

- `contact_tap`
- `submit_booking`
- (optional) `page_view`

### B.6 Checklist — GA4

- [ ] Property + data stream created.
- [ ] Tag loads on production (Network tab → `gtag/js`).
- [ ] Realtime shows `page_view` when switching tabs.
- [ ] `contact_tap` on WhatsApp button.
- [ ] `submit_booking` on booking form.
- [ ] Test URL with `?gclid=test` → event params include gclid.

---

## 6.5 Phase C — Cloudflare Worker + D1 (IP / gclid logging)

### C.1 Why Pages Functions?

Your site is on **Cloudflare Pages** (`wheelchairtaxipro` project). The standard way to run edge logic **in front of** the static site is **Pages Functions** — a Worker that runs on every request to that project.

Alternative: separate Worker + route on zone — more moving parts. **Pages Functions** is recommended for this repo.

### C.2 Create D1 database

1. Cloudflare dashboard → **Workers & Pages** → **D1** → **Create database**.
2. Name: `wtp-ad-clicks` (example).
3. Note the **database id** for `wrangler.toml`.

### C.3 Create table (SQL)

Run in D1 console or `wrangler d1 execute`:

```sql
CREATE TABLE IF NOT EXISTS ad_landing_visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  ip TEXT NOT NULL,
  country TEXT,
  landing_url TEXT NOT NULL,
  path TEXT,
  gclid TEXT,
  wbraid TEXT,
  gbraid TEXT,
  user_agent TEXT,
  referrer TEXT
);

CREATE INDEX IF NOT EXISTS idx_ad_landing_ip ON ad_landing_visits (ip);
CREATE INDEX IF NOT EXISTS idx_ad_landing_gclid ON ad_landing_visits (gclid);
CREATE INDEX IF NOT EXISTS idx_ad_landing_created ON ad_landing_visits (created_at);
```

### C.4 Add Wrangler config

**New file:** `frontend/wrangler.toml` (example — adjust paths to match your Pages root):

```toml
name = "wheelchairtaxipro"
compatibility_date = "2024-11-01"
pages_build_output_dir = "dist/frontend/browser"

[[d1_databases]]
binding = "AD_CLICKS_DB"
database_name = "wtp-ad-clicks"
database_id = "<paste-database-id-from-dashboard>"
```

If Pages project root in dashboard is the **repo root** (not `frontend/`), put `wrangler.toml` at repo root and set `pages_build_output_dir = "frontend/dist/frontend/browser"`.

Match whatever is configured in **Cloudflare Pages → Settings → Builds** today.

### C.5 Add middleware (edge logger)

**New file:** `frontend/functions/_middleware.ts`  
(If Pages root is repo root, use `functions/_middleware.ts` at repo root instead.)

```typescript
interface Env {
  AD_CLICKS_DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, next } = context;
  const url = new URL(request.url);

  const gclid = url.searchParams.get('gclid');
  const wbraid = url.searchParams.get('wbraid');
  const gbraid = url.searchParams.get('gbraid');
  const hasAdClickId = !!(gclid || wbraid || gbraid);

  if (hasAdClickId && env.AD_CLICKS_DB) {
    const ip = request.headers.get('CF-Connecting-IP') ?? '';
    const country = request.headers.get('CF-IPCountry') ?? '';
    const userAgent = request.headers.get('User-Agent') ?? '';
    const referrer = request.headers.get('Referer') ?? '';

    // Do not block the response — log asynchronously where possible
    context.waitUntil(
      env.AD_CLICKS_DB.prepare(
        `INSERT INTO ad_landing_visits
         (ip, country, landing_url, path, gclid, wbraid, gbraid, user_agent, referrer)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
        .bind(
          ip,
          country,
          url.toString(),
          url.pathname,
          gclid,
          wbraid,
          gbraid,
          userAgent,
          referrer,
        )
        .run(),
    );
  }

  return next();
};
```

Install types if needed: `@cloudflare/workers-types` as devDependency.

**Behaviour:**

- Runs on **every** request to Pages (HTML, JS, assets). For Phase 1, only **INSERT when `gclid|wbraid|gbraid` present** to keep table small.
- Uses `context.waitUntil` so logging does not slow the page response.
- Then `next()` serves the Angular static files.

### C.6 Bind D1 to Pages project

1. Cloudflare dashboard → **Workers & Pages** → project **wheelchairtaxipro** → **Settings** → **Functions** → **D1 bindings**.
2. Add binding name `AD_CLICKS_DB` → database `wtp-ad-clicks`.

Or deploy with Wrangler after `wrangler.toml` is correct:

```bash
cd frontend
npm run build:kkleung
npx wrangler pages deploy dist/frontend/browser --project-name=wheelchairtaxipro --commit-dirty=true
```

### C.7 Query logs (examples)

```sql
-- Repeated IPs in last 7 days
SELECT ip, country, COUNT(*) AS clicks
FROM ad_landing_visits
WHERE created_at >= datetime('now', '-7 days')
GROUP BY ip, country
ORDER BY clicks DESC
LIMIT 50;

-- All visits for one gclid
SELECT * FROM ad_landing_visits WHERE gclid = '...' ORDER BY created_at DESC;
```

### C.8 Privacy (HK)

- Mention anti-fraud / security logging in **私隱政策**.
- Retention: delete or archive rows older than **30–90 days** (cron Worker later, or manual).
- Restrict D1 access to operators you trust.
- See `docs/LearningNotes/logging-google-ads-landing-page-visits.md` §10.

### C.9 Checklist — Worker + D1

- [ ] D1 database created.
- [ ] Table `ad_landing_visits` created.
- [ ] `functions/_middleware.ts` committed.
- [ ] `wrangler.toml` D1 binding matches dashboard.
- [ ] Deploy; hit `?gclid=test` → row appears in D1.
- [ ] Normal visit without `gclid` → no row (if you use the filter above).

---

## 6.6 Phase D — Angular code to add or change

### D.1 Files to create (new)

| File | Purpose |
|------|---------|
| `frontend/src/app/core/services/analytics.service.ts` | Load gclid/UTM on startup; `page_view` on `NavigationEnd`; helper `trackEvent(name, params)` |
| `frontend/scripts/write-ga-config.mjs` | Optional: read `GA_MEASUREMENT_ID` from env / `.env.local` → generate `google-analytics.generated.ts` (mirror Maps script) |
| `frontend/src/app/core/config/google-analytics.generated.ts` | Gitignored generated export `GA_MEASUREMENT_ID` |
| `frontend/functions/_middleware.ts` | Edge ad-click logger (§6.5) |
| `frontend/wrangler.toml` | Pages + D1 binding |

### D.2 Files to change (existing)

| File | Change |
|------|--------|
| `frontend/src/index.html` | Add gtag snippet **or** rely on generated config loaded in `AnalyticsService` |
| `frontend/src/app/app.config.ts` | `provideAppInitializer(() => inject(AnalyticsService).init())` or constructor init in service |
| `frontend/src/app/app.ts` | Optionally inject `AnalyticsService` so it subscribes to router early |
| `frontend/src/app/features/contact-strip/contact-strip.ts` | Already calls `gtag` — refactor to `AnalyticsService.trackEvent('contact_tap', { channel })` |
| `frontend/src/app/features/booking/booking.ts` | On submit: `trackEvent('submit_booking', { …attribution })` |
| `frontend/package.json` | `"prebuild"`: run both Maps + GA config scripts if using env injection |
| `frontend/.gitignore` | Ignore `google-analytics.generated.ts` |
| `frontend/.env.example` | Add `GA_MEASUREMENT_ID=` |
| Cloudflare Pages env | Add `GA_MEASUREMENT_ID` for Production (and Preview if needed) |

### D.3 `AnalyticsService` responsibilities (spec)

On **browser only** (`isPlatformBrowser`):

1. **Once per session (first navigation):**
   - Parse `gclid`, `wbraid`, `gbraid`, `fbclid`, all `utm_*` from `window.location.search`.
   - Save to `localStorage` keys: `wtp_gclid`, `wtp_fbclid`, `wtp_utm` (JSON).
2. **On each `NavigationEnd`:**
   - `gtag('event', 'page_view', { page_path, page_title })` if `gtag` defined.
3. **`trackEvent(name, params)`:**
   - Merge stored attribution into every event.
   - No PII (no phone, name, email) in GA4 params.

### D.4 Example: attribution + event (reference implementation)

```typescript
// analytics.service.ts — illustrative excerpt
private loadAttributionFromUrl(): void {
  const params = new URLSearchParams(window.location.search);
  const gclid = params.get('gclid') ?? params.get('wbraid') ?? params.get('gbraid');
  if (gclid) localStorage.setItem('wtp_gclid', gclid);
  // ... utm_* loop per §2.3 Step 4
}

trackEvent(name: string, extra: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined' || !('gtag' in window)) return;
  const gtag = (window as unknown as { gtag: (...a: unknown[]) => void }).gtag;
  let utm = {};
  try {
    utm = JSON.parse(localStorage.getItem('wtp_utm') ?? '{}');
  } catch { /* ignore */ }
  gtag('event', name, {
    gclid: localStorage.getItem('wtp_gclid'),
    ...utm,
    ...extra,
  });
}
```

### D.5 Build-time GA ID (recommended)

Mirror `scripts/write-google-maps-config.mjs`:

1. Read `process.env.GA_MEASUREMENT_ID` or `frontend/.env.local`.
2. Write `src/app/core/config/google-analytics.generated.ts`:

   ```typescript
   export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
   ```

3. In `AnalyticsService.init()`, inject script only if ID non-empty.

4. Add to Cloudflare Pages → **Environment variables** → **Production**: `GA_MEASUREMENT_ID=G-XXXXXXXXXX`.

### D.6 What NOT to change for this pipeline

- **Do not** add IP logging in Angular or booking form.
- **Do not** put GA Measurement ID in git if the repo is public — use env + gitignore.
- **Maps** `GOOGLE_MAPS_API_KEY` setup stays separate.

---

## 6.7 Phase E — Deploy & connect domain

### E.1 Build (K.K. Leung contact line)

```bash
cd frontend
npm run build:kkleung
```

Uses `contact.manifest.ts` (phone `+85296488582`, WhatsApp `85296488582`) — not James Lo.

### E.2 Deploy to Cloudflare Pages

```bash
npx wrangler pages deploy dist/frontend/browser --project-name=wheelchairtaxipro --commit-dirty=true
```

Or push to Git branch that Pages builds (e.g. `develop`).

### E.3 Custom domain

1. Pages project → **Custom domains** → add `wheelchairtaxipro.com` and `www.wheelchairtaxipro.com`.
2. DNS in Cloudflare zone (usually automatic).
3. Add domain to **GA4** data stream.
4. Add domain to **Google Maps** API key HTTP referrers (separate from this guide).
5. Google Ads final URL must use `https://wheelchairtaxipro.com/...`.

---

## 6.8 End-to-end verification checklist

Run in order after deploy:

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Open `https://wheelchairtaxipro.com/booking?gclid=manual-test-1` | Page loads; booking form visible |
| 2 | D1 → query latest rows | One row: your IP, `gclid=manual-test-1`, full URL |
| 3 | GA4 → **Realtime** | Active user; `page_view` for `/booking` |
| 4 | Tap **WhatsApp** | Realtime event `contact_tap` (or your name) |
| 5 | Submit booking (test data) | Event `submit_booking`; gclid param present |
| 6 | Navigate to **Pricing** | Another `page_view` — proves SPA tracking works |
| 7 | Open same URL **without** `gclid` | D1: no new ad row (if filter on); GA4: still tracks session |
| 8 | Google Ads **Preview** tool | Landing URL includes `gclid` from Google |

---

## 6.9 Using both GA4 and Worker together (rules)

| Question | Use |
|----------|-----|
| How many bookings this week? | **GA4** |
| Which channel (Google / Facebook / QR)? | **GA4** (with UTMs; QR needs tagged URLs) |
| Same IP clicked ad 20 times? | **D1** + Google Ads IP exclusion |
| Did user tap WhatsApp after ad? | **GA4** (`contact_tap`) |
| Visitor’s raw IP for one click? | **D1** (Worker) — GA4 does not give this in reports |
| Block visitor on website? | **Cloudflare WAF / Worker** |
| Stop paying for clicks from an IP? | **Google Ads IP exclusions** |

They run **in parallel** — no conflict. Order of implementation: **GA4 (Phase B)** first for immediate marketing value, then **Worker + D1 (Phase C)** when you need IP forensics.

---

# Part 3 — Suggested order of work

| Order | Task | Effort |
|-------|------|--------|
| 1 | **Part 6 Phase A** — Google Ads URLs + auto-tagging | Config |
| 2 | **Part 6 Phase B** — GA4 + Angular `AnalyticsService` | Small–medium |
| 3 | **Part 6 Phase C** — D1 + Pages `functions/_middleware.ts` | Medium |
| 4 | **Part 6 Phase E** — Deploy + custom domain checks | Small |
| 5 | **Part 6 Phase A.3** — Link Ads conversions to GA4 | Config |
| 6 | Tagged URLs + QR codes (§2.1a) | Config |
| 7 | **Part 7** — robots, sitemap, GSC, SeoService, JSON-LD | Medium |
| 8 | **Part 7** — GBP + content/FAQ pass for GEO/AEO | Content + config |
| 9 | Own promo banner (Part 1) | Small |
| 10 | AdSense (Part 1) only if still wanted | Medium + legal |

---

# Part 4 — Code touchpoints in this repo (when you implement)

| Feature | Files |
|---------|--------|
| **GA4 gtag** | `frontend/src/index.html` and/or `core/services/analytics.service.ts` |
| **GA Measurement ID at build** | `frontend/scripts/write-ga-config.mjs`, `core/config/google-analytics.generated.ts`, Cloudflare env `GA_MEASUREMENT_ID` |
| **SPA analytics** | `frontend/src/app/core/services/analytics.service.ts`, `app.config.ts` |
| **Attribution storage** | Inside `analytics.service.ts` (`localStorage`) |
| **Booking / contact events** | `booking.ts`, `contact-strip.ts` |
| **Ad landing IP log** | `frontend/functions/_middleware.ts`, D1 `ad_landing_visits` table |
| **Wrangler / Pages binding** | `frontend/wrangler.toml`, Cloudflare dashboard D1 binding |
| **In-app promo ads** | `shared/ui/promo-banner/` (Part 1) |
| **SEO / GEO / AEO** | `seo.service.ts`, `shared/ui/json-ld/`, `public/robots.txt`, `public/sitemap.xml` (Part 7) |

**Related docs:**

- `docs/LearningNotes/logging-google-ads-landing-page-visits.md` — fraud focus, privacy
- `initial-design/8-Guide.md` §7 — GA4 + GCLID summary
- `docs/LearningNotes/deploying-an-angular-pwa-to-cloudflare-pages.md` §9 — custom domain

---

# Part 5 — Summary

You want:

1. **Advertisement** — controlled promotional or third-party slots in the app (Part 1).  
2. **Tracking** — full pipeline in **Part 6**: **Google Ad** → **Cloudflare Worker (IP + gclid in D1)** → **Angular + GA4 (behaviour + channels including QR with UTMs)**.  
3. **Discoverability** — **Part 7**: **SEO**, **GEO**, **AEO**, and **AI search** so Google, Bing, and AI answer engines can find and cite Wheelchair Taxi Pro.

**Services to join:** Google Ads, GA4, Cloudflare (Pages + Workers + D1), **Google Search Console**, **Google Business Profile**. Optional: GTM, Bing Webmaster Tools.

**Code to add (tracking):** `functions/_middleware.ts`, `analytics.service.ts`, gtag in `index.html`, event calls in `booking.ts` / `contact-strip.ts`, optional `write-ga-config.mjs`, `wrangler.toml`.

**Code to add (SEO/GEO/AEO):** `seo.service.ts`, `json-ld` component, `robots.txt`, `sitemap.xml`, per-route titles/schema — see Part 7 §7.11.

**Suggested implementation order:** **Part 7** technical SEO (robots, sitemap, GSC) can start early; **Part 6 Phase B (GA4)** for conversions; **Part 6 Phase C (Worker)** for ad fraud; **Part 7** schema + content pass in parallel.

---

# Part 7 — SEO, GEO, AEO & AI search optimization

This section is the **implementation guide** for making `wheelchairtaxipro.com` discoverable in:

- **Traditional search** (Google blue links, Bing)
- **AI-generated answers** (Google AI Overviews / **AI Mode**, Bing Copilot, ChatGPT search, Perplexity, etc.)

It complements **Part 2 / Part 6** (GA4 tells you *what happened after* someone arrived; SEO/GEO/AEO help them *find you first*).

**Stack assumptions:** Angular 21 + `@angular/ssr` prerender, Cloudflare Pages, routes `/booking`, `/route`, `/pricing`, `/faq`, `/about`, domain `wheelchairtaxipro.com`.

---

## 7.1 What SEO, GEO, AEO, and AI search mean

| Term | Full name | Goal |
|------|-----------|------|
| **SEO** | Search Engine Optimization | Rank in Google/Bing **organic** results for queries like「輪椅的士 預約」「wheelchair taxi Hong Kong」. |
| **GEO** | **Generative Engine Optimization** | Be **cited** or summarized when users ask AI tools (ChatGPT, Perplexity, Google AI Overviews). |
| **AEO** | **Answer Engine Optimization** | Structure content so engines return a **direct answer** (featured snippets, FAQ rich results, voice assistants, AI citations). |
| **AI search** | Umbrella (no single official acronym) | Google **AI Mode**, AI Overviews, Bing Copilot, etc. — blends search + LLM answers. |

**How they overlap for this project:**

```text
                    ┌─────────────────────────────────────┐
                    │  Same content & technical foundation   │
                    │  prerender HTML, titles, schema, FAQ   │
                    └─────────────────┬───────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
    Classic SEO                  AEO                         GEO
    (rank in SERPs)         (answer boxes, FAQ rich      (AI cites your
                             results, voice)              site as source)
```

**One content strategy, three surfaces:** write clear **Traditional Chinese** (primary) facts on **pricing**, **service area**, **how to book**, **vehicle types**, and **contact** — in HTML that ships in the prerendered page, not loaded later by JavaScript.

---

## 7.2 Current baseline in this repository

| Area | Status | Notes |
|------|--------|-------|
| **SSR / prerender** | ✅ Configured | `@angular/ssr`; routes in `app.routes.ts` |
| **Public routes** | ✅ | `/booking`, `/route`, `/pricing`, `/faq`, `/about` |
| **Page content** | ✅ Partial | About + FAQ from design docs; pricing page exists |
| **`<title>` / meta description** | ⚠️ Minimal | `index.html` has a generic title; per-route meta not wired |
| **`robots.txt`** | ❌ Missing | Not in `frontend/public/` yet |
| **`sitemap.xml`** | ❌ Missing | Should list all public URLs |
| **Schema.org JSON-LD** | ❌ Planned | Described in `frontend/ARCHITECTURE.md` §7; not implemented |
| **`hreflang` / `/en/`** | ⏳ Scaffold | English mirror commented out in `app.routes.ts` |
| **Google Search Console** | ⏳ Manual | Referenced in design docs; verify after domain live |
| **GA4** | ⏳ Planned | Part 6 — needed for post-click behaviour, not discovery |
| **Google Business Profile** | Off-site | Critical for local HK taxi discovery + Maps |

---

## 7.3 Services & accounts to join

| Service | Required? | Role |
|---------|-----------|------|
| **Google Search Console** | **Yes** | Indexing, queries, Core Web Vitals, sitemap submit |
| **Google Business Profile** | **Yes** (local) | Maps pack, NAP consistency, reviews later |
| **Bing Webmaster Tools** | Recommended | Bing + Copilot indexing |
| **Google Analytics 4** | Yes (Part 6) | Landing pages, engagement — not a substitute for GSC |
| **IndexNow** (optional) | Optional | Faster Bing/Yandex ping on publish |
| **Cloudflare** | Yes | Hosting, cache, optional bot rules for scrapers |

You do **not** need a separate “GEO platform” product. GEO/AEO are **content + markup + authority** practices on your own site.

---

## 7.4 Foundation — technical SEO (all channels)

These steps help **Google, Bing, and AI crawlers** read your site reliably.

### 7.4.1 Keep prerender working

1. Every **public** route must stay in `frontend/src/app/app.routes.ts` (already true).
2. Run production build and confirm HTML exists per route:

   ```bash
   cd frontend
   npm run build:kkleung
   dir dist\frontend\browser\booking\index.html
   dir dist\frontend\browser\faq\index.html
   ```

3. **Rule** (`frontend/ARCHITECTURE.md` §7): SEO-critical text must be in the **component template**, not fetched after page load.

### 7.4.2 Custom domain & HTTPS

- Production URL: `https://wheelchairtaxipro.com` (and optionally `www`).
- Preview URLs (`*.pages.dev`) should use **`robots.txt` disallow** or noindex — see `docs/LearningNotes/cloudflare-pages-multi-operator.md` §1.

### 7.4.3 Add `robots.txt`

**New file:** `frontend/public/robots.txt`

```text
User-agent: *
Allow: /

# Optional: allow common AI crawlers explicitly (policy choice)
# User-agent: GPTBot
# Allow: /
# User-agent: Google-Extended
# Allow: /

Sitemap: https://wheelchairtaxipro.com/sitemap.xml
```

**Policy note:** Some sites block AI training crawlers (`GPTBot`, `Google-Extended`) but **allow search** crawlers (`Googlebot`). For a **local service business** that wants AI answers to cite you, **allowing** search-related and answer crawlers is usually better. Document your choice in the privacy policy.

### 7.4.4 Add `sitemap.xml`

**New file:** `frontend/public/sitemap.xml` (or generate at build time)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://wheelchairtaxipro.com/booking</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://wheelchairtaxipro.com/route</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://wheelchairtaxipro.com/pricing</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://wheelchairtaxipro.com/faq</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://wheelchairtaxipro.com/about</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
</urlset>
```

Update `lastmod` when you change content. Later: script in `frontend/scripts/generate-sitemap.mjs` run at `prebuild`.

### 7.4.5 Canonical URLs

Each route should emit **one canonical URL** to avoid duplicate signals (`/map` vs `/route`, trailing slashes):

```html
<link rel="canonical" href="https://wheelchairtaxipro.com/faq" />
```

In Angular: `Title` + `Meta` services in a `SeoService`, or `@angular/ssr` `resolve` / route `data`.

### 7.4.6 Core Web Vitals

Target **Good** at p75: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 (see ADR-0012).

- Keep booking page light (no AdSense on form — Part 1).
- Fixed heights for banners/images (reduce CLS).
- Monitor in **Search Console** → Experience → Core Web Vitals after launch.

### 7.4.7 Internal linking

Add a shared **related links** block (planned: `shared/ui/related-links/`) on every page:

```text
Booking ←→ Pricing ←→ FAQ ←→ About ←→ Route preview
```

Use descriptive anchor text (not “click here”):

- 「輪椅的士收費」→ `/pricing`
- 「常見問題」→ `/faq`

---

## 7.5 On-page SEO — every public route

### 7.5.1 Title and meta description pattern

| Route | Suggested `<title>` (zh-Hant) | Meta description intent |
|-------|------------------------------|-------------------------|
| `/booking` | 輪椅的士預約 \| Wheelchair Taxi Pro 香港 | 即時預約無障礙的士，電話／WhatsApp，上門接送 |
| `/pricing` | 輪椅的士收費及服務費 \| Wheelchair Taxi Pro | 咪錶車資 + 預約服務費 $100/$120/$150 說明 |
| `/faq` | 輪椅的士常見問題 \| Wheelchair Taxi Pro | 預約、收費、輪椅尺寸、服務範圍 FAQ |
| `/about` | 關於我們 \| Wheelchair Taxi Pro 香港輪椅的士 | 公司簡介、服務承諾、聯絡方式 |
| `/route` | 路程及時間預覽 \| Wheelchair Taxi Pro | 查閱上車點至目的地大約路程 |

**Rules:**

- One clear **H1** per page matching user intent.
- **H2/H3** hierarchy for sections (FAQ questions = H2 or H3).
- Include **Hong Kong**, **輪椅的士**, **無障礙** naturally — not keyword stuffing.
- Phone/WhatsApp visible in HTML (already in contact strip).

### 7.5.2 Open Graph & Twitter cards (sharing)

For Facebook / WhatsApp link previews:

```html
<meta property="og:title" content="輪椅的士預約 | Wheelchair Taxi Pro" />
<meta property="og:description" content="..." />
<meta property="og:url" content="https://wheelchairtaxipro.com/booking" />
<meta property="og:image" content="https://wheelchairtaxipro.com/banner-header.png" />
<meta property="og:locale" content="zh_HK" />
<meta name="twitter:card" content="summary_large_image" />
```

Set per route in `SeoService` on `NavigationEnd` (and in prerendered HTML for crawlers).

### 7.5.3 Images

- Meaningful `alt` on logo, banners, vehicle diagrams.
- Compress PNG/JPEG; WebP optional via build pipeline.

### 7.5.4 English mirror (Phase 1.2+)

When `/en/...` ships:

- `hreflang` pairs: `zh-Hant` ↔ `en`
- Separate titles/descriptions per language
- Same Schema.org entities with `inLanguage`

---

## 7.6 Structured data (Schema.org JSON-LD)

Structured data helps **Google rich results** (FAQ) and gives **AI systems** parseable facts (GEO/AEO).

### 7.6.1 Types to implement

| Schema type | Page | Purpose |
|-------------|------|---------|
| `LocalBusiness` / `TaxiService` | `/about`, `/booking` | Name, phone, area served, hours |
| `FAQPage` | `/faq` | FAQ rich results + AEO |
| `Service` | `/pricing` | Service fees, vehicle types |
| `BreadcrumbList` | All | Navigation context |
| `WebSite` + `SearchAction` | Global (optional) | Sitelinks search box (optional) |

**Do not** add `AggregateRating` / reviews until real reviews exist (Google penalty risk — see `docs/design/11-risks-and-technical-debts.md`).

### 7.6.2 Example — `LocalBusiness` (adjust to real NAP)

Inject in `about.html` or shared layout:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TaxiService",
  "name": "Wheelchair Taxi Pro",
  "alternateName": "輪椅的士專線",
  "url": "https://wheelchairtaxipro.com",
  "telephone": "+85296488582",
  "areaServed": { "@type": "City", "name": "Hong Kong" },
  "availableLanguage": ["zh-HK", "en"],
  "description": "香港輪椅的士預約及無障礙接送服務。"
}
</script>
```

Use **`contact.manifest.ts`** values for the active operator build (`kkleung` vs `jameslo`).

### 7.6.3 Example — `FAQPage`

Mirror the **visible** FAQ text exactly (no hidden FAQ keywords).

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "如何預約輪椅的士？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "填寫網上預約表格後透過 WhatsApp 送出，或致電/WhatsApp 聯絡我們。"
      }
    }
  ]
}
</script>
```

### 7.6.4 Implementation pattern (Angular)

1. Create `shared/ui/json-ld/json-ld.component.ts` — inputs: `schema: Record<string, unknown>`.
2. Each feature page passes route-specific schema.
3. Alternatively: `SeoService.setJsonLd(obj)` manipulates one `<script type="application/ld+json">` in `document.head` (browser) + static in template for prerender.

Validate with [Google Rich Results Test](https://search.google.com/test/rich-results) and [Schema Markup Validator](https://validator.schema.org/).

---

## 7.7 GEO — Generative Engine Optimization

**Goal:** When someone asks ChatGPT, Perplexity, or Google AI Mode *「香港哪裡可以預約輪椅的士？」*, the model can **cite** `wheelchairtaxipro.com` with correct facts.

### 7.7.1 What helps GEO (evidence-based practices)

| Practice | Why |
|----------|-----|
| **Unique, factual copy** | Models prefer citable sources with specific fees, steps, phone |
| **Prerendered HTML** | Many AI crawlers do not execute Angular fully |
| **Schema.org JSON-LD** | Machine-readable business facts |
| **Clear headings & short paragraphs** | Easy to extract answers |
| **Named entities** | 「Wheelchair Taxi Pro」「香港」「輪椅的士」|
| **Fresh `lastmod` / updates** | Pricing changes reflected on `/pricing` |
| **Authority signals** | GBP, backlinks, consistent NAP across directories |
| **FAQ that matches real questions** | Aligns with how people prompt AI |

### 7.7.2 Content checklist for GEO

- [ ] **One paragraph “elevator pitch”** on About: who you are, service area, how to book.
- [ ] **Pricing table** in plain HTML on `/pricing` (not image-only).
- [ ] **Step-by-step booking** on `/booking` or FAQ: 1) 填表 2) WhatsApp 3) 確認.
- [ ] **Service boundaries**: 24hr? hospitals? airport? — explicit yes/no.
- [ ] **Vehicle types** with wheelchair dimensions if applicable.
- [ ] **Contact methods** repeated in footer/About (consistent with `contact.manifest.ts`).
- [ ] Avoid vague marketing fluff; prefer **verifiable** statements.

### 7.7.3 What does *not* require a separate tool

- No need to “submit” to ChatGPT — focus on **being crawlable, factual, and linked**.
- `llms.txt` (optional emerging convention): some sites add `/llms.txt` summarizing allowed pages for LLMs — optional, not required by Google.

---

## 7.8 AEO — Answer Engine Optimization

**Goal:** Win **direct answers** — Google featured snippets, FAQ rich results, voice search, AI answer boxes.

### 7.8.1 FAQ structure (best AEO lever for this site)

On `/faq`:

1. Question as **visible heading** (H2/H3).
2. **40–80 character** direct answer in the first sentence.
3. Optional detail in following sentences.
4. Same Q/A in `FAQPage` JSON-LD.

**Example pattern:**

```text
## 輪椅的士預約費是多少？

預約服務費視乎車型另加 $100、$120 或 $150，車資以的士咪錶為準。
詳情請參閱收費頁面……
```

### 7.8.2 “People also ask” style coverage

Add FAQ entries for queries you expect:

- 點樣預約輪椅的士？
- 輪椅的士幾錢？
- 可唔可以去機場／醫院？
- 輪椅尺寸有限制嗎？
- 即日可以約嗎？
- 同普通嘅士有咩分別？

### 7.8.3 Tables and lists

Pricing page: HTML `<table>` for vehicle type × service fee — snippets often pull from tables/lists.

### 7.8.4 Speakable (optional)

Schema `Speakable` specification for voice — low priority for Phase 1.

---

## 7.9 Google AI Mode & other AI search surfaces

| Surface | What it is | What you optimize |
|---------|------------|-------------------|
| **Google AI Overviews** | AI summary above/below classic results | Strong SEO + E-E-A-T + schema + GSC health |
| **Google AI Mode** | Conversational search tab (US rollout expanding) | Same as GEO — factual pages, FAQ, authority |
| **Bing Copilot** | Bing search + LLM | Bing Webmaster Tools + same on-page basics |
| **ChatGPT / Perplexity** | Third-party answer engines | Citations follow links + reputable sources |
| **Google Gemini** | May use Google index + live browse | Indexed prerender pages + GBP |

**You cannot fully control** whether AI quotes you, but **FAQ + LocalBusiness + consistent NAP + Search Console indexing** maximizes inclusion.

**Monitor:** Search Console → Performance (queries), and manually test prompts in AI tools with HK geo context.

---

## 7.10 Local & off-site signals (Hong Kong)

SEO for a **wheelchair taxi** is heavily **local**.

### 7.10.1 Google Business Profile (GBP)

1. Claim/create profile: business name, address (or service area), phone, hours, category (taxi / medical transport as appropriate).
2. Website URL: `https://wheelchairtaxipro.com`.
3. Match **exact** phone/WhatsApp with `contact.manifest.ts`.
4. Add photos (vehicles, logo).
5. Post occasional updates (pricing changes, CNY notices).
6. Reviews: ask satisfied customers **after** trip — only then consider `Review` schema.

### 7.10.2 NAP consistency

**N**ame, **A**ddress, **P**hone must match across:

- Website About page
- GBP
- Facebook Page
- Directories / hospital transport lists (if any)

### 7.10.3 Backlinks & partnerships

Per `initial-design/10-hosting_affiliate_strategy_for_wheelchair_taxi_pro_hong_kong.md`:

- Rehab centres, care homes, NGOs linking to `/faq` or `/booking`
- Press / community mentions
- Avoid paid link farms

### 7.10.4 Social (Facebook)

Facebook is **not** a replacement for the website landing page (Part 6), but the Page supports trust. Link to tagged URLs:

```text
https://wheelchairtaxipro.com/booking?utm_source=facebook&utm_medium=social&utm_campaign=page
```

---

## 7.11 Angular code to add or change

| Item | File(s) | Action |
|------|---------|--------|
| **SeoService** | `core/services/seo.service.ts` (new) | Set `Title`, `Meta`, canonical, OG tags per route |
| **JSON-LD component** | `shared/ui/json-ld/` (new) | Inject schema per page |
| **Route SEO data** | `*.routes.ts` or route `data: { seo: {...} }` | Title/description defaults |
| **App init** | `app.config.ts` | Listen `NavigationEnd` → `SeoService.updateForRoute()` |
| **robots.txt** | `frontend/public/robots.txt` | Static file |
| **sitemap.xml** | `frontend/public/sitemap.xml` or build script | Static or generated |
| **Per-page schema** | `about.html`, `faq.html`, `pricing.html`, `booking.html` | `<app-json-ld>` or inline script |
| **Related links** | `shared/ui/related-links/` (new) | Internal linking |
| **index.html** | `src/index.html` | Default `lang`, fallback meta only |
| **English routes** | `app.routes.ts` + `features/en/` | When i18n ships: `hreflang` |

**Already good:**

- Prerender via SSR
- Rich FAQ/About content in templates
- Contact strip with phone/WhatsApp in HTML

---

## 7.12 Measurement & verification

### 7.12.1 Google Search Console setup

1. Add property `https://wheelchairtaxipro.com`.
2. Verify via **DNS TXT** (Cloudflare DNS) or HTML tag.
3. Submit `sitemap.xml`.
4. Request indexing for `/booking`, `/faq`, `/pricing` after major launches.
5. Weekly: Performance → queries, pages, indexing errors.

### 7.12.2 Bing Webmaster Tools

1. Import from GSC or verify separately.
2. Submit same sitemap.

### 7.12.3 Manual checks

| Check | Tool / method |
|-------|----------------|
| Indexed? | `site:wheelchairtaxipro.com` on Google |
| Rich results | Google Rich Results Test on `/faq` |
| Mobile | Search Console Mobile Usability |
| Speed | PageSpeed Insights, Lighthouse CI |
| AI citation | Ask AI tools HK wheelchair taxi questions; note if site cited |
| Prerender | View source on production `/faq` — full text visible without JS |

### 7.12.4 KPIs (first 90 days)

- Impressions/clicks in GSC for「輪椅的士」「wheelchair taxi hong kong」
- Average position for target queries (trend, not absolute)
- Indexed page count = 5+ public routes
- FAQ rich result eligibility (Rich Results Test)
- Organic sessions in GA4 (once Part 6 live) vs paid/direct/QR

---

## 7.13 Suggested order of work

| Order | Task | Effort |
|-------|------|--------|
| 1 | Confirm prerender HTML for all routes | Small |
| 2 | `robots.txt` + `sitemap.xml` + GSC verify | Small |
| 3 | `SeoService` — titles, descriptions, canonical, OG | Medium |
| 4 | H1/H2 audit on booking, pricing, faq, about | Small |
| 5 | `FAQPage` + `LocalBusiness` JSON-LD | Medium |
| 6 | Internal related-links component | Small |
| 7 | Google Business Profile + NAP match | Config |
| 8 | Bing Webmaster Tools | Small |
| 9 | GEO content pass (pricing table, booking steps) | Content |
| 10 | English `/en/` + `hreflang` | Medium (later) |

**Parallel with Part 6:** GA4 and GSC together give full funnel (search → land → convert).

---

## 7.14 Master checklist

### Technical

- [ ] All public routes prerender with full text in HTML source
- [ ] `robots.txt` deployed
- [ ] `sitemap.xml` deployed and submitted in GSC
- [ ] Canonical URL per route
- [ ] Core Web Vitals in “Good” range on `/booking`
- [ ] Preview/staging URLs not indexed (or disallowed)

### On-page

- [ ] Unique title + meta description per route
- [ ] One H1 per page; logical H2/H3
- [ ] OG tags for social sharing
- [ ] Image `alt` text
- [ ] Internal links between main pages

### Schema & AEO

- [ ] `LocalBusiness` / `TaxiService` on About or Booking
- [ ] `FAQPage` matches visible FAQ
- [ ] `Service` / pricing facts on Pricing page
- [ ] `BreadcrumbList` on inner pages
- [ ] No fake review schema

### GEO & AI

- [ ] Factual, citable paragraphs (fees, steps, area, contact)
- [ ] FAQ answers first sentence = direct answer
- [ ] Pricing in HTML table, not image-only
- [ ] Optional: decide AI crawler policy in `robots.txt`

### Off-site

- [ ] Google Business Profile claimed and matches site
- [ ] Facebook page links to tagged booking URL
- [ ] Bing Webmaster Tools configured

### Measurement

- [ ] Search Console verified
- [ ] Sitemap status OK
- [ ] GA4 organic channel visible (Part 6)
- [ ] Quarterly: test AI tools for HK wheelchair taxi queries

---

**Related docs:**

- `frontend/ARCHITECTURE.md` §7 — prerender & schema rules
- `docs/LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md` — why prerender on Cloudflare
- `docs/LearningNotes/cloudflare-pages-multi-operator.md` §1 — preview vs production SEO
- `initial-design/13-1-Frontend-phase1.md` §3.2 — SEO/GEO/AEO overlap
- `docs/design/08-cross-cutting-concepts.zh-HK.md` — cross-cutting SEO/GEO/AEO scope
- `docs/design/adr/0012-target-core-web-vitals-good-thresholds.md` — CWV targets
