# SEO, GEO, AEO & AI search optimization — implementation guide

**Wheelchair Taxi Pro** · Angular 21 PWA · Cloudflare Pages · `wheelchairtaxipro.com`

This document is the **standalone implementation guide** for making the site discoverable in:

- **Traditional search** — Google and Bing organic results
- **Answer engines** — featured snippets, FAQ rich results, voice assistants
- **Generative / AI search** — Google AI Overviews, AI Mode, Bing Copilot, ChatGPT, Perplexity

It is written for the **current Phase 1 stack**: prerendered Angular, booking via WhatsApp, no backend database. You can implement everything here **before** analytics / ad tracking (see `initial-design/18 - advertisement-and-tracking-instructions.md` Part 6 for GA4 later).

**First go-live (domain + deploy)** is documented separately in [`20-first-go-live.md`](./20-first-go-live.md). This guide assumes you can open `https://wheelchairtaxipro.com/booking` in a browser. If not, finish §6 (or doc 20) first — SEO cannot start on `localhost` alone.

---

## Table of contents

0. [How to start (read this first)](#0-how-to-start-read-this-first)
   - [0.1 Where you are now](#01-where-you-are-now)
   - [0.2 What to do this week (start here)](#02-what-to-do-this-week-start-here)
   - [0.3 What *not* to do first](#03-what-not-to-do-first)
   - [0.4 How the rest of this guide maps to your week](#04-how-the-rest-of-this-guide-maps-to-your-week)
1. [What you are trying to achieve](#1-what-you-are-trying-to-achieve)
2. [Terminology — SEO, GEO, AEO, AI search](#2-terminology--seo-geo-aeo-ai-search)
3. [Stack assumptions & public routes](#3-stack-assumptions--public-routes)
   - [3.1 Prerendering (static HTML at build time) for SEO — not live SSR](#31-prerendering-static-html-at-build-time-for-seo--not-live-ssr)
4. [Current baseline in this repository](#4-current-baseline-in-this-repository)
5. [Services & accounts to join](#5-services--accounts-to-join)
6. [Deploy & make your custom domain live](#6-deploy--make-your-custom-domain-live)
7. [Phase 1 — Technical foundation](#7-phase-1--technical-foundation)
   - [7.1 Keep prerender working](#71-keep-prerender-working)
   - [7.2 Custom domain & HTTPS](#72-custom-domain--https)
   - [7.3 Core Web Vitals](#73-core-web-vitals)
   - [7.4 Crawler / AI bot policy (`robots.txt`)](#74-crawler--ai-bot-policy-robotstxt)
8. [Phase 2 — On-page SEO (every route)](#8-phase-2--on-page-seo-every-route)
9. [Phase 3 — Structured data (Schema.org JSON-LD)](#9-phase-3--structured-data-schemaorg-json-ld)
10. [Phase 4 — GEO content strategy](#10-phase-4--geo-content-strategy)
11. [Phase 5 — AEO (FAQ & answer formatting)](#11-phase-5--aeo-faq--answer-formatting)
12. [Phase 6 — AI search surfaces](#12-phase-6--ai-search-surfaces)
13. [Phase 7 — Local & off-site signals (Hong Kong)](#13-phase-7--local--off-site-signals-hong-kong)
14. [Phase 8 — Angular code to implement](#14-phase-8--angular-code-to-implement)
15. [Phase 9 — Static files (`robots.txt`, `sitemap.xml`)](#15-phase-9--static-files-robotstxt-sitemapxml)
16. [Phase 10 — Preview / staging SEO rules](#16-phase-10--preview--staging-seo-rules)
17. [Phase 11 — English mirror & `hreflang` (later)](#17-phase-11--english-mirror--hreflang-later)
18. [Measurement & verification](#18-measurement--verification)
19. [Suggested order of work](#19-suggested-order-of-work)
   - [19.1 Week 1 sprint (copy this into a todo list)](#191-week-1-sprint-copy-this-into-a-todo-list)
20. [Master checklist](#20-master-checklist)
21. [Related docs](#21-related-docs)

---

## 0. How to start (read this first)

If you feel lost in SEO / GEO / AEO jargon, **ignore the later phases for now**. Do the checklist in [§0.2](#02-what-to-do-this-week-start-here) in order. That alone gets Google ready to discover you. Code and schema come after.

### 0.1 Where you are now

| Checkpoint | Typical status after first go-live |
|------------|-------------------------------------|
| Site live on HTTPS | `https://wheelchairtaxipro.com` (and optionally `www`) |
| Deploy path | Cloudflare Pages project `wheelchairtaxipro` (Wrangler and/or Git) |
| Operator build | `npm run build:kkleung` (phone / WhatsApp baked in) |
| Content already strong | About + FAQ + Pricing in HTML (good for AEO/GEO later) |
| Still missing for SEO | `robots.txt`, `sitemap.xml`, Search Console, rich titles/meta, JSON-LD, GBP |

**You do not need GA4, Google Ads, or English pages to start SEO.**

### 0.2 What to do this week (start here)

Work through these **in order**. Each step has a “done when” so you know you can move on.

#### Day 1 — Confirm the live site is crawlable

1. Open in **Incognito**:
   - https://wheelchairtaxipro.com/booking  
   - https://wheelchairtaxipro.com/faq  
   - https://wheelchairtaxipro.com/pricing  
   - https://wheelchairtaxipro.com/about  
2. On `/faq`, right-click → **View page source**.  
   **Done when:** you see real FAQ Chinese text in the HTML (not only `<app-root></app-root>`).  
   If empty → prerender is broken; fix build before anything else ([§7.1](#71-keep-prerender-working)).
3. Confirm Call / WhatsApp use the K.K. Leung numbers you expect.

#### Day 1–2 — Google Search Console (required)

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add property type **URL prefix**: `https://wheelchairtaxipro.com`
3. Verify with **DNS** (easiest on Cloudflare):
   - GSC shows a TXT record name/value.
   - Cloudflare → Domains → `wheelchairtaxipro.com` → **DNS** → **Add record** → Type **TXT**, Name `@` (or as GSC says), Content = the GSC token → Save.
   - Back in GSC → **Verify**.
4. **Done when:** property shows as verified.

Detailed steps: [§18.1](#181-google-search-console-setup).

#### Day 2 — Add `robots.txt` + `sitemap.xml` (required)

1. Create the two files under `frontend/public/` using the templates in [Phase 9](#15-phase-9--static-files-robotstxt-sitemapxml).
2. Rebuild and redeploy (same Wrangler or Git flow you used for go-live):

   ```powershell
   cd frontend
   npm run build:kkleung
   npx wrangler pages deploy dist/frontend/browser --project-name=wheelchairtaxipro --branch=main --commit-dirty=true
   ```

3. Confirm in the browser:
   - https://wheelchairtaxipro.com/robots.txt  
   - https://wheelchairtaxipro.com/sitemap.xml  
4. In Search Console → **Sitemaps** → submit `https://wheelchairtaxipro.com/sitemap.xml`.
5. **Done when:** both URLs return 200 and GSC accepts the sitemap (may show “Success” after a delay).

#### Day 2–3 — Ask Google to index the main pages

In Search Console → **URL Inspection**:

1. Inspect `https://wheelchairtaxipro.com/booking` → **Request indexing**
2. Repeat for `/faq`, `/pricing`, `/about`

**Done when:** requests are submitted (indexing itself can take days — that is normal).

#### Day 3 — Google Business Profile (local SEO — high impact in HK)

1. Claim / create [Google Business Profile](https://business.google.com/) for the wheelchair taxi service.
2. Set website to: `https://wheelchairtaxipro.com/booking`
3. Phone / WhatsApp / address must match the site (`contact.manifest.ts` / About page).
4. **Done when:** profile is created or claimed and website URL is saved.

Details: [§13.1](#131-google-business-profile-gbp).

#### Day 4–5 — First code SEO pass (titles + meta)

Do **not** rewrite the whole site. Implement the minimum from [Phase 8](#14-phase-8--angular-code-to-implement):

1. Add a small `SeoService` that sets `<title>` and meta description per route.
2. Add `data.seo` (or route `title` + description) for `/booking`, `/faq`, `/pricing`, `/about`, `/route`.
3. Redeploy and **View source** — each page should show a unique `<title>` and `<meta name="description" …>`.

**Done when:** five public routes have unique titles/descriptions in raw HTML.

Suggested title pattern: [§8.1](#81-title-and-meta-description-pattern).

#### Day 5–7 — FAQPage schema (best AEO lever)

1. Add JSON-LD `FAQPage` on `/faq` matching the **visible** Q&A ([§9.3](#93-example--faqpage), [§14.5](#145-jsonldcomponent-reference)).
2. Validate with [Rich Results Test](https://search.google.com/test/rich-results) on the live `/faq` URL.
3. **Done when:** test reports FAQ eligible (or valid FAQ markup with no critical errors).

Optional same week: add `TaxiService` / `LocalBusiness` JSON-LD on About or Booking ([§9.1](#91-types-to-implement)).

### 0.3 What *not* to do first

| Skip for now | Why |
|--------------|-----|
| GA4 / ads tracking | Measures traffic; does not get you indexed. Do after Search Console + sitemap. |
| English `/en/` + `hreflang` | Nice later ([§17](#17-phase-11--english-mirror--hreflang-later)); zh-Hant first. |
| Buying backlinks | Risky and unnecessary for week 1. |
| Blocking AI bots in `robots.txt` | For a local service that wants AI citations, **allow** crawlers unless legal says otherwise ([§7.4](#74-crawler--ai-bot-policy-robotstxt)). |
| Perfect Core Web Vitals before launch | Monitor after GSC is live; don’t block indexing on Lighthouse scores. |
| Rewriting all copy before technical SEO | You already have strong FAQ/About/Pricing — ship discovery files first. |

### 0.4 How the rest of this guide maps to your week

```text
Week 1 (this section §0.2)
  └─ Live site → GSC → robots/sitemap → index requests → GBP → titles → FAQ schema

Week 2–3
  └─ Phase 2–3 full on-page + TaxiService schema + related-links (§8–§9, §14)
  └─ GEO/AEO content polish on booking + pricing (§10–§11)

Week 4+
  └─ Bing Webmaster, AI citation spot-checks (§12, §18)
  └─ English mirror when ready (§17)
  └─ GA4 when you want funnels (doc 18)
```

Full ordered table: [§19](#19-suggested-order-of-work). Printable checklist: [§20](#20-master-checklist).

---

## 1. What you are trying to achieve

| Goal | Success looks like |
|------|-------------------|
| **Be found** | Users searching「輪椅的士 預約」「wheelchair taxi Hong Kong」see your pages in Google/Bing |
| **Be understood** | Crawlers and AI tools read **full HTML** with titles, descriptions, schema, and FAQ text |
| **Be cited** | AI tools answer HK wheelchair-taxi questions with facts from your site (fees, booking steps, phone) |
| **Convert** | Organic visitors land on **`/booking`**, see trust signals (pricing, FAQ, contact), and book via WhatsApp |

**One content strategy, three surfaces:** write clear **Traditional Chinese** facts — pricing, service area, how to book, vehicle types, contact — in **HTML that ships in the prerendered page**, not loaded later by JavaScript.

---

## 2. Terminology — SEO, GEO, AEO, AI search

| Term | Full name | Goal |
|------|-----------|------|
| **SEO** | Search Engine Optimization | Rank in Google/Bing **organic** blue-link results |
| **GEO** | Generative Engine Optimization | Be **cited** or summarized when users ask AI tools |
| **AEO** | Answer Engine Optimization | Win **direct answers** — snippets, FAQ rich results, voice |
| **AI search** | Umbrella (no single official acronym) | Google AI Mode, AI Overviews, Bing Copilot, etc. |

```text
                    ┌─────────────────────────────────────┐
                    │  Same content & technical foundation │
                    │  prerender HTML, titles, schema, FAQ │
                    └─────────────────┬───────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
    Classic SEO                  AEO                         GEO
    (rank in SERPs)         (answer boxes, FAQ rich      (AI cites your
                             results, voice)              site as source)
```

You do **not** need a separate “GEO platform” product. GEO and AEO are **content + markup + authority** on your own site plus **Google Search Console** and **Google Business Profile**.

---

## 3. Stack assumptions & public routes

| Item | Value |
|------|--------|
| Framework | Angular 21, standalone components, `@angular/ssr` prerender |
| Hosting | Cloudflare Pages (`dist/frontend/browser`) |
| Production domain | `https://wheelchairtaxipro.com` |
| Default landing | `/` → redirects to **`/booking`** |
| Public routes | `/booking`, `/route`, `/pricing`, `/faq`, `/about` |
| Legacy redirect | `/map` → `/route` |
| Primary language | `zh-Hant` (`<html lang="zh-Hant">`) |
| Contact line | `frontend/src/app/shared/config/contact.manifest.ts` (per-operator build via `fileReplacements`) |

**Prerender rule** (`frontend/ARCHITECTURE.md` §7): SEO-critical text must be in the **component template**, not fetched after page load.

### 3.1 Prerendering (static HTML at build time) for SEO — not live SSR

For Angular SEO / GEO / AEO on this project, we use **prerendering** (also called **SSG — Static Site Generation**): finished HTML for each public route is generated **once at build time**, then uploaded to Cloudflare Pages. We do **not** need live **SSR** (Node rendering HTML on every visitor request) for Phase 1.

#### Why crawlers care

Search engines and many AI crawlers read the **first HTML response**. A classic client-only SPA often sends:

```html
<body><app-root></app-root><!-- big JS bundle --></body>
```

If the real FAQ, pricing, and titles only appear after JavaScript runs, indexing and AI citation are weaker or unreliable.

With prerendering, `/faq`, `/booking`, `/pricing`, etc. already contain **visible text, headings, and (later) meta/JSON-LD** in that first HTML. The browser then hydrates Angular for interactivity.

#### CSR vs prerender vs live SSR

| Mode | When HTML is built | Hosting | SEO for this site? |
|------|--------------------|---------|---------------------|
| **CSR only** (client-side SPA) | In the visitor’s browser after JS | Static files | Weak — empty shell first |
| **Prerender / SSG** ✅ | At **`npm run build:kkleung`** | Cloudflare Pages static | **Strong** — full HTML per route |
| **Live SSR** | On **every request** on a Node server | Workers / Node host | Strong, but more cost/complexity; not needed while pages are the same for every visitor |

#### What this repo already does

| Setting / file | Role |
|----------------|------|
| `angular.json` → `"outputMode": "static"` | Build emits static HTML per route |
| `app.routes.server.ts` → `RenderMode.Prerender` | All routes prerendered |
| `dist/frontend/browser/{route}/index.html` | Files Cloudflare Pages serves |
| `provideClientHydration(...)` | Browser “wakes up” the prerendered page |

Verify after every production build:

```powershell
cd frontend
npm run build:kkleung
# Then open dist\frontend\browser\faq\index.html — FAQ text must be in the file
```

On the live site: right-click → **View page source** on `/faq` (prefer Incognito so a stale service worker does not hide the truth).

#### Do we need to switch to live SSR for SEO?

**No.** Keep prerender for `/booking`, `/faq`, `/pricing`, `/about`, `/route`. Consider live SSR later only for pages that must differ **per request** (e.g. logged-in dashboards). For marketing + booking content that is the same for everyone, prerender is the right SEO foundation — then add titles, meta, schema, `robots.txt`, and sitemap on top ([§0](#0-how-to-start-read-this-first), [§7.1](#71-keep-prerender-working)).

---

## 4. Current baseline in this repository

| Area | Status | Notes |
|------|--------|-------|
| **SSR / prerender** | ✅ Configured | Routes in `app.routes.ts`; build emits HTML per route |
| **Public page content** | ✅ Partial | Rich About + FAQ templates; pricing in HTML; booking fee notice includes prices after PR #37 |
| **Landing URL** | ✅ `/booking` | Site opens on booking form |
| **Production domain** | ✅ Live | `https://wheelchairtaxipro.com` on Cloudflare Pages (see [`20-first-go-live.md`](./20-first-go-live.md)) |
| **`<title>` / meta description** | ⚠️ Minimal | `index.html` fallback title is generic; route `title` in `*.routes.ts` is short (e.g. `輪的 · 預約`) — **Week 1 code task** |
| **`robots.txt`** | ❌ Missing | Not in `frontend/public/` — **do this next** ([§15](#15-phase-9--static-files-robotstxt-sitemapxml)) |
| **`sitemap.xml`** | ❌ Missing | Should list all public URLs — **do this next** |
| **`SeoService`** | ❌ Not implemented | Planned — see Phase 8 |
| **Schema.org JSON-LD** | ❌ Not implemented | Planned — see Phase 3 / 8 |
| **`related-links` component** | ❌ Not implemented | Internal linking — see Phase 2 |
| **`hreflang` / `/en/`** | ⏳ Scaffold | English mirror commented out in `app.routes.ts` |
| **Google Search Console** | ⏳ Manual | Verify after domain live — **Week 1** ([§0.2](#02-what-to-do-this-week-start-here)) |
| **Google Business Profile** | Off-site | Critical for local HK discovery — **Week 1** |

---

## 5. Services & accounts to join

| Service | Required? | Role |
|---------|-----------|------|
| **Google Search Console** | **Yes** | Indexing, queries, Core Web Vitals, sitemap submit |
| **Google Business Profile** | **Yes** (local) | Maps pack, NAP consistency, reviews later |
| **Bing Webmaster Tools** | Recommended | Bing + Copilot indexing |
| **Cloudflare** | Yes | Hosting, DNS, cache |
| **Google Analytics 4** | Optional for SEO | Measures traffic **after** arrival — not required to **get indexed** |
| **IndexNow** | Optional | Faster Bing ping on publish |

---

## 6. Deploy & make your custom domain live

**SEO only works once the site is publicly reachable over HTTPS on a stable URL.** Google Search Console, indexing, Google Business Profile, and AI crawlers cannot fetch `localhost`. This section takes you from the repo to `https://wheelchairtaxipro.com` live.

You already **own `wheelchairtaxipro.com` in Cloudflare**, so the domain step is short.

> You do **not** need analytics, ads, or a finished SEO pass before going live. Ship first, then do Phases 1–11 on the live site.

### 6.1 Pre-deploy check (local)

```powershell
cd frontend
npm run build:kkleung
dir dist\frontend\browser\booking\index.html
dir dist\frontend\browser\faq\index.html
```

- Build must succeed and emit per-route `index.html`.
- **View source** of `dist\frontend\browser\faq\index.html` — you must see real FAQ text, **not** an empty `<app-root>`. If empty, prerendering did not run; fix locally before deploying.
- Use **`build:kkleung`** (or `build:jameslo`) so the correct operator contact line is baked in.

### 6.2 Create the Cloudflare Pages project (Git-connected — recommended)

1. [Cloudflare dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorize GitHub and pick the repo **`git-wheelchairtaxipro1`**.
3. **Project name:** `wheelchairtaxipro` (this becomes `wheelchairtaxipro.pages.dev` — renames are painful, choose carefully).
4. **Production branch:** `main`.

### 6.3 Build settings (monorepo — critical)

The Angular app lives in the `frontend/` subdirectory, so these exact values matter:

| Field | Value | Why |
|-------|-------|-----|
| **Root directory** | `frontend` | Tells Pages to `cd frontend` before building. #1 monorepo failure if blank. |
| **Build command** | `npm ci && npm run build:kkleung` | Reproducible install + correct operator build |
| **Build output directory** | `dist/frontend/browser` | The prerendered static output — **not** `dist/frontend/` |

### 6.4 Environment variables

Pages → **Settings** → **Environment variables**. Add for **Production** (and **Preview** if previews need the map):

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_VERSION` | `22` | Angular 21 needs Node 20.19+ / 22 |
| `GOOGLE_MAPS_API_KEY` | your prod Maps key | Baked into JS by `prebuild` (`scripts/write-google-maps-config.mjs`) |

In **Google Cloud Console**, the Maps key's **HTTP referrer** allowlist must include:

- `https://wheelchairtaxipro.com/*`
- `https://www.wheelchairtaxipro.com/*`
- `https://*.pages.dev/*` (the `pages.dev` host + preview aliases)

> If `GOOGLE_MAPS_API_KEY` is missing, the site still deploys — only the `/route` map shows a "setup" state. SEO is unaffected.

### 6.5 First deploy & verify on `*.pages.dev`

Click **Save and Deploy**. The first build takes ~3–6 minutes. When done you get `https://wheelchairtaxipro.pages.dev`. Verify:

- `/` → redirects to `/booking`
- `/booking`, `/route`, `/pricing`, `/faq`, `/about` all load
- **View source** on `/faq` shows full HTML (prerender confirmed)
- Build log says it prerendered the static routes

### 6.6 Attach `wheelchairtaxipro.com` (custom domain)

Because the zone is **already on Cloudflare**, Pages wires DNS + SSL automatically:

1. Pages project → **Custom domains** → **Set up a custom domain**.
2. Enter `wheelchairtaxipro.com` → **Continue** → **Activate domain**.
   - Pages creates the `CNAME` in your Cloudflare DNS and issues a Universal SSL cert (usually 1–5 min, sometimes longer for the apex).
3. Add `www.wheelchairtaxipro.com` the same way.
4. **Redirect `www` → apex** (pick one canonical host — apex recommended):
   - Cloudflare dashboard → your domain → **Rules** → **Redirect Rules** → create:
     **If** hostname equals `www.wheelchairtaxipro.com` **then** 301 redirect to `https://wheelchairtaxipro.com/$1` (preserve path/query).
5. Confirm `https://wheelchairtaxipro.com` serves the site and `http://` / `www` both 301 to the HTTPS apex.

> **Canonical host:** every canonical URL, `sitemap.xml` entry, and schema `url` in this guide uses the **apex** `https://wheelchairtaxipro.com`. Keep that consistent so you don't split ranking signals between `www` and apex.

### 6.7 Production vs preview (important for SEO)

- Deployments from the **production branch** (`main`) serve the custom domain and are **indexable**.
- Deployments from **other branches** are **preview** deployments; Cloudflare automatically sends `X-Robots-Tag: noindex`, so they won't compete in Google. See [Phase 10](#16-phase-10--preview--staging-seo-rules).

### 6.8 Alternative — manual deploy with Wrangler (no Git push)

Useful for a one-off public test before wiring CI:

```powershell
cd frontend
npm run build:kkleung
npx wrangler pages deploy dist/frontend/browser --project-name=wheelchairtaxipro --branch=main --commit-dirty=true
```

Requires a logged-in Wrangler and an existing Pages project. Full runbook: `docs/LearningNotes/deploying-an-angular-pwa-to-cloudflare-pages.md`.

### 6.9 After the domain is live

**Start SEO here:** follow [§0 How to start](#0-how-to-start-read-this-first) (Week 1 day-by-day).

Short version:

1. **Search Console** — verify `https://wheelchairtaxipro.com` (DNS TXT in Cloudflare is easiest) — see [§18.1](#181-google-search-console-setup-detailed).
2. Deploy **`robots.txt` + `sitemap.xml`** — see [Phase 9](#15-phase-9--static-files-robotstxt-sitemapxml).
3. Submit the sitemap and request indexing.
4. Claim **Google Business Profile** pointing at `https://wheelchairtaxipro.com/booking` — see [§13.1](#131-google-business-profile-gbp).
5. Then titles/meta + FAQ schema ([§14](#14-phase-8--angular-code-to-implement), [§9](#9-phase-3--structured-data-schemaorg-json-ld)).

---

## 7. Phase 1 — Technical foundation

These steps help **Google, Bing, and AI crawlers** read your site reliably.

**Foundation choice for this app:** prerendered static HTML at build time (not live per-request SSR). See [§3.1](#31-prerendering-static-html-at-build-time-for-seo--not-live-ssr) for why.

### 7.1 Keep prerender working

1. Every **public** route must stay in `frontend/src/app/app.routes.ts`.
2. After a production build, confirm prerendered HTML exists:

   ```powershell
   cd frontend
   npm run build:kkleung
   dir dist\frontend\browser\booking\index.html
   dir dist\frontend\browser\faq\index.html
   ```

3. **View source** on production `/faq` — FAQ text must appear **without** running JavaScript.

### 7.2 Custom domain & HTTPS

- Production: `https://wheelchairtaxipro.com` (and optionally `www`) — see [§6.6](#66-attach-wheelchairtaxiprocom-custom-domain) for the setup steps.
- All canonical URLs, sitemap entries, and schema `url` fields must use **HTTPS** and the **production host**.

### 7.3 Core Web Vitals

Target **Good** at p75 (see `docs/design/adr/0012-target-core-web-vitals-good-thresholds.md`):

| Metric | Target |
|--------|--------|
| LCP | ≤ 2.5 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0.1 |

**Practices for this app:**

- Keep **`/booking`** light — no third-party ad scripts on the form.
- Fixed heights for banners/images (reduce CLS).
- Monitor in **Search Console** → Experience → Core Web Vitals after launch.

### 7.4 Crawler / AI bot policy (`robots.txt`)

See [Phase 9](#15-phase-9--static-files-robotstxt-sitemapxml). For a **local service business** that wants AI answers to cite you, **allowing** search-related crawlers is usually better than blocking `GPTBot` / `Google-Extended`. Document your choice in a future privacy policy page.

---

## 8. Phase 2 — On-page SEO (every route)

### 8.1 Title and meta description pattern

Use **unique** `<title>` and `<meta name="description">` per route. Longer SEO titles belong in `SeoService` / route `data`, not only the short tab labels in `*.routes.ts`.

| Route | Suggested `<title>` (zh-Hant) | Meta description intent |
|-------|------------------------------|-------------------------|
| `/booking` | 輪椅的士預約 \| 輪的 · 香港 | 即時預約無障礙的士，電話／WhatsApp，上門接送 |
| `/pricing` | 輪椅的士收費及服務費 \| 輪的 | 咪錶車資 + 預約服務費 $100/$120/$150 說明 |
| `/faq` | 輪椅的士常見問題 \| 輪的 | 預約、收費、輪椅尺寸、服務範圍 FAQ |
| `/about` | 關於我們 \| 輪的 · 香港輪椅的士 | 公司簡介、服務承諾、聯絡方式 |
| `/route` | 輪椅的士路程及時間預覽 \| 輪的 | 查閱上車點至目的地大約路程 |

**Naming:** lead with search term **輪椅的士**; put trade name **輪的** after `|` as the brand. Do not lead titles with only `輪的 · …`.

**Rules:**

- One clear **H1** per page matching user intent (already present on most pages).
- **H2/H3** hierarchy — FAQ questions as H2/H3 under section H2s.
- Include **香港**, **輪椅的士**, **無障礙** naturally — not keyword stuffing.
- Phone/WhatsApp visible in HTML (contact strip — already good).

### 8.2 Canonical URLs

Each route emits **one** canonical URL. Avoid duplicate signals from `/map` vs `/route` or trailing slashes:

```html
<link rel="canonical" href="https://wheelchairtaxipro.com/booking" />
```

| URL | Canonical |
|-----|-----------|
| `/` | `https://wheelchairtaxipro.com/booking` (redirect target) |
| `/map` | `https://wheelchairtaxipro.com/route` (redirect target) |
| `/booking`, `/route`, etc. | Same path on production host |

### 8.3 Open Graph & Twitter cards

For Facebook / WhatsApp link previews:

```html
<meta property="og:title" content="輪椅的士預約 | 輪的 · 香港" />
<meta property="og:description" content="即時預約無障礙的士，電話／WhatsApp，上門接送。" />
<meta property="og:url" content="https://wheelchairtaxipro.com/booking" />
<meta property="og:image" content="https://wheelchairtaxipro.com/banner-header.png" />
<meta property="og:locale" content="zh_HK" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```

Set per route in `SeoService` on `NavigationEnd`. Prerender must include tags in the initial HTML for crawlers that do not re-run JS.

### 8.4 Images

- Meaningful `alt` on logo, banners, vehicle diagrams (About page logo already has alt text).
- Compress PNG/JPEG; optional WebP via build pipeline later.

### 8.5 Internal linking

Add a shared **`shared/ui/related-links/`** block on every public page:

```text
Booking ←→ Pricing ←→ FAQ ←→ About ←→ Route preview
```

Use descriptive anchor text:

- 「輪椅的士收費」→ `/pricing`
- 「常見問題」→ `/faq`
- 「立即預約」→ `/booking`

FAQ already links to `/booking` — extend the pattern site-wide.

---

## 9. Phase 3 — Structured data (Schema.org JSON-LD)

Structured data helps **Google rich results** (FAQ) and gives **AI systems** parseable facts (GEO/AEO).

### 9.1 Types to implement

| Schema type | Page | Purpose |
|-------------|------|---------|
| `TaxiService` / `LocalBusiness` | `/about`, `/booking` | Name, phone, area served |
| `FAQPage` | `/faq` | FAQ rich results + AEO |
| `Service` | `/pricing` | Service fees, vehicle types |
| `BreadcrumbList` | All public routes | Navigation context |
| `WebSite` | Global (optional) | Site entity; optional `SearchAction` |

**Do not** add `AggregateRating` / review schema until **real** reviews exist (`docs/design/11-risks-and-technical-debts.md`).

### 9.2 Example — `TaxiService`

Use **`CONTACT_MANIFEST_LINE.phone`** from the active operator build — do not hard-code if you ship multiple contact lines:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TaxiService",
  "name": "Wheelchair Taxi Pro",
  "alternateName": "專業輪椅的士",
  "url": "https://wheelchairtaxipro.com",
  "telephone": "+85296488582",
  "areaServed": { "@type": "City", "name": "Hong Kong" },
  "availableLanguage": ["zh-HK", "en"],
  "description": "香港輪椅的士預約及無障礙接送服務。"
}
</script>
```

For **`production-jameslo`** builds, regenerate or inject the James Lo phone from `contact.manifest.jameslo.ts`.

### 9.3 Example — `FAQPage`

**Mirror visible FAQ text exactly** — no hidden keyword stuffing.

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
        "text": "您可以透過網站上的預約表格進行預約，提交資料後我們會盡快與您聯絡確認行程安排。"
      }
    },
    {
      "@type": "Question",
      "name": "可以即日預約嗎？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "可以。如有空車及司機可安排，我們會盡力提供即日服務；建議提前預約以確保安排合適車輛。"
      }
    }
  ]
}
</script>
```

Include **all** FAQ Q/A pairs from `faq.html`, or generate JSON-LD from a shared data source to avoid drift.

### 9.4 Example — `BreadcrumbList`

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "預約", "item": "https://wheelchairtaxipro.com/booking" },
    { "@type": "ListItem", "position": 2, "name": "常見問題", "item": "https://wheelchairtaxipro.com/faq" }
  ]
}
```

### 9.5 Validation

After deploy, test with:

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)

---

## 10. Phase 4 — GEO content strategy

**Goal:** When someone asks ChatGPT, Perplexity, or Google AI Mode *「香港哪裡可以預約輪椅的士？」*, the model can **cite** `wheelchairtaxipro.com` with correct facts.

### 10.1 What helps GEO

| Practice | Why |
|----------|-----|
| **Unique, factual copy** | Models prefer citable sources with specific fees, steps, phone |
| **Prerendered HTML** | Many AI crawlers do not execute Angular fully |
| **Schema.org JSON-LD** | Machine-readable business facts |
| **Clear headings & short paragraphs** | Easy to extract answers |
| **Named entities** | 「Wheelchair Taxi Pro」「香港」「輪椅的士」|
| **Fresh pricing on `/pricing`** | AI answers stay accurate |
| **Authority signals** | GBP, backlinks, consistent NAP |
| **FAQ matching real questions** | Aligns with how people prompt AI |

### 10.2 Content checklist (per page)

**`/about`**

- [ ] One paragraph elevator pitch: who you are, service area, how to book.
- [ ] Years of experience / safety claims only if **verifiable**.
- [ ] Repeat phone/WhatsApp consistent with `contact.manifest.ts`.

**`/pricing`**

- [ ] Fees in **plain HTML** (already mostly true — keep as text, not images).
- [ ] Consider an HTML `<table>` summarizing vehicle type × service fee (helps snippets and AI).

**`/booking`**

- [ ] Short numbered steps visible in HTML: 1) 填表 2) WhatsApp 3) 確認.
- [ ] Fee notice visible without JS (already in template).

**`/faq`**

- [ ] Explicit yes/no on service boundaries: airports, hospitals, 24hr, cross-district.
- [ ] Wheelchair size limits if applicable.

**`/route`**

- [ ] Explain purpose: route preview before booking — not a live dispatch map.

### 10.3 Optional — `llms.txt`

Some sites add `/llms.txt` summarizing allowed pages for LLMs. **Optional** — not required by Google. If you add one, keep it factual and link to `/booking`, `/pricing`, `/faq`.

---

## 11. Phase 5 — AEO (FAQ & answer formatting)

**Goal:** Win **direct answers** — featured snippets, FAQ rich results, voice search, AI answer boxes.

### 11.1 FAQ structure (best AEO lever)

On `/faq`:

1. Question as **visible heading** (H3 under section H2 — current structure is good).
2. **Direct answer in the first sentence** (40–80 characters where possible).
3. Optional detail in following sentences.
4. Same Q/A in `FAQPage` JSON-LD.

**Example rewrite pattern:**

```text
### 輪椅的士預約費是多少？

預約服務費視乎車型另加 $100、$120 或 $150，車資以的士咪錶為準。
詳情請參閱收費頁面……
```

### 11.2 “People also ask” coverage

Ensure FAQ entries exist for:

- 點樣預約輪椅的士？
- 輪椅的士幾錢？
- 可唔可以去機場／醫院？
- 輪椅尺寸有限制嗎？
- 即日可以約嗎？
- 同普通嘅士有咩分別？

Cross-check against `initial-design/17-WheelchairTaxiPro_FAQ_v2.md` and visible `faq.html`.

### 11.3 Tables and lists

Pricing page: an HTML `<table>` for vehicle type × service fee often performs well in snippets.

### 11.4 Speakable schema

Low priority for Phase 1 — consider later for voice assistants.

---

## 12. Phase 6 — AI search surfaces

| Surface | What it is | What you optimize |
|---------|------------|-------------------|
| **Google AI Overviews** | AI summary in search | Strong SEO + schema + GSC health |
| **Google AI Mode** | Conversational search tab | Same as GEO — factual pages, FAQ, authority |
| **Bing Copilot** | Bing + LLM | Bing Webmaster Tools + on-page basics |
| **ChatGPT / Perplexity** | Third-party answer engines | Citations follow links + reputable sources |
| **Google Gemini** | May use Google index | Indexed prerender pages + GBP |

You **cannot fully control** whether AI quotes you. Maximize inclusion with **FAQ + LocalBusiness/TaxiService + consistent NAP + Search Console indexing**.

**Manual monitoring:** quarterly, ask AI tools HK wheelchair-taxi questions with HK geo context; note if your site is cited and whether facts match `/pricing`.

---

## 13. Phase 7 — Local & off-site signals (Hong Kong)

Wheelchair taxi discovery is heavily **local**.

### 13.1 Google Business Profile (GBP)

1. Claim/create profile: business name, service area, phone, hours, category (taxi / accessible transport as appropriate).
2. Website URL: `https://wheelchairtaxipro.com/booking`.
3. Match **exact** phone/WhatsApp with `contact.manifest.ts` for the live build.
4. Add photos (vehicles, logo).
5. Post occasional updates (pricing, holiday hours).
6. Reviews: ask satisfied customers **after** trips — only then consider review schema.

### 13.2 NAP consistency

**N**ame, **A**ddress, **P**hone must match across:

- Website About page
- GBP
- Facebook Page
- Any directories / hospital transport lists

### 13.3 Backlinks & partnerships

Per `initial-design/10-hosting_affiliate_strategy_for_wheelchair_taxi_pro_hong_kong.md`:

- Rehab centres, care homes, NGOs linking to `/faq` or `/booking`
- Community mentions
- Avoid paid link farms

### 13.4 Social (Facebook)

Facebook supports trust but is **not** the canonical landing page. Link to:

```text
https://wheelchairtaxipro.com/booking?utm_source=facebook&utm_medium=social&utm_campaign=page
```

(UTM tracking is optional until GA4 is live — the URL still works without analytics.)

---

## 14. Phase 8 — Angular code to implement

### 14.1 Files to create

| File | Purpose |
|------|---------|
| `frontend/src/app/core/services/seo.service.ts` | Titles, meta, canonical, OG tags |
| `frontend/src/app/core/models/seo.models.ts` | `RouteSeoConfig` interface |
| `frontend/src/app/shared/ui/json-ld/json-ld.ts` | Standalone component injecting JSON-LD |
| `frontend/src/app/shared/ui/related-links/related-links.ts` | Internal linking block |
| `frontend/public/robots.txt` | Crawler rules |
| `frontend/public/sitemap.xml` | URL list for GSC |

### 14.2 Files to change

| File | Change |
|------|--------|
| `app.config.ts` | Register router listener → `SeoService.updateFromRoute()` |
| `*.routes.ts` | Add `data: { seo: { ... } }` per route |
| `index.html` | Sensible default title/description only — per-route overrides via service |
| `about.html`, `faq.html`, `pricing.html`, `booking.html` | Add `<app-json-ld>` or inline schema |
| Each page template | Add `<app-related-links>` footer block |

### 14.3 Route SEO data pattern

Define SEO config on each feature route:

```typescript
// frontend/src/app/features/booking/booking.routes.ts
import { Routes } from '@angular/router';

export const bookingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./booking').then(m => m.Booking),
    title: '輪椅的士預約 | 輪的 · 香港',
    data: {
      seo: {
        description:
          '即時預約香港輪椅的士及無障礙接送，填寫表格後以 WhatsApp 確認，電話及 WhatsApp 聯絡。',
        canonicalPath: '/booking',
        ogImage: '/banner-header.png',
      },
    },
  },
];
```

Repeat for `/pricing`, `/faq`, `/about`, `/route` with values from [§8.1](#81-title-and-meta-description-pattern).

### 14.4 `SeoService` (reference implementation)

```typescript
// frontend/src/app/core/models/seo.models.ts
export interface RouteSeoConfig {
  readonly description: string;
  readonly canonicalPath: string;
  readonly ogImage?: string;
  readonly ogType?: string;
  readonly noindex?: boolean;
}
```

```typescript
// frontend/src/app/core/services/seo.service.ts
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import type { RouteSeoConfig } from '../models/seo.models';

const SITE_ORIGIN = 'https://wheelchairtaxipro.com';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);

  /** Call once from app bootstrap (e.g. APP_INITIALIZER or root component constructor). */
  listenForRouteChanges(): void {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.applyFromActivatedRoute());
  }

  applyFromActivatedRoute(): void {
    const root = this.router.routerState.snapshot.root;
    const { seo, title } = this.findSeoData(root);
    if (!seo) {
      return;
    }
    const pageTitle =
      typeof title === 'string'
        ? title
        : this.title.getTitle();
    this.apply(pageTitle, seo);
  }

  apply(pageTitle: string, seo: RouteSeoConfig): void {
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: seo.description });

    const canonical = `${SITE_ORIGIN}${seo.canonicalPath}`;
    this.setLinkTag('canonical', canonical);

    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:type', content: seo.ogType ?? 'website' });
    this.meta.updateTag({ property: 'og:locale', content: 'zh_HK' });
    this.meta.updateTag({
      property: 'og:image',
      content: `${SITE_ORIGIN}${seo.ogImage ?? '/banner-header.png'}`,
    });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    if (seo.noindex) {
      this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    } else {
      this.meta.removeTag('name="robots"');
    }
  }

  private findSeoData(route: ActivatedRouteSnapshot): {
    seo?: RouteSeoConfig;
    title?: string;
  } {
    let seo = route.data['seo'] as RouteSeoConfig | undefined;
    let title = route.title;
    for (const child of route.children) {
      const nested = this.findSeoData(child);
      if (nested.seo) {
        seo = nested.seo;
      }
      if (nested.title) {
        title = nested.title;
      }
    }
    return { seo, title: title ?? undefined };
  }

  private setLinkTag(rel: string, href: string): void {
    const selector = `link[rel="${rel}"]`;
    const existing = document.querySelector(selector);
    if (existing) {
      existing.setAttribute('href', href);
      return;
    }
    const link = document.createElement('link');
    link.setAttribute('rel', rel);
    link.setAttribute('href', href);
    document.head.appendChild(link);
  }
}
```

**Wire-up in root component** (`app.ts`):

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { SeoService } from './core/services/seo.service';

export class App implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.listenForRouteChanges();
    this.seo.applyFromActivatedRoute(); // first load
  }
}
```

**Prerender note:** For tags to appear in **view source**, also set defaults in templates or use Angular SSR `Meta` during server render. The service above covers client navigations; verify prerender output after implementation.

### 14.5 `JsonLdComponent` (reference)

```typescript
// frontend/src/app/shared/ui/json-ld/json-ld.ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-json-ld',
  template: `<script type="application/ld+json">${'{'}}{{ schema() | json }}${'}'}</script>`,
})
export class JsonLd {
  readonly schema = input.required<Record<string, unknown>>();
}
```

Usage in `faq.html`:

```html
<app-json-ld [schema]="faqSchema" />
```

Build `faqSchema` in `faq.ts` from the same Q/A content, or maintain a shared `faq.schema.ts` exported constant.

### 14.6 `RelatedLinksComponent` (sketch)

Render on every public page:

```html
<nav class="related-links" aria-label="相關頁面">
  <a routerLink="/booking">輪椅的士預約</a>
  <a routerLink="/pricing">收費</a>
  <a routerLink="/faq">常見問題</a>
  <a routerLink="/about">關於我們</a>
  <a routerLink="/route">路程預覽</a>
</nav>
```

---

## 15. Phase 9 — Static files (`robots.txt`, `sitemap.xml`)

**This is the highest-ROI technical SEO task after the domain is live.** Do it in Week 1 ([§0.2](#02-what-to-do-this-week-start-here)) before building `SeoService`.

Files go in **`frontend/public/`** so Angular copies them into `dist/frontend/browser/` on every build. After deploy, confirm:

- https://wheelchairtaxipro.com/robots.txt  
- https://wheelchairtaxipro.com/sitemap.xml  

### 15.1 `frontend/public/robots.txt`

```text
User-agent: *
Allow: /

# Optional: explicit AI crawlers (policy choice — see §7.4)
# User-agent: GPTBot
# Allow: /
# User-agent: Google-Extended
# Allow: /

Sitemap: https://wheelchairtaxipro.com/sitemap.xml
```

Files in `frontend/public/` copy to the build root on deploy.

### 15.2 `frontend/public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://wheelchairtaxipro.com/booking</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://wheelchairtaxipro.com/route</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://wheelchairtaxipro.com/pricing</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://wheelchairtaxipro.com/faq</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://wheelchairtaxipro.com/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

Update `<lastmod>` when you change content. Later, add `frontend/scripts/generate-sitemap.mjs` run at `prebuild` to inject dates automatically.

### 15.3 Submit in Search Console

After deploy: **Sitemaps** → add `https://wheelchairtaxipro.com/sitemap.xml` → confirm “Success”.

---

## 16. Phase 10 — Preview / staging SEO rules

Preview URLs (`*.pages.dev`) should **not** compete with production in Google.

Options (pick one):

1. **`robots.txt` on preview** — `Disallow: /` via Cloudflare Pages preview-specific config, or
2. **`noindex`** meta on non-production builds via `SeoService` + environment flag, or
3. **Password-protect** preview deployments.

See `docs/LearningNotes/cloudflare-pages-multi-operator.md` §1.

---

## 17. Phase 11 — English mirror & `hreflang` (later)

When `/en/...` ships (`app.routes.ts` scaffold):

- Separate titles/descriptions per language
- `hreflang` pairs: `zh-Hant` ↔ `en` on each page pair
- Same Schema.org entities with `inLanguage`
- Add English URLs to `sitemap.xml`

---

## 18. Measurement & verification

### 18.1 Google Search Console setup (detailed)

**Goal:** prove you own `https://wheelchairtaxipro.com`, then submit a sitemap and request indexing.

#### A. Create the property

1. Open [Google Search Console](https://search.google.com/search-console) with a Google account you control long-term (prefer the business mailbox if you have one).
2. Click **Add property**.
3. Choose **URL prefix** (simpler for one site):
   ```text
   https://wheelchairtaxipro.com
   ```
   Do **not** use `http://` or `www` if your canonical host is the apex HTTPS URL.
4. Click **Continue**.

#### B. Verify ownership (DNS TXT — recommended on Cloudflare)

1. GSC shows a **TXT** record (name often `@` or blank; value starts with `google-site-verification=…`).
2. Cloudflare dashboard → **Domains** → **`wheelchairtaxipro.com`** → **DNS** → **Records** → **Add record**:
   - **Type:** TXT  
   - **Name:** `@` (or exactly what GSC shows)  
   - **Content:** paste the full verification string from GSC  
   - **TTL:** Auto  
3. Save. Wait 1–5 minutes (sometimes longer).
4. Back in GSC → **Verify**.
5. If verification fails: wait longer, confirm no typo, and that you are on the same Cloudflare account that owns the zone.

**Alternative:** HTML meta tag verification works but requires a code deploy; DNS is better for a SPA/PWA.

#### C. After verification

1. **Sitemaps** → enter `sitemap.xml` (or full URL `https://wheelchairtaxipro.com/sitemap.xml`) → **Submit**.
2. **URL Inspection** → paste each important URL → **Request indexing**:
   - `/booking`
   - `/faq`
   - `/pricing`
   - `/about`
3. Bookmark **Performance** and **Pages** (indexing) — check weekly for the first month.

#### D. What “success” looks like in the first 2 weeks

| Signal | Expectation |
|--------|-------------|
| Property verified | Immediate after DNS works |
| Sitemap “Success” | Hours to a few days |
| Pages indexed | Often several days; `site:wheelchairtaxipro.com` may stay empty at first — normal |
| Impressions in Performance | Can take 1–4 weeks for a new site |

Do **not** re-request indexing every hour — it does not speed Google up and can look spammy.

### 18.2 Bing Webmaster Tools

1. Import from GSC or verify separately.
2. Submit the same sitemap.

### 18.3 Manual checks

| Check | Tool / method |
|-------|----------------|
| Indexed? | `site:wheelchairtaxipro.com` on Google |
| Rich results | Rich Results Test on `/faq` |
| Mobile | Search Console Mobile Usability |
| Speed | PageSpeed Insights, Lighthouse |
| AI citation | Prompt AI tools with HK wheelchair-taxi questions |
| Prerender | View source on `/faq` — full text without JS |
| Canonical | View source — one canonical per route |
| Social preview | Share debugger / WhatsApp link preview |

### 18.4 KPIs (first 90 days)

- GSC impressions/clicks for「輪椅的士」「wheelchair taxi hong kong」
- Average position trend (not absolute rank)
- Indexed page count ≥ 5 public routes
- FAQ rich result eligibility (Rich Results Test)
- Core Web Vitals “Good” on `/booking`
- Optional after GA4: organic sessions vs direct/referral

---

## 19. Suggested order of work

**Confused where to begin?** Use [§0 How to start](#0-how-to-start-read-this-first) first (Week 1 day-by-day). This table is the full roadmap after that.

This order prioritizes **discoverability before analytics**. Adjust if you are already running paid ads (then add GA4 sooner — see advertisement guide Part 6).

| Order | Task | Effort | Section |
|-------|------|--------|---------|
| 0 | **Read §0 — How to start** | — | §0 |
| 1 | **Deploy + connect `wheelchairtaxipro.com`** (if not done) | Small–medium | §6, [doc 20](./20-first-go-live.md) |
| 2 | Confirm prerender HTML for all routes | Small | §7.1 |
| 3 | Add `robots.txt` + `sitemap.xml` | Small | §15 |
| 4 | Verify **Google Search Console** + submit sitemap + request indexing | Small | §18.1 |
| 5 | Claim **Google Business Profile** (website = `/booking`) | Config | §13.1 |
| 6 | Implement **`SeoService`** + route `data.seo` (titles/descriptions) | Medium | §14 |
| 7 | H1/H2 audit on booking, pricing, faq, about | Small | §8 |
| 8 | **`FAQPage` + `TaxiService` JSON-LD** | Medium | §9, §14.5 |
| 9 | **`related-links`** internal linking | Small | §8.5 |
| 10 | GEO content pass (pricing table, booking steps, FAQ direct answers) | Content | §10–§11 |
| 11 | Bing Webmaster Tools | Small | §18.2 |
| 12 | English `/en/` + `hreflang` | Medium | §17 |
| 13 | GA4 (optional, for funnel measurement) | Medium | advertisement guide Part 6 |

### 19.1 Week 1 sprint (copy this into a todo list)

- [ ] View-source `/faq` on production — full HTML text present
- [ ] Search Console property verified (`https://wheelchairtaxipro.com`)
- [ ] `robots.txt` and `sitemap.xml` live and submitted
- [ ] Indexing requested for `/booking`, `/faq`, `/pricing`, `/about`
- [ ] Google Business Profile claimed; website = booking URL
- [ ] Unique `<title>` + meta description on five public routes (deployed)
- [ ] FAQ JSON-LD passes Rich Results Test (or scheduled for Day 5–7)

---

## 20. Master checklist

### Deployment

- [ ] Cloudflare Pages project builds from `main` (root `frontend`, output `dist/frontend/browser`)
- [ ] `GOOGLE_MAPS_API_KEY` + `NODE_VERSION=22` set in Pages
- [ ] `wheelchairtaxipro.com` custom domain active with SSL
- [ ] `www` → apex 301 redirect in place
- [ ] Production serves on the apex; previews are `noindex`

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

- [ ] `TaxiService` / `LocalBusiness` on About or Booking
- [ ] `FAQPage` matches visible FAQ
- [ ] `Service` / pricing facts on Pricing page
- [ ] `BreadcrumbList` on inner pages
- [ ] No fake review schema

### GEO & AI

- [ ] Factual, citable paragraphs (fees, steps, area, contact)
- [ ] FAQ answers: first sentence = direct answer
- [ ] Pricing in HTML (table recommended)
- [ ] AI crawler policy decided and documented

### Off-site

- [ ] Google Business Profile claimed and matches site
- [ ] Facebook page links to `/booking`
- [ ] Bing Webmaster Tools configured

### Measurement

- [ ] Search Console verified
- [ ] Sitemap status OK
- [ ] Quarterly AI citation spot-check
- [ ] Optional: GA4 organic channel (after analytics phase)

---

## 21. Related docs

| Doc | Topic |
|-----|--------|
| [`20-first-go-live.md`](./20-first-go-live.md) | Deploy Pages, custom domain, name-card QR + UTM |
| `frontend/ARCHITECTURE.md` §7 | Prerender & schema rules |
| `docs/LearningNotes/deploying-an-angular-pwa-to-cloudflare-pages.md` | Full deploy runbook (Pages, custom domain, previews) |
| `docs/LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md` | Why prerender on Cloudflare |
| `docs/LearningNotes/cloudflare-pages-multi-operator.md` §1 | Preview vs production SEO |
| `initial-design/13-1-Frontend-phase1.md` §3.2 | Phase 1 SEO scope |
| `initial-design/17-WheelchairTaxiPro_FAQ_v2.md` | FAQ source content |
| `initial-design/18 - advertisement-and-tracking-instructions.md` | GA4 / ads (after SEO) |
| `docs/design/08-cross-cutting-concepts.zh-HK.md` | Cross-cutting SEO/GEO/AEO |
| `docs/design/adr/0012-target-core-web-vitals-good-thresholds.md` | CWV targets |

---

*Last updated: July 2026 — added §0 How to start; domain live on Cloudflare Pages; `/` → `/booking` landing and `/route` map URL.*
