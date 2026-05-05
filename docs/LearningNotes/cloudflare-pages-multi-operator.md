# Two Cloudflare Pages sites (K. K. Leung vs James Lo lines)

This frontend can produce **two builds** with **different `tel:` / WhatsApp** numbers:

| Build | Command | Phone | `wa.me` digits |
|-------|---------|-------|----------------|
| **K. K. Leung** (default production) | `npm run build` or `npm run build:kkleung` | `+85296488582` | `85296488582` |
| **James Lo** | `npm run build:jameslo` | `+85293281777` | `85293281777` |

Mechanism: **`contact.manifest.ts`** is replaced at compile time by **`production-jameslo`** via `angular.json` → **`contact.manifest.jameslo.ts`**.

### Google Maps API key (build-time)

The map loader reads **`GOOGLE_MAPS_API_KEY`** from a generated file created by **`npm run prebuild`** (`scripts/write-google-maps-config.mjs`). The key is **baked into the JS at build time** — it is not read from Cloudflare at runtime.

- **`build:kkleung` / `build:jameslo`** run **`prebuild`** first so CI and local installs always regenerate that file before `ng build`.
- **Local Wrangler builds:** copy `frontend/.env.example` → **`frontend/.env.local`**, paste the key (**gitignored**), then run **`npm run build:kkleung`**. The prebuild script also reads **`frontend/.env`** if present (`.env.local` wins over `.env` when both define the key).
- In Cloudflare Pages → **Settings** → **Environment variables**, define **`GOOGLE_MAPS_API_KEY`** for **Production** and (if previews need maps) **Preview**. Same name the script expects when `npm ci` runs your build command.
- In Google Cloud Console, the key’s **HTTP referrer** restrictions must allow your origins, e.g. `https://wheelchairtaxipro.pages.dev/*`, `https://*.wheelchairtaxipro.pages.dev/*` (branch aliases), plus any custom domains.

If the var is missing at build time, the site deploys successfully but the map route shows the **setup / missing key** state.

---

## 1. URLs like `kkleung.wheelchairtaxipro.pages.dev`

Cloudflare **does not** let you type an arbitrary label in the dashboard. It **does** give you **`{branch}.{project}.pages.dev`** as a **branch alias** when the deployment is tied to a Git branch (or Wrangler `--branch`).

- Project **`wheelchairtaxipro`** → **`https://wheelchairtaxipro.pages.dev`** is the **production** URL for whatever your **production branch** is (e.g. `main`).
- Branch **`kkleung`** on that same project → alias **`https://kkleung.wheelchairtaxipro.pages.dev`** always tracks the **latest deployment for that branch** (see [Preview aliases](https://developers.cloudflare.com/pages/configuration/preview-deployments/#preview-aliases)).

Each deploy also gets a unique hash host like **`https://744ff93c.wheelchairtaxipro.pages.dev`**. Pages **does not** combine hash + branch into one hostname (there is **no** `https://744ff93c.kkleung.wheelchairtaxipro.pages.dev`).

Branch names are lowercased; non-alphanumeric characters become hyphens (e.g. `fix/api` → `fix-api`).

### How to use `kkleung.wheelchairtaxipro.pages.dev`

**Git-connected Pages:** create a branch named **`kkleung`**, push it, and let Pages build. After a successful deploy, open **`https://kkleung.wheelchairtaxipro.pages.dev`**.

**Wrangler (no Git push):** pass the branch name explicitly:

```bash
cd frontend
npm run build:kkleung
npx wrangler pages deploy dist/frontend/browser --project-name=wheelchairtaxipro --branch=kkleung --commit-dirty=true
```

Wrangler’s success output should list the alias **`https://kkleung.wheelchairtaxipro.pages.dev`** (along with a hash URL).

### Production vs preview (SEO)

- Deployments built from branches that are **not** your project’s **production branch** are **preview** deployments; Cloudflare sends **`X-Robots-Tag: noindex`** so search engines skip them ([preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)).
- If **`kkleung`** must be the **indexed** canonical site, either set **`kkleung`** as the **production branch** in Pages (**Settings → Builds → Production branch**) so **`https://wheelchairtaxipro.pages.dev`** serves that branch, and treat the subdomain alias as a convenience URL, **or** use a **custom domain** (below).

### Alternative: two projects (James on a second `*.pages.dev`)

If two operators each need their own apex `*.pages.dev` without juggling production vs preview semantics:

1. Pages project **`wheelchairtaxipro-kkleung`** → `https://wheelchairtaxipro-kkleung.pages.dev` — build **`npm run build:kkleung`**.  
2. Pages project **`wheelchairtaxipro-jameslo`** → `https://wheelchairtaxipro-jameslo.pages.dev` — build **`npm run build:jameslo`**.

### Custom subdomain on your own zone (ideal branding)

If you control **`wheelchairtaxipro.com`** (or `.hk`, etc.) in Cloudflare DNS, add hostnames such as **`kkleung.wheelchairtaxipro.com`** and point them at **`kkleung.wheelchairtaxipro.pages.dev`** per [Add a custom domain to a branch](https://developers.cloudflare.com/pages/how-to/custom-branch-aliases/). That gives a memorable URL without relying only on **`pages.dev`** rules.

---

## 2. Cloudflare Pages dashboard — per project

For **each** project:

| Setting | K. K. Leung project | James Lo project |
|---------|---------------------|------------------|
| **Build command** | `npm run build:kkleung` (monorepo: `cd frontend && npm run build:kkleung`) | `npm run build:jameslo` |
| **Build output dir** | e.g. `frontend/dist/frontend/browser` | same |
| **Root** | Repo root vs `frontend` per your Pages config | same |

Ensure **environment variables** (e.g. `GOOGLE_MAPS_API_KEY`) include **every hostname** each site uses in the Google Maps key HTTP referrer allowlist.

---

## 3. Sanity check locally

```bash
cd frontend
npm run build:kkleung
grep -R "96488582" dist/frontend/browser/*.js || true

npm run build:jameslo
grep -R "93281777" dist/frontend/browser/*.js || true
```

Booking + contact strip both read **`DEFAULT_CONTACT_CHANNELS`** from `contact.config.ts`, which resolves from the manifest swap.
