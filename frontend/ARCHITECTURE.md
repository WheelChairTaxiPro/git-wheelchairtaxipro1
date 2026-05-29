# Frontend Architecture — Wheelchair Taxi Pro

> Canonical reference for the **folder layout, file conventions, and architectural rules** of the Angular 21 rider-facing PWA.
>
> For the **"why"** (vertical-slice rationale, bilingual strategy, SEO/GEO/AEO, Phase 1 vs Phase 2 boundaries), read the design docs in `/initial-design/`:
>
> - [`initial-design/13-0-Frontend-…_vertical_slice.md`](../initial-design/13-0-Frontend-wheelchair_taxi_pro_wireframe_build_specification_updated_with_vertical_slice.md) — full architecture spec
> - [`initial-design/13-1-Frontend-phase1.md`](../initial-design/13-1-Frontend-phase1.md) — Phase 1 scope
> - [`docs/LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md`](../docs/LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md) — hosting rationale

---

## 1. Summary

- **Framework:** Angular 21 (standalone APIs, no `NgModule`).
- **Runtime:** Node.js 22 LTS (or 20.19+).
- **Architecture style:** **Vertical Slice** under `src/app/features/`, with shared `core/` (singletons) and `shared/` (reusable UI/utils).
- **Rendering:** Static prerender via `@angular/ssr` — every public route ships as fully-rendered HTML.
- **Tests:** Unit & component tests colocated as `*.spec.ts`. **Playwright E2E lives at the frontend root in `e2e/`**, outside `src/`.
- **PWA:** Installable, manifest in `public/manifest.webmanifest`, service worker wired in `app.config.ts`.
- **Hosting:** Cloudflare Pages (free tier).

---

## 2. Canonical folder layout

> Every folder under `features/` corresponds to a visible element in the Phase 1 wireframe ([`initial-design/13-3-wireframe-phase1.jpeg`](../initial-design/13-3-wireframe-phase1.jpeg)). See §2a below for the full mapping table.

```text
frontend/
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── playwright.config.ts           # E2E config at frontend root
├── e2e/                           # Playwright specs (sibling of src/, NOT inside it)
│   ├── home.spec.ts
│   ├── booking.spec.ts
│   └── contact-strip.spec.ts
├── public/                        # Angular 21 default for static assets (replaces old src/assets)
│   ├── favicon.ico
│   ├── logo.svg
│   └── manifest.webmanifest       # PWA manifest
└── src/
    ├── main.ts                    # bootstrapApplication entry point
    ├── index.html
    ├── styles.scss
    ├── environments/
    │   ├── environment.ts
    │   └── environment.development.ts
    └── app/
        ├── app.ts                 # Root standalone component (Angular 21 naming)
        ├── app.html
        ├── app.scss
        ├── app.spec.ts
        ├── app.config.ts          # provideRouter, provideHttpClient, provideServiceWorker, etc.
        ├── app.routes.ts          # Top-level Routes array
        │
        ├── core/                  # Singletons, loaded once
        │   ├── http/
        │   │   └── api.interceptor.ts
        │   ├── config/
        │   │   └── app-config.service.ts
        │   ├── guards/
        │   │   └── language.guard.ts
        │   └── services/
        │       └── analytics.service.ts
        │
        ├── shared/                # Reusable, stateless, used by 2+ features
        │   ├── ui/
        │   │   ├── button/
        │   │   └── language-switcher/
        │   ├── pipes/
        │   └── models/
        │
        └── features/              # Vertical slices (lazy-loaded routes)
            ├── map/                # Tab 1 (default): 路線 — user location, pickup, drop-off, route, est. price preview
            │   ├── map.ts
            │   ├── map.html
            │   ├── map.scss
            │   ├── map.spec.ts
            │   ├── map.service.ts
            │   ├── map.models.ts
            │   └── map.routes.ts
            ├── booking/            # Tab 2: 預約 — From / To / date / phone / email → submit
            │   ├── booking.ts
            │   ├── booking.html
            │   ├── booking.scss
            │   ├── booking.spec.ts
            │   ├── booking.service.ts
            │   ├── booking.models.ts
            │   └── booking.routes.ts
            ├── pricing/            # Tab 3: 收費 — fare schedule, tunnel fees, surcharges
            │   ├── pricing.ts
            │   ├── pricing.html
            │   ├── pricing.scss
            │   ├── pricing.spec.ts
            │   └── pricing.routes.ts
            ├── contact-strip/      # Persistent bottom bar: Phone / WhatsApp / WeChat
            │   ├── contact-strip.ts
            │   ├── contact-strip.html
            │   ├── contact-strip.scss
            │   └── contact-strip.spec.ts
            ├── faq/                # Hamburger menu: 常見問題 (SEO/GEO/AEO)
            │   ├── faq.ts
            │   ├── faq.html
            │   ├── faq.scss
            │   ├── faq.spec.ts
            │   └── faq.routes.ts
            └── about/              # Hamburger menu: 關於我們
                ├── about.ts
                ├── about.html
                ├── about.scss
                ├── about.spec.ts
                └── about.routes.ts
```

---

## 2a. Wireframe → slice mapping (Phase 1)

The wireframe in [`initial-design/13-3-wireframe-phase1.jpeg`](../initial-design/13-3-wireframe-phase1.jpeg) defines three primary bottom-nav tabs plus a persistent contact strip plus a hamburger menu. Every UI surface visible in the wireframe maps 1-to-1 to a folder under `features/`:

| Wireframe element         | Chinese label  | Route      | Slice folder        | Navigation surface          |
|---------------------------|----------------|------------|---------------------|-----------------------------|
| Tab 1 — Map               | 路線           | `/route` (`/map` redirects here) | `features/map/`       | Bottom tab bar              |
| Tab 2 (default landing) — Booking | 預約   | `/booking` (and `/` redirects here) | `features/booking/` | Bottom tab bar              |
| Tab 3 — Pricing           | 收費           | `/pricing` | `features/pricing/` | Bottom tab bar + hamburger  |
| Bottom contact strip      | 即時聯絡按鈕   | (persistent) | `features/contact-strip/` | Rendered in root `App`  |
| Hamburger — FAQ           | 常見問題       | `/faq`     | `features/faq/`     | Hamburger menu              |
| Hamburger — About         | 關於我們       | `/about`   | `features/about/`   | Hamburger menu              |
| Hamburger — Contact       | 聯絡我們       | `/contact` | *(Phase 1: deep-link to `contact-strip` actions; add `features/contact/` only if richer content is needed)* | Hamburger menu |
| Bottom tab bar (chrome)   | 導航列         | (persistent) | `shared/ui/bottom-nav/` | Rendered in root `App` |
| Header + hamburger (chrome)| —             | (persistent) | `shared/ui/app-shell/` (or root `App`) | Rendered in root `App` |

**Rules derived from this mapping:**

1. **`/` (root path) redirects to `/booking`.** The first screen is the booking form; a dedicated `features/home/` slice is **not** needed. The map route is **`/route`** (legacy **`/map`** redirects there). SEO-critical `<h1>` / Schema.org for the business may live on booking, map, or both as the product evolves.
2. **`pricing/` is one slice with two navigation entry points.** Both the bottom tab bar and the hamburger menu link to the same `/pricing` route. Don't duplicate the component.
3. **The bottom tab bar and the persistent contact strip are layout chrome**, not routes. The tab bar goes in `shared/ui/bottom-nav/` (pure presentation, no state beyond "which route is active"); the contact strip stays in `features/contact-strip/` because it owns a small amount of feature logic (click tracking, anti-fraud throttling per design doc §3.5).
4. **Bilingual mirror under `/en/...`.** Each slice listed above gets an English route sibling — implemented either with Angular i18n or by a parallel routing tree under `features/en/`, depending on which the team picks when scaffolding.

---

## 3. File & naming conventions

### 3.1 Angular 21 filename style

Angular 21's style guide **drops the `.component` / `.service` / `.pipe` suffix from filenames**. The class still carries semantic meaning via its name.

| Kind           | Filename               | Class name                 |
|----------------|------------------------|----------------------------|
| Component      | `home.ts`              | `export class Home`        |
| Service        | `booking.service.ts`   | `export class BookingService` *(service keeps the suffix to distinguish from DTOs)* |
| Route config   | `home.routes.ts`       | `export const homeRoutes` or `default` export of `Routes` |
| Model / DTO    | `booking.models.ts`    | `export interface BookingRequest` (etc.) |
| Unit test      | `<thing>.spec.ts`      | —                          |
| E2E test       | `<journey>.spec.ts` (in `e2e/`) | —                  |

**Pick one convention and stay consistent.** The Angular CLI 21 defaults to the suffix-less style; honour that.

### 3.2 Folder naming

- **kebab-case** for all folders (`contact-strip/`, not `contactStrip/`).
- **One feature = one folder** under `features/`.
- Feature folder name should match its primary route segment where possible (`/booking` ↔ `features/booking/`).

### 3.3 One slice, one job

A feature slice owns:

- Its **UI** (component + template + styles)
- Its **tests** (unit + component specs)
- Its **data access** (feature-local services, e.g. `booking.service.ts`)
- Its **DTOs** (`<slice>.models.ts`)
- Its **routes** (`<slice>.routes.ts`, exported as lazy-loadable)

A slice must **not**:

- Import from a sibling slice's internals (only via shared/core).
- Register global providers (those go in `app.config.ts`).

---

## 4. What goes where — the rules

| Kind of code                                           | Location                          |
|--------------------------------------------------------|-----------------------------------|
| A route the user navigates to                          | `features/<slice>/`               |
| Shared HTTP interceptor (auth, error handling, tracing)| `core/http/`                      |
| Guard used by router (language, geo-permission)        | `core/guards/`                    |
| App-wide config service / analytics wrapper            | `core/services/` or `core/config/`|
| A reusable `<button>` / `<language-switcher>`          | `shared/ui/`                      |
| Pure functions, date helpers, formatters               | `shared/utils/` (add when needed) |
| DTOs used by a single feature                          | `features/<slice>/<slice>.models.ts` |
| DTOs used by 2+ features                               | `shared/models/`                  |
| PWA manifest, favicon, static images                   | `public/`                         |
| Playwright specs (user journeys)                       | `e2e/` (frontend root, not in `src/`) |
| Unit / component tests                                 | `*.spec.ts` colocated with the code |

### `core/` vs `shared/` — the boundary

- **`core/`**: **stateful singletons** provided once (`providedIn: 'root'`) — HTTP interceptors, config, analytics, guards, app-wide services. Never import from a feature.
- **`shared/`**: **stateless, reusable** UI components, pipes, and small utilities. Safe for any feature to import. Never put a stateful service here.

### When to promote to `shared/`

Only when **two or more features actually need the same thing**. Premature promotion creates a "god module". The design doc is explicit: *"Prefer feature isolation over premature abstraction."*

---

## 4a. State management — signals first

This project follows a **signals-first** rule. Angular 21's signal primitives are the default way to hold and expose reactive state; RxJS is kept for the (small) set of problems it is actually designed to solve.

### The rule

| You are modelling…                                       | Use                                         |
|----------------------------------------------------------|---------------------------------------------|
| A piece of current state (e.g. selected trip, language)  | `signal<T>()`                               |
| Derived / computed state                                 | `computed(() => …)`                         |
| A side effect that reacts to state (log, analytics, persist) | `effect(() => …)` (in an injection context) |
| A reusable "current value of X" service                  | Service with a private `signal` + `asReadonly()` getter |
| HTTP request / response                                  | `HttpClient` Observable; convert with `toSignal()` if the template needs it |
| Debounced user input, typeahead, search-as-you-type      | RxJS (`debounceTime` + `switchMap`)         |
| Websocket / SSE streams (Phase 2: live driver location)  | RxJS                                        |
| Form control value / validity                            | Reactive Forms (Observable-based) today; migrate to signal-based forms when stable |

### What this means in practice

- **Default to `signal()`** for any feature-local or shared state. Do not reach for `BehaviorSubject` in new code.
- **Expose read-only access** from services via `signal.asReadonly()` so only the owning service can mutate.
- **Templates read synchronously**: `{{ trip.selection()?.pickup.address }}` — no `async` pipe, no subscription.
- **Convert at the boundary.** If you must consume an Observable (e.g. from `HttpClient`), use `toSignal(obs$, { initialValue: … })` so the rest of the component stays synchronous. If you must feed a signal into an RxJS pipeline, use `toObservable(sig)`.
- **No global `BehaviorSubject` state services.** Any "current X" service should be a thin wrapper around a private `signal`.
- **RxJS is not banned.** Reach for it when a problem is genuinely a stream-transformation problem (see table above). Don't reach for it for state.

### Why

- Angular 21's **zoneless** change detection relies on precise, signal-driven notifications. Signals-first code ports to zoneless with no rework.
- Signals eliminate the subscribe/unsubscribe lifecycle and the memory-leak footguns that come with it.
- Synchronous reads make component logic simpler to read, test, and debug.
- The wider ecosystem (SolidJS, Vue 3, Svelte 5, Preact, React Compiler) has converged on the same primitive — this is not an Angular-only bet.

### Example — the canonical shared state service

```ts
// src/app/shared/services/trip-state.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { TripSelection } from '../models/trip.models';

@Injectable({ providedIn: 'root' })
export class TripStateService {
  private readonly _selection = signal<TripSelection | null>(null);

  readonly selection = this._selection.asReadonly();
  readonly hasTrip   = computed(() => this._selection() !== null);

  set(selection: TripSelection) { this._selection.set(selection); }
  clear()                        { this._selection.set(null); }
}
```

Consumed in a component:

```ts
// src/app/features/booking/booking.ts
import { Component, inject } from '@angular/core';
import { TripStateService } from '../../shared/services/trip-state.service';

@Component({ /* … */ })
export class Booking {
  private readonly trip = inject(TripStateService);
  readonly selection = this.trip.selection;    // expose the signal to the template
}
```

```html
<!-- booking.html -->
@if (selection(); as s) {
  <p>From: {{ s.pickup.address }}</p>
  <p>To:   {{ s.dropoff.address }}</p>
  <p>Estimated fare: HKD {{ s.estimatedFareHkd }}</p>
} @else {
  <p>Please choose pickup and drop-off on the map first.</p>
}
```

### Code-review checklist

- [ ] No new `BehaviorSubject` / `ReplaySubject` for holding state.
- [ ] No `.subscribe()` in components where a signal + `toSignal()` would do.
- [ ] No `async` pipe in templates for values that are really "current X" (convert to signal).
- [ ] RxJS appears only in HTTP calls, form `valueChanges`, and genuine event streams.

---

## 5. Lazy loading & route wiring

Each feature exports its own `Routes` array and is loaded via `loadChildren` from the top-level `app.routes.ts`:

```ts
// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '',        loadChildren: () => import('./features/home/home.routes').then(m => m.homeRoutes) },
  { path: 'booking', loadChildren: () => import('./features/booking/booking.routes').then(m => m.bookingRoutes) },
  { path: 'faq',     loadChildren: () => import('./features/faq/faq.routes').then(m => m.faqRoutes) },
  { path: 'en',      loadChildren: () => import('./features/en/en.routes').then(m => m.enRoutes) },
];
```

```ts
// src/app/features/booking/booking.routes.ts
import { Routes } from '@angular/router';

export const bookingRoutes: Routes = [
  { path: '', loadComponent: () => import('./booking').then(m => m.Booking) },
];
```

**Result**: each slice ships as its own JS chunk — keeps the initial bundle small and Core Web Vitals happy.

### Exception: persistent layout elements

Some slices are **not routes** — they're rendered on every page (the bottom contact strip is the prime example). These are imported directly into the root `app.ts` template:

```ts
// src/app/app.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContactStrip } from './features/contact-strip/contact-strip';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ContactStrip],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
```

---

## 6. Testing layout

### Unit & component tests (colocated)

Every `.ts` that contains logic has a sibling `.spec.ts`. Run with `ng test`.

### E2E tests (at frontend root)

Playwright drives a built/served app from outside. Layout:

```text
frontend/
├── playwright.config.ts
└── e2e/
    ├── home.spec.ts
    ├── booking.spec.ts
    └── contact-strip.spec.ts
```

- Use stable `data-testid` attributes on primary controls.
- `baseURL` comes from env var — local `ng serve`, Cloudflare Pages preview URL in CI.
- Scope in Phase 1: **smoke-level**, one journey per slice. See design doc §2.10.

Do **not** put Playwright specs inside `src/app/`. They are not part of the Angular compilation unit.

---

## 7. SEO / prerender rules

Because this site must rank in Google and in AI answer engines:

1. **Every public route must be listed in `app.routes.ts`** so `@angular/ssr` can discover it for prerendering.
2. **No content rendered purely by JS after mount** for SEO-critical copy. If text needs to appear in search results, it must be in the component template, not fetched post-render.
3. **Schema.org JSON-LD** (`LocalBusiness`, `FAQPage`, `Service`, `BreadcrumbList`) is injected per-route via the component template or a shared `<app-jsonld>` helper in `shared/ui/`.
4. **Bilingual URLs**: the English tree lives under `/en/...`; Traditional Chinese is the default at `/`.
5. **Internal linking** between services / FAQ / pricing pages is a shared Angular component (`shared/ui/related-links/`) rendered on every page.

See [`docs/LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md`](../docs/LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md) for the full prerender rationale.

---

## 8. Phase 2 slices (not built yet)

When driver apps and live fleet data arrive, add these under `features/` — don't retrofit them into existing slices:

- `map-view/` — live vehicle markers, user-center / route-center toggle
- `taxi-discovery/` — nearby taxi list and markers
- `fare-estimation/` — client-side price calc
- `trip-planning/` — multi-stop planning
- `map-provider-settings/` — swap between Google / Tencent / Amap / Baidu / Huawei
- `communication/` — per-driver/vehicle messaging (distinct from the Phase 1 default `contact-strip/`)

---

## 9. Change control

This document describes the **current** frontend layout. When adding a new slice, new shared helper, or new root-level concern:

1. Add the folder(s).
2. Update the canonical tree in §2 of this file.
3. Add a row to the "What goes where" table in §4 if a new category emerges.
4. If the rules in §3–§5 change materially, note it in the commit message and link the PR.

Keep this file short and accurate. If it grows beyond a few screens, split design rationale back out into `initial-design/` and leave only rules + the tree here.

---

*Last updated: April 2026 — Angular 21, Node.js 22 LTS.*
