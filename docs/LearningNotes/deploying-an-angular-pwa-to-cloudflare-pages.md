---
title: "Deploying an Angular 21 PWA to Cloudflare Pages — a Practical Runbook"
description: "A step-by-step guide for taking a prerendered Angular PWA from a GitHub repo to a live production URL on Cloudflare Pages, including monorepo build config, custom domain, per-PR previews, environment variables, and rollback."
author: "Wheelchair Taxi Pro Engineering"
date: 2026-04-19
tags: [angular, cloudflare-pages, deployment, ci-cd, runbook, monorepo, static-prerendering]
canonical: ""
---

# Deploying an Angular 21 PWA to Cloudflare Pages — a Practical Runbook

*A step-by-step guide for taking a prerendered Angular PWA from a GitHub repo to a live production URL on Cloudflare Pages, including monorepo build config, custom domain, per-PR previews, environment variables, and rollback.*

> **Related reading.** This article is the **how**. For the **why** (why Cloudflare Pages was chosen, what it gives you, the SEO rationale), read the sibling article [`hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md`](./hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md). You can deploy successfully without reading the rationale, but the rationale answers "why these specific flags?".

---

## Table of Contents

1. [When to use this runbook](#1-when-to-use-this-runbook)
2. [Prerequisites checklist](#2-prerequisites-checklist)
3. [Create the Cloudflare account (one-time)](#3-create-the-cloudflare-account-one-time)
4. [Connect GitHub to Cloudflare](#4-connect-github-to-cloudflare)
5. [Create the Pages project](#5-create-the-pages-project)
6. [The build configuration that actually works](#6-the-build-configuration-that-actually-works)
7. [Environment variables (including Node version)](#7-environment-variables-including-node-version)
8. [First deploy — what happens, what to verify](#8-first-deploy--what-happens-what-to-verify)
9. [Add a custom domain](#9-add-a-custom-domain)
10. [Per-PR preview deployments](#10-per-pr-preview-deployments)
11. [Rollback in under 60 seconds](#11-rollback-in-under-60-seconds)
12. [Common failures and how to fix them](#12-common-failures-and-how-to-fix-them)
13. [Cost monitoring and quota headroom](#13-cost-monitoring-and-quota-headroom)
14. [When to migrate to Cloudflare Workers Static Assets](#14-when-to-migrate-to-cloudflare-workers-static-assets)
15. [Appendix: the 5-minute redeploy checklist](#15-appendix-the-5-minute-redeploy-checklist)

---

## 1. When to use this runbook

Use this guide when you have:

- An Angular 21 app scaffolded with `--ssr=true` (so `@angular/ssr` emits prerendered HTML — essential for SEO and AI answer engines).
- The app lives in a **subdirectory** of a larger repo (for us: `frontend/` inside `git-wheelchairtaxipro1`). Monorepo support is one of the places Cloudflare Pages trips people up, so we cover it explicitly.
- A **GitHub** account that owns the repo.
- A plan to stay on Cloudflare Pages' **free tier** initially — the instructions work the same on paid plans.

Do **not** use this guide for:

- Apps that require server-side rendering *at request time* rather than at build time. Pages can host a Workers-based SSR app, but the setup is different and this runbook doesn't cover it. For an SEO-first marketing + booking site, build-time prerendering is almost always the right choice — see the [rationale article](./hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md) §4.

---

## 2. Prerequisites checklist

Before you start, have these in place:

- [ ] Your Angular app **builds locally without errors**: `cd frontend && npm run build` finishes, `frontend/dist/frontend/browser/` exists, and the build log says "Prerendered N static routes."
- [ ] The repo is on **GitHub** and the branch you want to deploy from (probably `main`) is pushed.
- [ ] You know which **domain** you'll attach (e.g. `wheelchairtaxipro.com`), or you're happy with the free `*.pages.dev` subdomain for now.
- [ ] A **Google Cloud Maps API key** exists (if the app uses Google Maps) — per [`google-maps-setup-notes.local.md`](../../google-maps-setup-notes.local.md) §3. You'll paste it into Pages' environment variables in §7.
- [ ] The Cloudflare account will be owned by **`wheelchairtaxiprofessional@gmail.com`** (same mailbox as the GitHub org and the Google Cloud project — centralised notifications, clean succession).

### One-time local verification

```bash
cd frontend
npm ci
npm run build
# You should see something like:
#   Prerendered 6 static routes.
#   Output location: .../frontend/dist/frontend
ls dist/frontend/browser/index.html   # must exist
```

If `dist/frontend/browser/index.html` doesn't exist, fix that locally before touching Cloudflare. Pages can only deploy what your build produces.

---

## 3. Create the Cloudflare account (one-time)

Mirrors the security posture of our Google Cloud setup. **Do these in order, before any deploy.**

1. Go to <https://dash.cloudflare.com/sign-up>.
2. Sign up with `wheelchairtaxiprofessional@gmail.com`. Confirm the email.
3. **Enable 2-Factor Authentication** via an authenticator app (Google Authenticator / 1Password / Authy). Profile → Authentication → Two-Factor Authentication. **Do not** use SMS.
4. **Save the recovery codes** in 1Password alongside the Cloudflare account password. Losing the 2FA device without these = losing the account.
5. Add a **backup admin email** under Members → Invite Member, inviting a trusted second person with the "Super Administrator - All Privileges" role. Bus-factor rule, same as Google Cloud.
6. Save the Cloudflare account password in 1Password.

You're now in the Cloudflare dashboard. The Pages section is at **Workers & Pages** in the left sidebar.

> **Already have a Cloudflare account under a different email?** That's fine — skip steps 1–2 and use what you have. Cloudflare doesn't care which email owns the account; Pages, DNS, and SSL work identically. You do still need to complete steps 3–6 on that existing account if you haven't already. In particular, adding `wheelchairtaxiprofessional@gmail.com` as a Super Administrator (step 5) is the single most important step, because it gives the business mailbox a recovery path independent of your personal mailbox. If you later want to separate the WheelchairTaxiPro domain onto its own account, Cloudflare supports moving a domain between accounts in ~5 minutes via **Overview → Change account** on the domain — no DNS downtime.

---

## 4. Connect GitHub to Cloudflare

Cloudflare deploys by watching your GitHub branches. This is a one-time OAuth setup per GitHub account.

1. In the Cloudflare dashboard, click **Workers & Pages** → **Overview**.
2. Click **Create** → **Pages** tab → **Connect to Git**.
3. Click **GitHub** → **Connect GitHub account**. A GitHub OAuth screen opens.
4. Under "Install Cloudflare Pages", you have two choices:
   - **All repositories** — simpler but grants Cloudflare access to every repo on the account.
   - **Only select repositories** — pick `git-wheelchairtaxipro1`. **Recommended.**
5. Click **Install & Authorize**.

You should now see `WheelChairTaxiPro/git-wheelchairtaxipro1` in Cloudflare's repo picker.

> **If the org is on GitHub Team or Enterprise**, the org admin may need to approve the Cloudflare GitHub App installation. Watch for a yellow "awaiting admin approval" banner — approve it at <https://github.com/organizations/WheelChairTaxiPro/settings/installations>.

---

## 5. Create the Pages project

1. In the repo picker, select `git-wheelchairtaxipro1` → **Begin setup**.
2. **Project name**: `wheelchair-taxi-pro` (this becomes your `<project-name>.pages.dev` subdomain — choose carefully, renames are painful).
3. **Production branch**: `main`.
   - If you follow the GitFlow convention in [`CONTRIBUTING.md`](../../CONTRIBUTING.md), deploys to production flow: feature → `develop` → `staging` → `main`. So only `main` should deploy to prod. `develop` and `staging` get preview URLs automatically (see §10).
4. Click **Next**. You're now on the build configuration screen — the important one.

---

## 6. The build configuration that actually works

This is where monorepo Angular apps most commonly fail. These settings are correct for our repo layout.

| Field                          | Value for this repo                 | Why                                                                        |
|--------------------------------|-------------------------------------|----------------------------------------------------------------------------|
| **Framework preset**           | **Angular (SSR)**                   | Or **None** if the preset gives weird defaults — we override everything anyway. |
| **Build command**              | `npm ci && npm run build`           | `ci` is faster and more reproducible than `install` in CI.                 |
| **Build output directory**     | `dist/frontend/browser`             | This is the **prerendered static** output. Not `dist/frontend/`, not `dist/`. |
| **Root directory (advanced)**  | `frontend`                          | **Critical** for monorepos. Tells Pages to `cd frontend` before running the build command. |
| **Environment variables**      | See §7                              | At minimum `NODE_VERSION=22`.                                              |

### Why those exact paths

Angular 21 with `--ssr=true` produces this layout after `npm run build`:

```
frontend/
└── dist/
    └── frontend/
        ├── browser/             ← static HTML for every prerendered route
        │   ├── index.html       (redirects / to /map)
        │   ├── map/index.html   (prerendered)
        │   ├── booking/index.html
        │   ├── pricing/index.html
        │   ├── faq/index.html
        │   ├── about/index.html
        │   ├── main-*.js
        │   ├── polyfills-*.js
        │   └── ngsw-worker.js   (service worker)
        └── server/              ← SSR bundle, not used by Pages in static mode
            └── server.mjs
```

Pages wants **`browser/`** because that's the static, edge-cacheable output. The `server/` directory is for Node SSR hosting, which we're not using on Pages.

### What the "Root directory" setting actually does

With `frontend` as the root directory, Pages' CI effectively runs:

```bash
cd frontend                       # the root directory setting
npm ci && npm run build           # the build command
# Then uploads dist/frontend/browser/ (resolved relative to frontend/)
```

If you leave the root directory blank, Pages starts at the repo root, `npm ci` fails because there's no `package.json` there, and the build dies. That's the #1 failure mode for monorepo Angular users.

---

## 7. Environment variables (including Node version)

Still on the build configuration screen. Click **Environment variables** and add:

### Required

| Variable         | Value       | Scope                       | Notes                                                                           |
|------------------|-------------|-----------------------------|---------------------------------------------------------------------------------|
| `NODE_VERSION`   | `22`        | Production + Preview        | Angular 21 requires Node 20.19+ or Node 22. Pages defaults to an older Node.    |
| `NPM_VERSION`    | `10`        | Production + Preview        | Optional, but pins behaviour.                                                   |

### Required for this project

| Variable                | Value                                | Scope                 | Notes                                                                 |
|-------------------------|--------------------------------------|-----------------------|-----------------------------------------------------------------------|
| `GOOGLE_MAPS_API_KEY`   | `<prod key from google-maps-setup-notes.local.md §3.1>` | Production            | The prod-restricted key. Referrer allowlist must include `https://wheelchairtaxipro.com/*` and `https://*.pages.dev/*`. |
| `GOOGLE_MAPS_API_KEY`   | `<dev/preview key>`                  | Preview               | Different key. Referrer allowlist must include `https://*.pages.dev/*`. |

### How the Angular build picks up the env var

Cloudflare Pages only exposes env vars to the build **process**, not to the bundled JavaScript. You need a small build-time substitution. Two common patterns:

**Pattern A — `ng-env` style (recommended):** before `ng build`, a Node script reads `process.env.GOOGLE_MAPS_API_KEY` and writes it into `src/environments/environment.ts`. The script is committed but the resulting file is gitignored.

**Pattern B — `define` build flag:** use Angular's `define` substitution in `angular.json`. More fragile across CLI versions.

For this project, when you get to wiring the map, add a `frontend/scripts/inject-env.mjs` script and a pre-build hook in `package.json`:

```json
"scripts": {
  "prebuild": "node scripts/inject-env.mjs",
  "build": "ng build"
}
```

The `prebuild` script runs automatically before `build`, substitutes the env var, and the committed `environment.ts` stays with a placeholder value. Record the runbook for this in [`docs/design/07-deployment-view.md`](../design/07-deployment-view.md).

### Don't add

- `CI=true` — Pages sets this automatically.
- Source-of-truth secrets for the **backend** — backend env vars belong on the .NET host (Railway/Render/Fly.io), not on Pages. Pages only needs frontend-visible config.

---

## 8. First deploy — what happens, what to verify

Click **Save and Deploy**. Cloudflare:

1. Queues a build on their CI.
2. Clones your repo at `main`.
3. `cd frontend && npm ci && npm run build`.
4. Uploads `frontend/dist/frontend/browser/**` to the edge.
5. Assigns the URL `https://wheelchair-taxi-pro.pages.dev`.

Typical first build: **3–6 minutes** (most of it `npm ci`).

### Verify on the deploy page

- ✅ Build log ends with "Success: Assets published!" and a file count (for our Phase 1 scaffold: ~30 files).
- ✅ The build log contains "Prerendered 6 static routes." — same line you saw locally in §2.
- ✅ Open the deployment URL. You should see `/` redirect to `/map`.
- ✅ `view-source` on any route — you should see **real HTML content**, not just `<app-root></app-root>`. If it's blank, prerendering didn't actually run; go back to §2 and verify locally.

### Test all prerendered routes

Visit each directly (not via in-app navigation) to confirm they serve prerendered HTML:

- <https://wheelchair-taxi-pro.pages.dev/> → should redirect to `/map`
- <https://wheelchair-taxi-pro.pages.dev/map>
- <https://wheelchair-taxi-pro.pages.dev/booking>
- <https://wheelchair-taxi-pro.pages.dev/pricing>
- <https://wheelchair-taxi-pro.pages.dev/faq>
- <https://wheelchair-taxi-pro.pages.dev/about>
- <https://wheelchair-taxi-pro.pages.dev/any-nonsense-path> → should also redirect to `/map` (via the `**` wildcard in `app.routes.ts`)

### Test the PWA behaviour

Unlike local `ng serve` (where the service worker is disabled), prod builds ship the worker. Verify:

1. Open DevTools → **Application** → **Manifest**. You should see the manifest loaded from `/manifest.webmanifest`, with the icons.
2. Chrome's URL bar should show an **Install** button (⊕ icon). Click it to install the PWA locally.
3. DevTools → **Application** → **Service Workers** should show `ngsw-worker.js` as "activated and running".

---

## 9. Add a custom domain

Pages' default `*.pages.dev` URL is fine for development and previews, but production traffic should live on `wheelchairtaxipro.com`.

### If the domain is already on Cloudflare DNS

1. Pages project → **Custom domains** → **Set up a custom domain**.
2. Enter `wheelchairtaxipro.com`. Click **Continue** → **Activate domain**.
3. Pages automatically creates the CNAME and issues an SSL cert via Cloudflare's universal SSL. Usually takes 1–5 minutes.
4. Also add `www.wheelchairtaxipro.com`. Set up a redirect from `www` → apex via a Cloudflare **Page Rule** or **Bulk Redirects** (free tier includes both).

### If the domain is on another registrar

You have two options, both on the free tier:

**Option A — Move DNS to Cloudflare (recommended long-term):**

1. Add the domain to Cloudflare (not to Pages yet) via **Websites** → **Add a site**.
2. Cloudflare gives you two nameservers. Change your registrar's nameservers to these. Propagation: 1 hour to 48 hours.
3. Once DNS is on Cloudflare, follow the section above.

**Option B — Keep DNS at the registrar, use CNAME:**

1. At your registrar, add a `CNAME wheelchairtaxipro.com → <project>.pages.dev`.
2. In Pages → **Custom domains** → **Add**, enter the domain. Pages verifies the CNAME.
3. SSL provisioning may take longer (up to a few hours) because Cloudflare has to issue via the HTTP-01 challenge.

Option A is simpler long-term because Cloudflare DNS is free, fast, and gives you analytics + firewall features later.

---

## 10. Per-PR preview deployments

This is one of the best reasons to use Pages. Every non-`main` branch that has commits gets its own live URL, automatically.

### What you get out of the box

- Push a branch `feature/pricing-copy`: Pages builds it and serves it at `https://feature-pricing-copy.<project>.pages.dev`.
- Open a PR against `main` (or `develop`): Cloudflare posts a comment with the preview URL.
- Merge / close the PR: preview stays live for 7 days, then auto-deletes.

### Control which branches get previewed

Pages project → **Settings** → **Builds & deployments** → **Preview branches**:

- **All non-production branches** (default) — every push to any branch triggers a preview. Simple.
- **Custom** — only branches matching a pattern (`feature/*`, `fix/*`) trigger. Recommended if you have noisy branches you don't want to deploy.

### Gotcha: preview builds use **Preview** env vars

If a preview build needs the Google Maps dev key (not the prod key), make sure `GOOGLE_MAPS_API_KEY` is set for **Preview** scope with the dev key value (not prod). Otherwise the preview build either fails (if the var is missing) or leaks the prod key to `*.pages.dev` URLs (if you copied prod value to Preview scope).

### Review workflow

Paste the preview URL into the PR description. On a mobile-first product, the reviewer should also open the URL on a real phone — the preview URL is HTTPS with a valid cert, so no localhost-over-LAN workarounds needed.

---

## 11. Rollback in under 60 seconds

Pages keeps every deploy. Rollback is a UI click, not a git revert.

### Emergency rollback (prod is broken right now)

1. Pages project → **Deployments** tab.
2. Find the last known-good production deploy (look for the green dot + "Production" badge in the list).
3. Click **⋯** → **Rollback to this deployment**.
4. Confirm. Takes ~10 seconds. The rolled-back version is live globally.

### Important caveats

- Rollback does **not** revert git history. Your bad commit is still on `main`. Fix it properly by reverting the commit or pushing a hotfix.
- Rollback does **not** reset environment variables. If the outage was caused by an env var change, you also need to revert that via **Settings** → **Environment variables** → **Edit** → change value → **Save and redeploy**.
- Rollback changes **production** only. Previews are independent.

### Tested once means trusted

Do one intentional rollback in your first week — push a deliberate "BROKEN" commit, watch prod break, roll back, watch prod recover. Takes 5 minutes. The muscle memory at 2 AM with a real outage is priceless.

---

## 12. Common failures and how to fix them

### 12.1 "Build failed: Cannot find package.json"

- **Cause:** Root directory is blank. Pages is running `npm ci` at the repo root where there's no `package.json`.
- **Fix:** Settings → Builds & deployments → **Root directory** = `frontend`.

### 12.2 "Build succeeded but site shows 404 / blank"

- **Cause:** Build output directory is wrong. Most commonly set to `dist/` or `dist/frontend/` when it should be `dist/frontend/browser/`.
- **Fix:** Settings → Builds & deployments → **Build output directory** = `dist/frontend/browser`. Redeploy.

### 12.3 "Node version too low" or cryptic ESM errors

- **Cause:** Pages defaulted to an older Node. Angular 21 requires 20.19+ or 22.
- **Fix:** Environment variables → `NODE_VERSION=22`. Redeploy.

### 12.4 Routes return 404 when visited directly

- **Cause:** Not enough routes are prerendered. Users see a 404 for `/booking` even though `/` and `/map` work.
- **Diagnosis:** Look at `frontend/src/app/app.routes.server.ts`. With `{ path: '**', renderMode: RenderMode.Prerender }`, all discoverable routes should prerender. If some are missing, check the build log — look for "Prerendered N static routes" and verify N matches the route count.
- **Fix (temporary):** Add a `_redirects` file at the output root with `/* /index.html 200` to make Pages fall back to the SPA index. Not recommended long-term because it breaks SEO for unprerendered routes.

### 12.5 "GOOGLE_MAPS_API_KEY is undefined" at runtime

- **Cause:** The env var was set for the build process but not injected into the bundle. Angular bundles are frozen at build time; `process.env` doesn't exist in the browser.
- **Fix:** Implement the `prebuild` substitution script (§7 Pattern A). Without it, the env var is invisible to the running app.

### 12.6 Preview deploys use the production key

- **Cause:** The `GOOGLE_MAPS_API_KEY` env var was set with scope "Production and Preview" to the same value.
- **Fix:** Remove it and re-add twice — once for **Production** with the prod key, once for **Preview** with the dev key. These are two separate entries in the Pages env-var UI even though they share a name.

### 12.7 Deploy takes 15+ minutes

- **Cause:** `npm install` (not `npm ci`) was used, or the lockfile drifted.
- **Fix:** Build command = exactly `npm ci && npm run build`. Commit any `package-lock.json` drift immediately.

### 12.8 "Failed to fetch deployment" in the GitHub PR comment

- **Cause:** Cloudflare's GitHub app access was revoked, or the GitHub secret rotated.
- **Fix:** <https://github.com/settings/installations> → Cloudflare Pages → Configure → re-grant access to the repo.

---

## 13. Cost monitoring and quota headroom

On the **Free tier**, you get:

| Metric                        | Free tier limit            | Our current usage (Phase 1 projection)  |
|-------------------------------|----------------------------|-----------------------------------------|
| Requests                      | **Unlimited**              | —                                       |
| Bandwidth                     | **Unlimited**              | —                                       |
| Builds per month              | 500                        | ~20–50 (one per merged PR + main pushes) |
| Build minutes per month       | Uncapped on free           | ~10 min/build × 50 builds = ~500 min    |
| Custom domains per project    | Unlimited                  | 2 (apex + www)                          |
| Preview deployments           | Unlimited                  | ~5–10 active at a time                  |
| Concurrent builds             | 1                          | 1                                       |

**You will not hit any limit** in Phase 1. The 500 builds/month is the only realistic ceiling, and you'd have to merge 17 PRs *per day* to run out.

### Set up basic monitoring

- **Email alerts** for failed builds: Account → Notifications → Add → "Pages build failed".
- **Weekly traffic check**: Pages project → **Analytics** → **Traffic**. Eyeball this once a week for traffic spikes you can't explain (could be bot traffic, bad actors, or — optimistically — organic growth).

---

## 14. When to migrate to Cloudflare Workers Static Assets

Cloudflare launched **Workers Static Assets** (2024) as a newer alternative to Pages. It gives you:

- Co-deployment of static assets + Workers code in one bundle (useful when you want dynamic edge functions alongside static hosting).
- Finer control over caching, rewrites, and asset serving.
- Slightly faster cold-start for the dynamic bits.

**For this project right now, Pages is the right choice** because:

- We're serving **fully static prerendered HTML**. There's no dynamic edge function to justify the complexity.
- The Pages UI gives us the GitHub integration, PR previews, and rollback out of the box. Workers Static Assets require the same via Wrangler config.
- Pages is older and more battle-tested. Workers Static Assets still has rough edges as of late 2025.

**Consider migrating** only when:

- You add a backend-for-frontend API that should run at the edge (e.g. `/api/quote` that proxies to the .NET backend with request-coalescing and rate limiting).
- You need request-time A/B testing or geographic redirects that can't be done at build time.
- Pages' GitHub integration breaks something the team relies on.

Until then, stay on Pages. Migration, if needed, is straightforward: both services read from the same `dist/frontend/browser/` output.

---

## 15. Appendix: the 5-minute redeploy checklist

If you're setting up a new Pages project from scratch (fresh account, fresh repo), this is the speed-run:

1. Sign up at <https://dash.cloudflare.com/sign-up>. Enable 2FA.
2. Workers & Pages → Create → Pages → Connect to Git → GitHub → install app on your org.
3. Select repo → Begin setup.
4. Project name: `wheelchair-taxi-pro`. Production branch: `main`.
5. Build config:
   - Framework: **Angular (SSR)** (or None).
   - Build command: `npm ci && npm run build`.
   - Output directory: `dist/frontend/browser`.
   - Root directory (advanced): `frontend`.
6. Environment variables:
   - `NODE_VERSION=22` (Production + Preview).
   - `GOOGLE_MAPS_API_KEY=<prod>` (Production only).
   - `GOOGLE_MAPS_API_KEY=<dev>` (Preview only).
7. Save and Deploy. Wait 3–6 min.
8. Visit the `*.pages.dev` URL. Verify `/` redirects to `/map` and `view-source` shows real HTML.
9. Custom domains → Add `wheelchairtaxipro.com` and `www.wheelchairtaxipro.com`. Wait for SSL.
10. Done. Every future push to `main` auto-deploys. Every PR gets a preview URL.

**Commit this PR. Your first production URL is live.**

---

## Where this intersects with the rest of the project

- Decision rationale for choosing Pages → [`hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md`](./hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md) (sibling article).
- Secret management for `GOOGLE_MAPS_API_KEY` → [`google-maps-setup-notes.local.md`](../../google-maps-setup-notes.local.md) §3.
- Deployment architecture (which runs where) → [`docs/design/07-deployment-view.md`](../design/07-deployment-view.md) — this article is the source material for the stub once you flesh it in.
- GitFlow branching and what deploys where → [`CONTRIBUTING.md`](../../CONTRIBUTING.md) §5.
- Architecture Decision Record capturing this hosting choice → [`docs/design/adr/0007-host-frontend-on-cloudflare-pages.md`](../design/adr/0007-host-frontend-on-cloudflare-pages.md) — stub already in the skeleton.

---

## Further reading

- Cloudflare Pages docs — <https://developers.cloudflare.com/pages/>
- Cloudflare Pages monorepo setup — <https://developers.cloudflare.com/pages/configuration/monorepos/>
- Angular SSR / prerendering — <https://angular.dev/guide/ssr>
- Workers Static Assets (the potential future migration target) — <https://developers.cloudflare.com/workers/static-assets/>

---

*Last updated: 2026-04-19*
