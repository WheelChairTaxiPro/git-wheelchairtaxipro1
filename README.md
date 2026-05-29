# Wheelchair Taxi Pro

> SEO-optimized, bilingual (繁體中文 / English) booking platform for wheelchair-accessible taxis in Hong Kong.

Rider-facing website and booking API designed to compete with established wheelchair taxi services in Hong Kong and dominate Google Search, Google Maps, and AI-powered answer engines (GEO / AEO).

- **Facebook:** https://www.facebook.com/wheelchairtaxipro
- **Target domains:** `wheelchairtaxipro.com` / `wheelchairtaxipro.hk`
- **Target competitors:** hkwheelchairtaxis.com · hkwheelchair51846193.com · hongkongcaringtaxi.com

---

## Table of Contents

- [Project Goals](#project-goals)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Phase 1 (MVP) Scope](#phase-1-mvp-scope)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Repository Hygiene](#repository-hygiene)
- [Design Documents](#design-documents)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Project Goals

1. **Build a rider-facing PWA** (mobile-first) that lets users submit wheelchair taxi bookings in seconds.
2. **Dominate HK search intent** for keywords like `輪椅的士`, `輪椅的士收費`, `wheelchair taxi Hong Kong` via strong on-page SEO, structured data, and GEO/AEO-friendly content.
3. **Optimize for AI-assisted discovery** (Google AI Overviews, answer engines) with FAQ-rich, factual, bilingual content and Schema.org markup (`LocalBusiness`, `FAQPage`, `Service`).
4. **Keep the stack portable** so the map provider can swap between Google Maps (HK) and Tencent / Amap / Baidu / Huawei (future China deployment).
5. **Ship fast, stay simple** — vertical-slice architecture on both frontend and backend, no heavyweight abstractions in Phase 1.

---

## Tech Stack

| Layer        | Choice                                                                 |
|--------------|------------------------------------------------------------------------|
| Frontend     | **Angular 21** (standalone APIs) + Angular Material, PWA enabled       |
| Runtime      | **Node.js 22 LTS** (also supports Node.js 20.19+)                      |
| Styling      | Angular Material + SCSS (Tailwind optional later)                      |
| Maps         | Google Maps (HK) via `IMapProvider` adapter                            |
| Backend      | **.NET 10 LTS** Web API, Vertical Slice, **no MediatR**                |
| Persistence  | (Phase 1: email-based; Phase 2: EF Core 10 + relational DB)            |
| Email        | SMTP / SendGrid (configurable via `IEmailSender`)                      |
| Hosting FE   | **Cloudflare Pages** (free tier) + Angular **static prerendering** for SEO |
| Hosting API  | Any Linux .NET 10 host (Railway / Render / Fly.io / VPS + Docker)          |
| Analytics    | Google Analytics 4, Google Search Console                              |
| E2E Testing  | Playwright (`@playwright/test`)                                        |
| Unit Testing | Colocated `*.spec.ts` (Angular) + xUnit (.NET)                         |

### Support windows

| Component  | Version   | Released  | Support through                          |
|------------|-----------|-----------|------------------------------------------|
| .NET       | **10 LTS** | Nov 2025  | **Nov 14, 2028** (3-year LTS)            |
| Angular    | **21**    | Nov 2025  | Active to May 2026 · LTS to **May 2027** |
| Node.js    | **22 LTS** | Oct 2024  | Active LTS to Oct 2025 · Maintenance to **Apr 2027** |

---

## Repository Structure

```text
git-wheelchairtaxipro1/
├── initial-design/          # Product, architecture & SEO specification documents
├── frontend/        # Angular PWA (rider-facing website)  — to be scaffolded
├── backend/         # .NET 10 Web API (booking + map provider) — to be scaffolded
├── docs/            # Long-form articles & handover docs (published)
└── README.md        # This file
```

### Frontend (planned) — vertical slices

```text
frontend/
├── angular.json
├── package.json
├── playwright.config.ts       # E2E config
├── e2e/                       # Playwright specs (sibling of src/, NOT inside it)
│   ├── home.spec.ts
│   ├── booking.spec.ts
│   └── contact-strip.spec.ts
├── public/                    # Static assets (favicon, logo, manifest.webmanifest)
└── src/
    ├── main.ts                # bootstrapApplication entry
    ├── index.html
    ├── styles.scss
    ├── environments/
    └── app/
        ├── app.ts             # Root standalone component
        ├── app.config.ts      # provideRouter, provideHttpClient, provideServiceWorker
        ├── app.routes.ts
        ├── core/              # Singletons: HTTP interceptors, guards, config, analytics
        ├── shared/            # Reusable UI components, pipes, cross-feature models
        └── features/          # Vertical slices — each lazy-loaded via *.routes.ts
            ├── map/           # Bottom tab: 路線 — pickup/drop-off/route/price preview (`/route`)
            ├── booking/       # Bottom tab: 預約 — From / To / date / phone / email → submit (site opens here: `/`, `/booking`)
            ├── pricing/       # Tab 3: 收費 — fare schedule, tunnel fees, surcharges
            ├── contact-strip/ # Persistent bottom Phone / WhatsApp / WeChat bar
            ├── faq/           # Hamburger menu: 常見問題 (GEO/AEO-friendly)
            └── about/         # Hamburger menu: 關於我們
```

Slices derive directly from the Phase 1 wireframe ([`initial-design/13-3-wireframe-phase1.jpeg`](initial-design/13-3-wireframe-phase1.jpeg)) — three bottom-nav tabs (**map · booking · pricing**), persistent contact strip, hamburger menu (**faq · about**). **`/` redirects to `/booking`** (first screen is the booking form); the map lives at **`/route`**, with **`/map` redirecting there**. Full wireframe → slice mapping table in [`frontend/ARCHITECTURE.md §2a`](frontend/ARCHITECTURE.md).

### Backend (planned) — vertical slices

```text
backend/src/
├── API/                 # Program.cs, controllers (thin), DI wiring
├── Core/
│   └── Interfaces/      # IMapProvider, IEmailSender, IBookingRepository
├── Infrastructure/
│   ├── ExternalServices/ # GoogleMapsProvider, SmtpEmailSender, …
│   └── Persistence/     # (Phase 2) EF Core DbContext, repositories
└── Features/
    ├── Booking/          # Submit booking + email notify
    ├── TaxiDiscovery/    # (Phase 2) nearby taxis
    ├── FareEstimation/   # (Phase 2) price calc
    ├── TripPlanning/     # Route / From-To planning
    ├── MapRouting/       # Directions / geocoding
    └── Communication/    # Notification hooks
```

> **Canonical frontend folder layout and rules:** [`frontend/ARCHITECTURE.md`](frontend/ARCHITECTURE.md)
>
> **Full architectural rationale (vertical slice + hybrid core/shared):** [`initial-design/13-0-Frontend-…_vertical_slice.md`](initial-design/13-0-Frontend-wheelchair_taxi_pro_wireframe_build_specification_updated_with_vertical_slice.md)
>
> **Backend slice explanation:** [`initial-design/14-Backend-…_no_mediat_r.md`](initial-design/14-Backend-wheelchair_taxi_pro_backend_plan_v_2_no_mediat_r.md)

---

## Phase 1 (MVP) Scope

**Rider-facing website only.** No driver apps, no live fleet layer, no per-driver map pins.

### UI (per wireframe)

- **Header**: logo + hamburger (About · Pricing · Contact · Help/FAQ)
- **Pricing section** — static price list (base fare + per-km style)
- **Booking form** — From, To, Date & Time, Phone (required), Email (required)
- **Primary CTA** — `Send Booking Request`
- **Map** — current location, pickup, drop-off, route preview
- **Persistent bottom contact strip** — Phone (`tel:`), WhatsApp (`wa.me/…`), WeChat (QR + copyable ID)

### Feature checklist

- [ ] One-click contact (Phone / WhatsApp / WeChat) — single default business identity
- [ ] Browser geolocation → reverse geocoding → auto-filled pickup
- [ ] Booking form submit → API → email to dispatcher + confirmation to user
- [ ] Installable PWA (manifest + service worker)
- [ ] Bilingual (zh-HK / en) with auto language detection from `Accept-Language` + region, persistent switcher
- [ ] Anti-fraud: IP logging, click rate limiting, GA conversion tracking
- [ ] SEO: meta tags, Schema.org JSON-LD (`LocalBusiness`, `FAQPage`, `Service`), sitemap, robots.txt
- [ ] Google Business Profile + local citations (external task)

### Out of scope for Phase 1

Driver client apps · live vehicle positions · real-time dispatch · payments · SMS/WhatsApp push notifications · review schema (until reviews exist).

---

## Architecture

### Request flow (Phase 1)

```
Browser
  │
  ├──▶ Cloudflare Pages (wheelchairtaxipro.com)
  │       • Prerendered Angular 21 HTML (one static file per route)
  │       • Service worker, bilingual content, Schema.org JSON-LD
  │       • Cached at 300+ PoPs incl. Hong Kong edge
  │
  └──▶ api.wheelchairtaxipro.com
          ↓ (CORS-allowed from Pages domain)
       .NET 10 Web API (Railway / Render / Fly.io — HK/SG region)
          ↓
       Booking Handler → IEmailSender → dispatcher + rider email
```

### Why Cloudflare Pages for the frontend?

- **Free tier is enough for MVP**: unlimited bandwidth & requests, 500 builds/month, HTTPS & custom domain included, automatic preview deploys per Git push, global CDN with a Hong Kong PoP.
- **Static prerendering handles SEO/GEO/AEO**: `ng add @angular/ssr` → enable `"prerender": true` in `angular.json`. Every public route (home, pricing, services/*, FAQ, About, Contact, `/en/...`) ships as fully-rendered HTML so Google, AI Overviews, and non-JS crawlers index content immediately — no SSR runtime required.
- **Dynamic bits stay client-side**: geolocation, Google Maps, booking form submission run after hydration — none of them are SEO-relevant anyway.
- **Limits to be aware of**: Cloudflare Pages doesn't run .NET (the API needs its own host), can be unreliable inside **mainland China** (fine for HK; Phase 2 China expansion may need a China-resident CDN like Tencent EdgeOne), and edge rate-limiting on contact CTAs still belongs on the API side.

> Full rationale: [`docs/LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md`](docs/LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md)

### Backend style

**Vertical Slice + simple handlers** (no mediator). Each slice owns its own `Request`, `Handler`, `Response`, and feature-local models.

```
Controller → Handler → (Service | IMapProvider | IEmailSender) → External
```

- `Core/` depends on nothing.
- `Features/` depend on `Core/` interfaces only.
- `Infrastructure/` implements `Core/` interfaces.
- `API/` wires everything via DI.

### Map provider abstraction

`IMapProvider` with interchangeable adapters so Hong Kong (Google Maps) and China (Tencent / Amap / Baidu / Huawei) deployments can coexist without touching feature handlers.

---

## Getting Started

> The `frontend/` and `backend/` folders are **not yet scaffolded**. The commands below describe the intended setup once scaffolding begins.

### Prerequisites

- **Node.js 22 LTS** (or Node 20.19+) — [nodejs.org](https://nodejs.org/)
- **Angular CLI 21** — `npm i -g @angular/cli@21`
- **.NET SDK 10.0** (LTS) — [dotnet.microsoft.com/download/dotnet/10.0](https://dotnet.microsoft.com/download/dotnet/10.0)
- A Google Maps API key (Phase 1, HK deployment)

Verify:

```bash
node --version     # v22.x (or v20.19+)
ng version         # Angular CLI: 21.x.x
dotnet --list-sdks # 10.0.x
```

### Frontend

```bash
cd frontend
npm install
ng serve           # http://localhost:4200
ng build           # production build → dist/
```

### Backend

```bash
cd backend/src/API
dotnet restore
dotnet run         # http://localhost:5000 (Swagger at /swagger in Development)
```

### Environment configuration

Create the following (examples — real values live in secrets / env, never in git):

**`frontend/src/environments/environment.ts`**
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  googleMapsApiKey: 'YOUR_KEY',
  defaultContact: {
    phone: '+85212345678',
    whatsapp: '85212345678',
    wechatId: 'wheelchairtaxipro',
  },
};
```

**`backend/src/API/appsettings.Development.json`**
```json
{
  "Cors": { "AllowedOrigins": ["http://localhost:4200"] },
  "Email": { "Smtp": { "Host": "...", "Port": 587, "User": "...", "Password": "..." } },
  "Maps": { "Provider": "Google", "ApiKey": "..." },
  "Dispatcher": { "Email": "dispatch@wheelchairtaxipro.com" }
}
```

### Running E2E tests

```bash
cd frontend
npx playwright install --with-deps    # first time only
npx playwright test
```

---

## Repository Hygiene

Keep repo-wide ignore rules in the root `.gitignore`. This is the central place for build outputs, dependency folders, local-only notes, generated config, and secret-bearing files.

Use narrow ignore rules for generated files. For example, ignore `frontend/src/app/core/config/google-maps.generated.ts` because it is created from `GOOGLE_MAPS_API_KEY` during frontend build/start and may contain a real API key. Do not ignore the whole `frontend/src/app/core/` folder, because it is a normal Angular source folder and may later contain committed app code.

---

## Design Documents

> **Canonical, arc42-structured spec** (start here for the formal Design & Specification): [`docs/design/00-index.md`](docs/design/00-index.md) · bilingual (EN + zh-HK)
>
> **New to the methodologies?** Read the plain-English primer first: [`docs/LearningNotes/arc42-c4-adrs-wcag-and-web-vitals-explained.md`](docs/LearningNotes/arc42-c4-adrs-wcag-and-web-vitals-explained.md) — a one-page walkthrough of the four pillars (arc42, C4, ADRs, WCAG + Web Vitals) the spec is built on.
>
> The files under [`initial-design/`](initial-design/) are the **raw research and early-draft inputs** that fed into the formal spec above. They remain available for historical context but are no longer the primary reference.

All initial design material lives under [`initial-design/`](initial-design/):

| File | Purpose |
|------|---------|
| [`1-project-plan.md`](initial-design/1-project-plan.md) | Overall SEO + website group project plan & timeline |
| [`6-…_proposal_bilingual_v_2.md`](initial-design/6-wheelchair_taxi_website_platform_proposal_bilingual_v_2.md) | Bilingual platform proposal |
| [`7-…_task_breakdown_implementation_guide.md`](initial-design/7-wheelchair_taxi_project_task_breakdown_implementation_guide.md) | Task-by-task implementation guide |
| [`8-Guide.md`](initial-design/8-Guide.md) | Developer guide (hosting, deployment, ops) |
| [`13-0-Frontend…vertical_slice.md`](initial-design/13-0-Frontend-wheelchair_taxi_pro_wireframe_build_specification_updated_with_vertical_slice.md) | Full frontend architecture (vertical slice + hybrid core/shared) |
| [`13-1-Frontend-phase1.md`](initial-design/13-1-Frontend-phase1.md) | Phase 1 frontend scope (this MVP) |
| [`13-2-…_wireframe_description_v_4.md`](initial-design/13-2-wheelchair_taxi_pro_wireframe_description_v_4.md) | Wireframe description (EN) |
| [`13-3-…_mobile_wireframe_description_v_5.md`](initial-design/13-3-wheelchair_taxi_pro_mobile_wireframe_description_en_????_v_5.md) | Mobile wireframe (bilingual) |
| [`13-4-…_booking_form_pricing_content.md`](initial-design/13-4-wheelchair_taxi_pro_booking_form_pricing_content_????.md) | Booking form copy & pricing content |
| [`14-Backend…no_mediat_r.md`](initial-design/14-Backend-wheelchair_taxi_pro_backend_plan_v_2_no_mediat_r.md) | Backend architecture (vertical slice, no MediatR) |
| [`15-phase1-build-order.md`](initial-design/15-phase1-build-order.md) | **Step-by-step build order for Phase 1** (start here when you begin coding) |
| [`WheelchairTaxiPro_Communication.md`](initial-design/WheelchairTaxiPro_Communication.md) | `tel:` / WhatsApp / WeChat integration spec |
| [`9-Hosting options…Hong Kong.md`](initial-design/9-Hosting%20options%20and%20pricing%20research%20for%20WheelchairTaxiPro%20in%20Hong%20Kong.md) | Hosting research |
| [`12-Hybrid_Hosting.md`](initial-design/12-Hybrid_Hosting.md) | Hybrid hosting plan |
| [`DiscussArchitectures.md`](initial-design/DiscussArchitectures.md) | Architecture discussion notes |

---

## Roadmap

### Phase 1 — MVP (weeks 1–6)
- [x] Design & specs
- [ ] Scaffold `frontend/` Angular 21 PWA
- [ ] Scaffold `backend/` .NET 10 Web API
- [ ] Booking slice (form + email notify)
- [ ] Contact strip (Phone / WhatsApp / WeChat)
- [ ] Bilingual copy + language switcher
- [ ] SEO baseline (meta, Schema.org, sitemap, robots.txt)
- [ ] Deploy: Cloudflare Pages (FE) + PaaS (API)
- [ ] Google Business Profile + analytics

### Phase 2 — Scaling (weeks 7–18+)
- [ ] Secondary website (different branding, same platform)
- [ ] Content marketing / blog (bilingual, GEO/AEO-tuned)
- [ ] Multi-driver & dispatch system
- [ ] Live map + fleet tracking
- [ ] Payments (Stripe or HK gateway)
- [ ] China-ready map provider adapters (Tencent / Amap / Baidu / Huawei)
- [ ] Review schema once reviews exist

### Phase 1 KPIs (month-3 targets)
| Metric | Target |
|--------|--------|
| Organic sessions / month | 2,000 |
| Top-10 keywords | 20 |
| Google Business views | 5,000 |
| Backlinks | 30 |
| Google reviews | 15 (4.5+) |

---

## Contributing

**Start here:** [`CONTRIBUTING.md`](CONTRIBUTING.md) — full onboarding guide covering prerequisites, multi-GitHub-account SSH setup, per-repo git identity, GitFlow branching model, commit conventions, and troubleshooting.

Short version for returning contributors:

- **Pick a slice.** New feature? New folder under `features/` (frontend) or `Features/` (backend).
- **Colocate tests.** Unit / component tests sit next to the code as `*.spec.ts` / `*Tests.cs`.
- **Keep `Core/` thin.** Only promote a type to `Core/` or `shared/` when a second slice actually needs it.
- **Don't reach for MediatR or abstractions that aren't paying for themselves yet** (see `initial-design/DiscussArchitectures.md`).
- **Bilingual by default.** Any new user-visible copy must ship in both zh-HK and en.
- **Branching**: GitFlow — `feature/<name>` off `develop`, PR back to `develop`. Never push direct to `main`.
- **Commits**: imperative subject, ≤ 72 chars (`Add booking form`, `Wire IEmailSender SMTP adapter`).

---

## License

TBD. All rights reserved to Wheelchair Taxi Pro until a license is chosen.

---

*Document version: 1.0 · Last updated: April 2026*
