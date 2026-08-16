# 20 — First go-live: Cloudflare Pages + `wheelchairtaxipro.com` + QR tracking

**Goal of this document:** take the Angular frontend live on Cloudflare Pages with **K. K. Leung** phone / WhatsApp, attach the custom domain **`wheelchairtaxipro.com`**, then put a **QR code on the name card** whose URL includes **tracking query parameters** (`utm_campaign=name-card`) so you can tell name-card scans apart from typed / bookmarked visits.

**Audience:** you (operator / developer) doing the first production cutover.

**Related docs (do not duplicate everything here):**

| Doc | Use when |
|-----|----------|
| [`frontend/README.md`](../frontend/README.md) | Local build / Wrangler one-liners |
| [`docs/LearningNotes/deploying-an-angular-pwa-to-cloudflare-pages.md`](../docs/LearningNotes/deploying-an-angular-pwa-to-cloudflare-pages.md) | Full Pages + monorepo deep dive |
| [`docs/LearningNotes/cloudflare-pages-multi-operator.md`](../docs/LearningNotes/cloudflare-pages-multi-operator.md) | K.K. Leung vs James Lo builds |
| [`initial-design/18 - advertisement-and-tracking-instructions.md`](./18%20-%20advertisement-and-tracking-instructions.md) §2.1a | UTM / QR / GA4 attribution detail |

## Table of contents

- [0. Do we understand what you need?](#0-do-we-understand-what-you-need)
  - [Do we have enough information?](#do-we-have-enough-information)
- [1. Recommended architecture for first go-live](#1-recommended-architecture-for-first-go-live)
- [2. Pre-flight checklist (before deploy)](#2-pre-flight-checklist-before-deploy)
- [3. Build locally with K. K. Leung contact (verify before upload)](#3-build-locally-with-k-k-leung-contact-verify-before-upload)
  - [Confirm the phone number is in the build](#confirm-the-phone-number-is-in-the-build)
  - [Confirm output folder](#confirm-output-folder)
- [4. Deploy to Cloudflare Pages (Wrangler — fastest first go-live)](#4-deploy-to-cloudflare-pages-wrangler--fastest-first-go-live)
  - [4.1 One-time login](#41-one-time-login)
  - [4.2 Create the Pages project (first time only)](#42-create-the-pages-project-first-time-only)
  - [4.3 Deploy the kkleung build](#43-deploy-the-kkleung-build)
  - [4.4 Smoke-test on `*.pages.dev` before attaching the custom domain](#44-smoke-test-on-pagesdev-before-attaching-the-custom-domain)
  - [4.5 If Maps is blank on Pages but works locally](#45-if-maps-is-blank-on-pages-but-works-locally)
- [5. Link `wheelchairtaxipro.com` to the Pages project](#5-link-wheelchairtaxiprocom-to-the-pages-project)
  - [5.1 Add custom domain in Pages](#51-add-custom-domain-in-pages)
  - [5.2 Also add `www` (recommended)](#52-also-add-www-recommended)
  - [5.3 SSL](#53-ssl)
  - [5.4 If the custom domain shows the wrong site or 404](#54-if-the-custom-domain-shows-the-wrong-site-or-404)
- [6. Optional: Git-connected builds (after first Wrangler go-live)](#6-optional-git-connected-builds-after-first-wrangler-go-live)
- [7. QR code + tracking — yes, use a query string](#7-qr-code--tracking--yes-use-a-query-string)
  - [7.1 Short answer](#71-short-answer)
  - [7.2 Recommended UTM scheme for this business](#72-recommended-utm-scheme-for-this-business)
  - [7.3 Ready-to-use QR destination URLs](#73-ready-to-use-qr-destination-urls)
  - [7.4 What you do **not** need in the QR URL (for day 1)](#74-what-you-do-not-need-in-the-qr-url-for-day-1)
  - [7.5 Generate the QR image](#75-generate-the-qr-image)
  - [7.6 Optional: short link in front of the long UTM URL](#76-optional-short-link-in-front-of-the-long-utm-url)
  - [7.7 Seeing the tracking (analytics)](#77-seeing-the-tracking-analytics)
- [8. Post-deploy verification checklist](#8-post-deploy-verification-checklist)
  - [Stale service worker (PWA)](#stale-service-worker-pwa)
- [9. Suggested order of work (one afternoon)](#9-suggested-order-of-work-one-afternoon)
- [10. Rollback](#10-rollback)
- [11. Master checklist (print this)](#11-master-checklist-print-this)
  - [Build & contact](#build--contact)
  - [Hosting & domain](#hosting--domain)
  - [QR & tracking](#qr--tracking)
- [12. Quick reference commands](#12-quick-reference-commands)
- [13. Summary](#13-summary)

---

## 0. Do we understand what you need?

| Your need | Answer in this guide |
|-----------|----------------------|
| Build frontend on Cloudflare Pages | Yes — Wrangler deploy (fastest first go-live) **and** optional Git-connected builds |
| K. K. Leung phone + WhatsApp | Yes — use **`npm run build:kkleung`** (bakes `+85296488582` / `wa.me/85296488582`) |
| Link domain `wheelchairtaxipro.com` | Yes — domain is already **Active** in your Cloudflare account; attach it as a **Pages custom domain** |
| QR code for easy access | Yes — generate QR from a **full HTTPS URL** (not bare domain only) |
| Tracking in that URL | Yes — **add a query string** with **UTM parameters** (recommended). Without UTMs, QR scans usually look like **Direct** in analytics |

### Do we have enough information?

**Yes, enough to go live**, based on:

- Domain **`wheelchairtaxipro.com`** is already on Cloudflare (Active, Free plan) under your account.
- Contact line for K.K. Leung is already in `frontend/src/app/shared/config/contact.manifest.ts`.
- Pages project name used in this repo: **`wheelchairtaxipro`** → `https://wheelchairtaxipro.pages.dev`.
- Maps key is injected at **build time** via `GOOGLE_MAPS_API_KEY` (local `.env.local` or Pages env var).

**You still need these secrets / accounts ready (not stored in git):**

| Item | Why |
|------|-----|
| Cloudflare login that owns `wheelchairtaxipro.com` | Deploy + custom domain |
| `GOOGLE_MAPS_API_KEY` | Map + booking place search on production |
| (Optional) GA4 Measurement ID | See QR traffic in a dashboard later |
| Name-card printer / designer | Physical QR on business cards |

---

## 1. Recommended architecture for first go-live

```text
Phone camera / name-card QR
        │
        ▼
https://wheelchairtaxipro.com/booking?utm_source=qr&utm_medium=offline&utm_campaign=name-card
        │
        ▼
Cloudflare DNS (zone: wheelchairtaxipro.com)  ──custom domain──►  Cloudflare Pages
                                                                      │
                                                                      ▼
                                                         Static build from
                                                         npm run build:kkleung
                                                         (phone + WhatsApp baked in)
```

**Why `/booking` as the QR landing page?**  
The site already redirects `/` → `/booking`. Landing on `/booking` puts the form in front of the user immediately and matches ad/QR guidance in Part 18.

**Why K.K. Leung build?**

| Build command | Phone | WhatsApp |
|---------------|-------|----------|
| `npm run build:kkleung` (or default `npm run build`) | `+85296488582` | `85296488582` |
| `npm run build:jameslo` | empty placeholder | empty |

For **`wheelchairtaxipro.com`**, always deploy the **kkleung** build.

---

## 2. Pre-flight checklist (before deploy)

- [ ] Local app works: `cd frontend` → `npm start` → booking, map, Call, WhatsApp.
- [ ] `frontend/.env.local` has `GOOGLE_MAPS_API_KEY=...` (no quotes).
- [ ] Production Maps key **HTTP referrer** allowlist includes at least:
  - `https://wheelchairtaxipro.com/*`
  - `https://www.wheelchairtaxipro.com/*` (if you use www)
  - `https://wheelchairtaxipro.pages.dev/*`
  - `https://*.wheelchairtaxipro.pages.dev/*` (preview / branch aliases)
- [ ] Cloudflare: domain **wheelchairtaxipro.com** shows **Active**.
- [ ] Decide deploy path for day 1:
  - **A — Wrangler CLI** (recommended for first go-live; minutes)
  - **B — Connect Git** (better for ongoing deploys; more setup)

---

## 3. Build locally with K. K. Leung contact (verify before upload)

From PowerShell:

```powershell
cd C:\Users\harry\MyWorks\git-wheelchairtaxipro1\frontend

# Optional clean
Remove-Item -Recurse -Force dist, .angular -ErrorAction SilentlyContinue

npm ci
npm run build:kkleung
```

### Confirm the phone number is in the build

```powershell
Select-String -Path "dist\frontend\browser\*.js" -Pattern "96488582" -SimpleMatch | Select-Object -First 5
```

You should see matches. If not, you built the wrong configuration (e.g. jameslo) or an old `dist/`.

### Confirm output folder

Upload / deploy this folder only:

```text
frontend/dist/frontend/browser/
```

That folder must contain `index.html`, route folders (`booking/`, `about/`, …), JS, and `ngsw-worker.js`.

---

## 4. Deploy to Cloudflare Pages (Wrangler — fastest first go-live)

### 4.1 One-time login

```powershell
cd C:\Users\harry\MyWorks\git-wheelchairtaxipro1\frontend
npx wrangler login
```

Log in with the Cloudflare account that owns **`wheelchairtaxipro.com`** (the account in your Domains Overview). Click **Allow**.

### 4.2 Create the Pages project (first time only)

If project **`wheelchairtaxipro`** does **not** exist yet:

1. Cloudflare dashboard → left sidebar **Compute** (or **Workers & Pages**) → **Workers & Pages** / **Pages**.
2. **Create** → **Pages** → **Upload assets** *or* create empty project named **`wheelchairtaxipro`**.
3. Or let the first `wrangler pages deploy` create it when prompted.

> **UI tip:** In the new Cloudflare sidebar, Pages often lives under **Build → Compute → Workers & Pages**, not under Domains. Domains Overview only shows DNS zones (you already have `wheelchairtaxipro.com` there).

### 4.3 Deploy the kkleung build

```powershell
cd C:\Users\harry\MyWorks\git-wheelchairtaxipro1\frontend
npm run build:kkleung
npx wrangler pages deploy dist/frontend/browser --project-name=wheelchairtaxipro --branch=main --commit-dirty=true
```

Wrangler prints:

- A unique preview URL (hash), e.g. `https://xxxxxxxx.wheelchairtaxipro.pages.dev`
- Production alias: **`https://wheelchairtaxipro.pages.dev`**

### 4.4 Smoke-test on `*.pages.dev` before attaching the custom domain

Open in an **Incognito** window (avoids stale service worker):

1. `https://wheelchairtaxipro.pages.dev/booking`
2. Check contact strip: **電話** → `tel:+85296488582`, **WhatsApp** → `wa.me/85296488582`
3. Open **路線** / map — Places autocomplete should work if the Maps key referrers include `*.pages.dev`
4. About / FAQ / Pricing load

Only after this passes, attach the custom domain.

### 4.5 If Maps is blank on Pages but works locally

Pages builds need the key in the **build environment**, not only in your laptop `.env.local`.

1. Pages project **`wheelchairtaxipro`** → **Settings** → **Environment variables**
2. Add **`GOOGLE_MAPS_API_KEY`** = your production key, scope **Production**
3. Rebuild / redeploy (Wrangler local build already baked the key from `.env.local` — if you used Wrangler from a machine that had `.env.local`, maps may already work; Git builds **must** have the Pages env var)

---

## 5. Link `wheelchairtaxipro.com` to the Pages project

Your domain is already **Active** in Cloudflare DNS. You still must **attach it to the Pages project** so HTTPS traffic serves the Angular app (not an empty / parked zone).

### 5.1 Add custom domain in Pages

1. Cloudflare dashboard → **Workers & Pages** → project **`wheelchairtaxipro`**
2. Open **Custom domains** (sometimes under **Custom domains** / **Domains**)
3. **Set up a domain** / **Add**
4. Enter: **`wheelchairtaxipro.com`**
5. Continue → **Activate**

Cloudflare will create / verify the DNS record that points the apex to Pages (often a CNAME flattening / `pages.dev` target). Wait until status is **Active**.

### 5.2 Also add `www` (recommended)

1. Add custom domain **`www.wheelchairtaxipro.com`** to the same Pages project.
2. Redirect **www → apex** (or apex → www — pick one canonical):

**Simple option — Bulk Redirects (free):**

| Source | Target | Status |
|--------|--------|--------|
| `https://www.wheelchairtaxipro.com/*` | `https://wheelchairtaxipro.com/$1` | 301 |

Or use **Rules → Redirect Rules**.

### 5.3 SSL

Universal SSL is automatic on Cloudflare. Wait until the custom domain shows a valid certificate (usually minutes). Test:

```text
https://wheelchairtaxipro.com/booking
```

Padlock should be valid; page should be the booking form with K.K. Leung contacts.

### 5.4 If the custom domain shows the wrong site or 404

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Domain Active but blank / “Hello world” | Domain not attached to Pages | Complete §5.1 |
| Old site / wrong content | DNS still pointing elsewhere | Pages custom domain should own the record |
| `pages.dev` works, custom domain fails | DNS / SSL still provisioning | Wait 5–30 min; check Custom domains status |
| Infinite reload / flash | Stale PWA service worker | Incognito, or unregister SW (§8) |

---

## 6. Optional: Git-connected builds (after first Wrangler go-live)

Use this when you want every push to rebuild automatically.

| Setting | Value |
|---------|-------|
| Repo | `WheelChairTaxiPro/git-wheelchairtaxipro1` (or your fork) |
| Production branch | `main` (or whatever you treat as production) |
| Root directory | `frontend` |
| Build command | `npm ci && npm run build:kkleung` |
| Build output directory | `dist/frontend/browser` |
| Env | `NODE_VERSION=22`, `GOOGLE_MAPS_API_KEY` (Production) |

Full walkthrough: [`docs/LearningNotes/deploying-an-angular-pwa-to-cloudflare-pages.md`](../docs/LearningNotes/deploying-an-angular-pwa-to-cloudflare-pages.md).

**Important:** Git builds **must** have `GOOGLE_MAPS_API_KEY` in Pages env vars. Wrangler deploys from your PC bake whatever was in `.env.local` at build time.

---

## 7. QR code + tracking — yes, use a query string

### 7.1 Short answer

**Yes — put tracking in the QR destination URL as a query string (UTM parameters).**

A QR code is just a URL. If you encode only:

```text
https://wheelchairtaxipro.com/booking
```

then when someone scans it, the browser opens with **no referrer**. Analytics (GA4, etc.) usually classifies that as **Direct** — same as typing the address. You **cannot** tell “name card QR” from “typed URL”.

If you encode:

```text
https://wheelchairtaxipro.com/booking?utm_source=qr&utm_medium=offline&utm_campaign=name-card
```

then tools that read UTMs can attribute the visit to **QR / offline / name-card**.

### 7.2 Recommended UTM scheme for this business

| Parameter | Meaning | Suggested values |
|-----------|---------|------------------|
| `utm_source` | Where the scan came from | Always `qr` for printed QR |
| `utm_medium` | Channel type | `offline` (name card, sticker, flyer) |
| `utm_campaign` | Which physical asset | **`name-card`** (this go-live), then later `taxi-door`, `clinic-flyer`, … |
| `utm_content` (optional) | Variant A/B | `v1`, `v2` (e.g. different card layouts) |
| `utm_term` | Usually for paid search | Leave empty for QR |

### 7.3 Ready-to-use QR destination URLs

**Primary for this go-live — name card (use this URL in the QR generator):**

```text
https://wheelchairtaxipro.com/booking?utm_source=qr&utm_medium=offline&utm_campaign=name-card
```

Print this QR on the **business / name card**. When someone scans it, analytics can show campaign = `name-card`.

**Later campaigns (optional — different QR image each):**

```text
# Vehicle door sticker
https://wheelchairtaxipro.com/booking?utm_source=qr&utm_medium=offline&utm_campaign=taxi-door

# Clinic / hospital flyer (change campaign per location)
https://wheelchairtaxipro.com/booking?utm_source=qr&utm_medium=offline&utm_campaign=clinic-flyer
```

**Rule:** one physical campaign → one `utm_campaign` value → one QR image. Do **not** reuse the name-card QR URL on a taxi sticker if you want to compare which asset works.

### 7.4 What you do **not** need in the QR URL (for day 1)

| Parameter | Needed in QR? | Why |
|-----------|---------------|-----|
| `gclid` | No | Google Ads auto-tagging adds this on ad clicks, not QR |
| Random session IDs | No | Creates noisy unique URLs; hurts caching / sharing |
| Phone number in query | No | Phone is already in the **built app** (kkleung) |

### 7.5 Generate the QR image

1. Pick **one** full URL from §7.3 (including `https://` and the query string).
2. Use any reputable QR generator, e.g.:
   - [https://www.qr-code-generator.com/](https://www.qr-code-generator.com/)
   - [https://goqr.me/](https://goqr.me/)
   - Google Chart / offline tools / Canva
3. Paste the **entire** URL (not only `wheelchairtaxipro.com`).
4. Download **PNG** or **SVG** (SVG scales better for print).
5. Print test: scan with your phone **before** ordering the name-card print run.
6. Confirm the opened URL in the browser address bar still shows the `utm_…` parameters (including `utm_campaign=name-card`).

### 7.6 Optional: short link in front of the long UTM URL

Printed QR codes work fine with long query strings. If you want a shorter printed URL later:

```text
https://go.wheelchairtaxipro.com/door  →  302 →  https://wheelchairtaxipro.com/booking?utm_source=qr&...
```

The **redirect target** must still carry UTMs. Day-1 recommendation: **skip short links**; encode the full UTM URL in the QR.

### 7.7 Seeing the tracking (analytics)

| Stage | What works |
|-------|------------|
| **Day 1 (no GA4 yet)** | UTMs are still in the URL — useful for support (“came from name card?”) and ready for GA4 later |
| **When GA4 is installed** | Reports → Traffic acquisition → filter `sessionSource = qr` / campaign = `name-card` |
| **App code later** | Persist UTMs in `localStorage` on first load (see Part 18 §2 Step 4) so Call / WhatsApp conversions keep the QR campaign |

**First go-live minimum:** put UTMs in the name-card QR URL even if GA4 is not live yet. Adding GA4 later will start reading them; you do not need to reprint cards if the URL was tagged from day one.

---

## 8. Post-deploy verification checklist

Do these in **Incognito** on `https://wheelchairtaxipro.com`:

- [ ] `/booking` loads (form visible)
- [ ] `/pricing`, `/faq`, `/about`, `/route` load
- [ ] 電話 link is `tel:+85296488582`
- [ ] WhatsApp opens chat to `85296488582` (or WhatsApp Web with that number)
- [ ] Map / address autocomplete works
- [ ] QR test URL opens booking **and** address bar shows `utm_source=qr&…`
- [ ] `www` redirects to apex (if configured)
- [ ] HTTP → HTTPS redirect works

### Stale service worker (PWA)

If an old visit shows wrong content:

1. DevTools → **Application** → **Service Workers** → **Unregister**
2. **Storage** → **Clear site data**
3. Hard reload  

Or always verify deploys in Incognito first.

---

## 9. Suggested order of work (one afternoon)

| Step | Action | Done when |
|------|--------|-----------|
| 1 | `npm run build:kkleung` + grep `96488582` | Number in `dist` |
| 2 | `wrangler pages deploy … --branch=main` | `*.pages.dev` works |
| 3 | Smoke-test Call / WhatsApp / map on `pages.dev` | Pass |
| 4 | Pages → Custom domains → `wheelchairtaxipro.com` (+ www) | Domain Active on Pages |
| 5 | Smoke-test on custom domain | Pass |
| 6 | Create name-card QR from UTM URL (§7.3) | Phone scan opens tagged URL |
| 7 | (Later) GA4 + UTM persistence in Angular | Reports show `qr` / `name-card` |

---

## 10. Rollback

Cloudflare Pages keeps deployments:

1. Project → **Deployments**
2. Find last good deploy → **⋯** → **Rollback to this deployment** (or promote)

DNS for the custom domain stays; only the served build changes.

---

## 11. Master checklist (print this)

### Build & contact

- [ ] Deployed with **`build:kkleung`** (not jameslo)
- [ ] Live site Call = `+85296488582`
- [ ] Live site WhatsApp = `85296488582`

### Hosting & domain

- [ ] Pages project `wheelchairtaxipro` has latest deploy
- [ ] `https://wheelchairtaxipro.pages.dev/booking` OK
- [ ] Custom domain `wheelchairtaxipro.com` attached and Active
- [ ] `https://wheelchairtaxipro.com/booking` OK (HTTPS)
- [ ] Maps key referrers include production hostnames

### QR & tracking

- [ ] QR encodes **full** URL including `https://` and **UTM query string**
- [ ] Primary campaign is **name card**: `utm_campaign=name-card`
- [ ] Name-card print scanned and verified once
- [ ] (Optional later) GA4 live; QR sessions visible as source `qr` / campaign `name-card`

---

## 12. Quick reference commands

```powershell
cd C:\Users\harry\MyWorks\git-wheelchairtaxipro1\frontend

# Build (K.K. Leung)
npm run build:kkleung

# Deploy production alias
npx wrangler pages deploy dist/frontend/browser --project-name=wheelchairtaxipro --branch=main --commit-dirty=true

# First-time auth
npx wrangler login
```

**Primary QR URL for name card (copy into QR generator):**

```text
https://wheelchairtaxipro.com/booking?utm_source=qr&utm_medium=offline&utm_campaign=name-card
```

---

## 13. Summary

1. **Build** with `npm run build:kkleung` so K.K. Leung phone / WhatsApp are baked into the static site.  
2. **Deploy** that `dist/frontend/browser` folder to Cloudflare Pages project **`wheelchairtaxipro`**.  
3. **Attach** already-Active DNS zone **`wheelchairtaxipro.com`** as a Pages **custom domain**.  
4. **QR tracking = yes, query string:** use UTM parameters on `/booking` so name-card scans are not counted as anonymous Direct traffic.  
5. Print the **name-card** QR only after a phone scan shows the full tagged URL (`utm_campaign=name-card`) in the address bar.

When this checklist is green, first go-live for the public marketing + booking site is complete. Ads Worker / deep GA4 wiring can follow Part 18 without changing the printed name cards if UTMs were included from day one.
