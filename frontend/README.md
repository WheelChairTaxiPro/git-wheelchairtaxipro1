# Frontend

Angular 21 PWA for **Wheelchair Taxi Pro** (booking, map, pricing, FAQ, about). Generated with [Angular CLI](https://github.com/angular/angular-cli) 21.2.7.

## Prerequisites

- **Node.js** 20.19+ or **22 LTS** — [nodejs.org](https://nodejs.org/)
- **npm** (included with Node)

```bash
node --version   # v20.19+ or v22.x
```

All commands below assume your shell is in the **`frontend/`** directory:

```bash
cd frontend
```

## Getting started (clean → install → run)

### 1. Clean (optional — fresh start)

Remove dependencies, build output, and Angular cache:

```bash
# macOS / Linux / Git Bash
rm -rf node_modules dist .angular
```

```powershell
# Windows PowerShell
Remove-Item -Recurse -Force node_modules, dist, .angular -ErrorAction SilentlyContinue
```

To clear only build artifacts (keep `node_modules`):

```bash
rm -rf dist .angular
```

### 2. Google Maps API key

Map and booking place search need a key at build/start time.

```bash
cp .env.example .env.local
```

Edit `frontend/.env.local` (gitignored — never commit):

```text
GOOGLE_MAPS_API_KEY=your_key_here
```

`npm start` and `npm run build` run `scripts/write-google-maps-config.mjs`, which reads `.env.local` and generates `src/app/core/config/google-maps.generated.ts`.

### 3. Install dependencies

**Reproducible install** (recommended after a clean, or to match CI / `package-lock.json` exactly):

```bash
npm ci
```

`npm ci` removes `node_modules` and installs from the lockfile only — faster and stricter in automation. Cloudflare Pages builds should use `npm ci && npm run build` (see deploy runbook).

**Day-to-day dev** (when adding or upgrading packages and updating the lockfile):

```bash
npm install
```

Commit `package-lock.json` after dependency changes so `npm ci` stays in sync.

### 4. Run locally (development)

```bash
npm start
```

This runs `prestart` (Maps config) then `ng serve`. Open **http://localhost:4200/** — the app reloads when you save source files.

Equivalent:

```bash
ng serve
```

### Quick copy-paste (clean install + dev server)

```bash
cd frontend
rm -rf node_modules dist .angular    # omit if not doing a full reset
npm ci
npm start
```

(Ensure `.env.local` exists with `GOOGLE_MAPS_API_KEY` before `npm start`.)

## Building

| Command | Purpose |
|---------|---------|
| `npm run build` | Default production build |
| `npm run build:kkleung` | Production + **K.K. Leung** contact manifest (usual deploy) |
| `npm run build:jameslo` | Production + **James Lo** contact manifest |
| `npm run watch` | Development build with watch mode |

`prebuild` runs the Google Maps config script before each build.

```bash
npm run build:kkleung
```

Output:

```text
dist/frontend/browser/
```

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Deploying to Cloudflare Pages

Production frontend hosting is **Cloudflare Pages** (project name: `wheelchairtaxipro`, public URL: <https://wheelchairtaxipro.pages.dev>, target custom domain: `wheelchairtaxipro.com`). Full background, monorepo build config, per-PR previews, custom domain setup, and rollback steps are documented in the sibling runbook: [`docs/LearningNotes/deploying-an-angular-pwa-to-cloudflare-pages.md`](../docs/LearningNotes/deploying-an-angular-pwa-to-cloudflare-pages.md).

### Deploy from the CLI (Wrangler)

For a fast deploy without Git integration, use Cloudflare's Wrangler CLI. Build first, then push the static output straight to Pages:

```bash
# Requires frontend/.env.local with GOOGLE_MAPS_API_KEY=... (see Getting started)
npm run build:kkleung
npx wrangler pages deploy dist/frontend/browser --project-name=wheelchairtaxipro --branch=main --commit-dirty=true
```

Wrangler prints a per-deploy preview URL and updates the production alias (`https://wheelchairtaxipro.pages.dev`) automatically.

**Stable branch-style URL** (e.g. `https://kkleung.wheelchairtaxipro.pages.dev`): use a Git branch named `kkleung`, or pass `--branch=kkleung` on the deploy command instead of `main`. See [`docs/LearningNotes/cloudflare-pages-multi-operator.md`](../docs/LearningNotes/cloudflare-pages-multi-operator.md) §1 for production vs preview (SEO) behaviour.

**First time only** — authenticate against Cloudflare once:

```bash
npx wrangler login
```

This opens a browser window for OAuth. Log in with the Cloudflare account that owns the `wheelchairtaxipro` Pages project and click **Allow**. The token is cached locally, so subsequent deploys do not prompt again.

### Build output layout

`npm run build` uses `outputMode: "static"` (configured in `angular.json`) and produces:

```text
dist/frontend/browser/        ← upload this folder to Cloudflare Pages
├── index.html                ← prerendered app shell (not a redirect stub)
├── main-*.js / polyfills-*.js
├── ngsw-worker.js            ← PWA service worker
└── manifest.webmanifest
```

The root `index.html` must be the prerendered app shell, **not** a meta-refresh redirect. A redirect stub at the root combined with the PWA service worker causes an infinite navigation loop.

### Clearing a stale service worker after deploy

Angular's service worker caches the previous app shell aggressively. After deploying a build that changes routing or `index.html`, clients on an older version can see flashing or stale content until the worker updates. Two ways to verify a fresh deploy:

- **Incognito window** — opens without the cached service worker, so you always hit the new deploy.
- **Manually clear in a normal window** — DevTools → **Application** → **Service Workers** → **Unregister**, then **Storage** → **Clear site data**, then reload.

## Running tests

| Command | Purpose |
|---------|---------|
| `npm test` | Unit tests ([Vitest](https://vitest.dev/)) |
| `npm run e2e` | End-to-end tests ([Playwright](https://playwright.dev/)) |
| `npm run e2e:ui` | Playwright UI mode |
| `npm run e2e:report` | Open last Playwright HTML report |

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
