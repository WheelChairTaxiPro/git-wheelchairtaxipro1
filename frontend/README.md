# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Deploying to Cloudflare Pages

Production frontend hosting is **Cloudflare Pages** (project name: `wheelchairtaxipro`, public URL: <https://wheelchairtaxipro.pages.dev>, target custom domain: `wheelchairtaxipro.com`). Full background, monorepo build config, per-PR previews, custom domain setup, and rollback steps are documented in the sibling runbook: [`docs/LearningNotes/deploying-an-angular-pwa-to-cloudflare-pages.md`](../docs/LearningNotes/deploying-an-angular-pwa-to-cloudflare-pages.md).

### Deploy from the CLI (Wrangler)

For a fast deploy without Git integration, use Cloudflare's Wrangler CLI. Build first, then push the static output straight to Pages:

```bash
# Optional: frontend/.env.local with GOOGLE_MAPS_API_KEY=... (copy from .env.example)
npm run build
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

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
