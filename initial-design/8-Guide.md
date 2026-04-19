# Wheelchair Taxi Pro — Application Setup Guide

This guide consolidates setup steps from the project plan (`1-project-plan.md`), bilingual proposals (`2`, `5`, `6`), client discovery notes (`3`, `4`), the implementation breakdown (`7`), and architecture considerations (`DiscussArchitectures.md`). Proposal PDFs **5** and **6** match the markdown versions listed here.

**Official domain (planned):** `wheelchairtaxipro.com`  
**Facebook:** https://www.facebook.com/wheelchairtaxipro  
**Branding asset (logo):** use the generated logo file in the repo or copy from  
`C:\Users\harry\.cursor\projects\c-Users-harry-MyWorks-git-brickwareharry-WheelChairTaxiPro\assets\c__Users_harry_MyWorks_git-brickwareharry_WheelChairTaxiPro_Gemini_Generated_Image_c98eksc98eksc98e__2_.png`  
(or the original `Gemini_Generated_Image_c98eksc98eksc98e (2).png` if stored beside this project).

---

## 1. What you are building

### 1.1 Business goals

- More real bookings and enquiries (calls, WhatsApp, forms).
- Less wasted ad spend through better tracking and traffic-quality signals.
- Long-term **SEO** and visibility (Google Search, Maps, AI-style answers) for the Hong Kong wheelchair taxi market.

### 1.2 MVP capabilities (from proposals + first-step plans)

| Area | Capability |
|------|------------|
| Contact | One-tap **phone**, **WhatsApp** (and optionally LINE / WeChat). |
| Booking | Simple enquiry/booking form with validation. |
| Location | Browser geolocation + maps to help pickup/destination (user consent). |
| PWA | Installable web app (`ng add @angular/pwa` path). |
| Ads / analytics | **GCLID** capture, **GA4**, conversion events (calls, WhatsApp, submits). |
| Protection | Rate limiting, bot/spam mitigation (e.g. Cloudflare, Turnstile), optional IP logging on API. |
| SEO | Meta tags, structured data, sitemap; GBP and content strategy per project plan. |

### 1.3 Primary stack (Angular — you do not need Next.js)

**Proposals 5 / 6** and **`7`** define the platform as **Angular (PWA)** + **.NET Web API** + **Google Maps**. That is the **default** path in this guide.

`1-project-plan.md` mentions **Next.js** or **Astro** as one possible way to ship an SEO-heavy marketing site. That is **optional**. You can meet the same SEO goals **entirely in Angular** by using **prerendering** and/or **server-side rendering (SSR)** (`@angular/ssr`), plus metadata, structured data, and sitemaps (see **§5.9**).

**Optional later:** A **separate** small site (Next.js, Astro, or another stack) on another domain is only needed if you *deliberately* want a second property for keyword experiments—not because Angular requires it.

### 1.4 Hosting without Microsoft Azure

This guide assumes you **do not** use **Azure**. You need: (1) a place for the **Angular** build (static or SSR), (2) optionally a **.NET Web API**, (3) optionally **PostgreSQL** (or SQLite for tiny workloads), (4) **DNS + CDN + WAF**—**Cloudflare** in front of everything is a strong default (see **§8**).

**Quick map:**

| Layer | Typical providers |
|--------|-------------------|
| Angular **static / prerender** | Cloudflare Pages, Netlify, Vercel (static), GitHub Pages |
| Angular **SSR** (Node) | Railway, Render, Fly.io, DigitalOcean App Platform, VPS + Docker |
| **.NET Web API** | Railway, Render, Fly.io, DigitalOcean, Google Cloud Run, AWS Lightsail/ECS, VPS + Docker |
| **SQL** | SQLite (single-node), Postgres on PaaS, Neon, Supabase, Railway/Render DB add-ons |
| **Errors / uptime** | Sentry, Better Stack, UptimeRobot, host-native logs |

The rest of **§1.5** goes provider-by-provider. **Prices change**—treat dollar ranges as rough order-of-magnitude and confirm on each vendor’s site.

### 1.5 Hosting options in detail (no Azure)

#### 1.5.1 How to choose

1. **Angular delivery model**
   - **Prerender or pure static (`ng build`)** → use a **static host** (§1.5.2). Easiest + cheapest; best fit with **Cloudflare Pages** if you already use Cloudflare for DNS, Turnstile, and WAF.
   - **SSR (`@angular/ssr`, Node server)** → you need a **long-running Node** process (§1.5.3). More moving parts; use when you must render per-request and cannot list all routes at build time.

2. **API**
   - **No API at first** → form posts to **email** (Edge Function / third-party form backend) is possible, but **Turnstile verification** and **GCLID/booking persistence** are safer with a real **.NET** (or minimal Node) backend (§1.5.4).

3. **Operations appetite**
   - **Managed PaaS** (Railway, Render, Fly.io, DigitalOcean App Platform): you ship a **Dockerfile** or use buildpacks; the platform runs containers, TLS, and often rolling deploys.
   - **VPS** (DigitalOcean Droplet, Linode, Vultr, Hetzner, etc.): you install **Docker** (or systemd + Kestrel), **Caddy** or **nginx**, and **updates**—lower monthly cost at higher admin time.

4. **Region**
   - Users are mainly **Hong Kong**. No host guarantees an HK datacenter for every product; choose **Singapore / Tokyo / Taiwan** regions when offered for **API + SSR** to reduce latency. **Static assets** are cached at **CDN edge** (Cloudflare, etc.), so first-load performance is usually good globally.

#### 1.5.2 Angular static site & prerender (CDN / JAMstack)

| Provider | What you get | .NET API on same product? | Free / entry tier | Notes |
|----------|----------------|---------------------------|-------------------|--------|
| **Cloudflare Pages** | Git-connected builds, preview URLs, env vars for **build**, global CDN, easy custom domain on Cloudflare DNS | No (API is separate—point `api.` to PaaS) | Generous free tier for personal/small projects | Matches **Turnstile + WAF + DNS** in one account. **Not** for Node SSR unless you use a different product (e.g. Workers + complex setup). |
| **Netlify** | Static + **serverless functions** (Node/Go) for tiny backends; split testing | Functions ≠ full .NET; API still usually separate | Free tier with limits | Simple UI; good for marketing static sites. |
| **Vercel** | Static and framework-optimized hosting; great for Next.js; Angular **static** build works | Same as Netlify—.NET API elsewhere | Free hobby tier | Use if you already standardize on Vercel. |
| **GitHub Pages** | Pure static from a branch or GitHub Actions artifact | API separate | Free for public repos | Minimal features; fine for a brochure site. |

**Practical detail (Pages-style hosts):** Build command is your CI step (`ng build` with prerender if configured). **Output folder** is `dist/<project>/browser` (confirm after first local build). Set **environment** variables in the host UI for **public** keys only (`apiUrl` base URL, Maps browser key, GA4 ID, Turnstile **site** key). **Never** put DB passwords or Turnstile **secret** in the frontend build.

#### 1.5.3 Angular SSR (Node server)

You run `node dist/.../server/server.mjs` (or the path your Angular version generates) behind HTTPS.

| Provider | Model | Good for | Caveats |
|----------|--------|----------|---------|
| **Railway** | Project → service from **Dockerfile** or Nixpacks; env vars; optional Postgres | Fast MVP, predictable “just run my container” | Usage-based billing—set **spend alerts** |
| **Render** | **Web Service** (Docker or native build) | Simple always-on or free tier that **spins down** when idle | Free web services **cold start** after sleep—not ideal for SSR if you need instant TTFB |
| **Fly.io** | Docker to **fly machines**; pick **region** (`sin`, `nrt`, etc.) | Latency-sensitive SSR near Asia | Slightly steeper CLI learning curve |
| **DigitalOcean App Platform** | Managed containers from repo or image | Teams wanting DO billing + support | Cost mid-range vs raw Droplet |
| **VPS + Docker** | You run **Docker Compose**: Node SSR + optional Caddy | Lowest $/month at scale, full control | You patch OS, renew TLS unless Caddy, handle backups |

**Detail:** Expose the port the platform injects (`PORT` env) or **8080**; Angular SSR docs show how to bind. Put **Cloudflare** in front (orange-cloud **proxied** DNS) for DDoS/WAF; use **Full (strict)** SSL if origin has a valid cert.

#### 1.5.4 .NET Web API (Linux)

Prefer **Linux + Kestrel** in production. Options:

| Provider | How .NET runs | Typical setup | Notes |
|----------|----------------|---------------|--------|
| **Railway / Render / Fly.io** | **Dockerfile** `FROM mcr.microsoft.com/dotnet/aspnet:8.0` + published DLLs | Multi-stage build: `dotnet publish -c Release -o /app` then `ENTRYPOINT ["dotnet","YourApi.dll"]` | Set `ASPNETCORE_URLS=http://0.0.0.0:$PORT` if the platform assigns `PORT` |
| **Google Cloud Run** | Container per revision; **scale to zero** possible | Build image → push to Artifact Registry → deploy; set **min instances** if you hate cold starts | Pay per request + CPU time; good for **low/spiky** traffic APIs |
| **AWS Lightsail** | **Container** service or small **VM** | Simplest AWS path for one API | Fixed monthly bundles |
| **DigitalOcean Droplet** | VM + **Docker** or systemd | Install Docker, run `docker run -p 8080:8080`, or Compose with API + DB | Use **UFW** + SSH keys; automate OS updates |
| **Hetzner / Vultr / Linode** | Same as DO Droplet | Budget VPS | Often cheaper compute; you operate everything |

**Shared rules:** Configure **CORS** for your real Angular origin(s). Enable **forwarded headers** so your rate-limit sees the **client IP** when Cloudflare proxies traffic. Store **Turnstile secret** and **DB connection** only in server env.

#### 1.5.5 Databases & persistence

| Option | When to use | Detail |
|--------|-------------|--------|
| **SQLite** | Single API instance, low concurrency, backups copied with volume | Simplest file DB; mount a **persistent volume** on PaaS/VPS; not ideal for multi-instance without care |
| **Postgres (same PaaS)** | Railway/Render **add-on** Postgres | Managed backups/patches on that tier; one bill |
| **Neon** | Serverless Postgres, branching for previews | Connection string in API env; good with **Cloud Run** / small APIs |
| **Supabase** | Postgres + optional Auth/Storage | Use **only Postgres** if you do not need Supabase Auth |
| **Self-hosted Postgres on VPS** | Cost control, you run backups | Docker volume + nightly `pg_dump` off-box |

#### 1.5.6 DNS, CDN, and edge security (usually Cloudflare)

Even if the **site** is on Netlify/Vercel, you can still use **Cloudflare** as **DNS only** (“grey cloud”) or **proxied** (“orange cloud”) depending on whether that host allows it. For **Cloudflare Pages**, DNS stays on Cloudflare.

- **Turnstile** and **WAF** rules (§8) attach to your domain on Cloudflare.
- **Caching:** Static Angular assets are **immutable hashed filenames**—safe to cache long. **HTML** for prerendered routes: use shorter cache or **revalidate** if you use edge caching rules.

#### 1.5.7 Example stacks (copy one as a starting point)

| Profile | Frontend | API | DB | Approx. ops |
|---------|----------|-----|-----|-------------|
| **Minimal cost** | Cloudflare Pages (static/prerender) | Render **free** web service (Docker .NET) *or* delay API and use email-only MVP | SQLite on volume *or* none | Low |
| **Balanced MVP** | Cloudflare Pages | Railway or Fly.io **Docker** .NET in `sin`/`nrt` | Railway Postgres or Neon | Low–medium |
| **You like one bill** | DigitalOcean App Platform static + App Platform API | same account | DO managed Postgres | Low |
| **Maximum control / lowest compute $** | Cloudflare Pages | .NET in **Docker** on a **single VPS** + Caddy | Postgres in Docker Compose on same VPS | High |

#### 1.5.8 Vultr (Hong Kong) — VPS hosting (website + API)

**Best for:** lowest latency to Hong Kong users + full control.

**What you typically run on the VPS:**

- **Caddy** as reverse proxy + automatic TLS (Let’s Encrypt) + HTTP→HTTPS redirects
- **Angular static build** served by Caddy
- Optional: **.NET API** container (Kestrel)
- Optional: **Postgres** container (or use managed Postgres elsewhere)

**Pros**

- Hong Kong region (low latency)
- One server can host both website + API

**Cons**

- You own server ops (patching, firewall, backups, monitoring)
- Scaling is manual (or requires more infrastructure)

#### 1.5.9 DigitalOcean (Singapore) — VPS hosting (website + API)

**Best for:** simple, reliable VPS ops with a nearby region (Singapore) if HK region isn’t needed.

Same architecture as Vultr VPS: Caddy + Angular static + optional API + optional DB.

#### 1.5.10 Step-by-step: set up a VPS host (Vultr HK or DigitalOcean Singapore)

This runbook sets up a single VPS to host:

- `wheelchairtaxipro.com` (Angular static site)
- `api.wheelchairtaxipro.com` (.NET Web API)

It assumes **Ubuntu 24.04 LTS** and uses **Docker + Docker Compose + Caddy**.

##### A) Create the server

1. Create a VPS:
   - **Vultr**: choose **Hong Kong**
   - **DigitalOcean**: choose **Singapore**
2. Pick Ubuntu 24.04 LTS.
3. Add your **SSH public key** (recommended). Avoid password-only SSH.
4. Create DNS records (Cloudflare recommended):
   - **A** `@` → your server IPv4
   - **A** `www` → your server IPv4
   - **A** `api` → your server IPv4
   - Set records to **Proxied** (orange cloud) once everything works; start grey-cloud if debugging.

##### B) First login + hardening

Run these steps as **root** on a fresh VPS (replace `YOUR_SERVER_IP`).

SSH in:

```bash
ssh root@YOUR_SERVER_IP
```

Update packages:

```bash
apt update && apt -y upgrade
```

Create a non-root user and grant sudo (non-interactive alternative to `adduser`):

```bash
useradd -m -s /bin/bash deploy
usermod -aG sudo deploy
```

Set a password for `deploy` **or** install your SSH key under `/home/deploy/.ssh/authorized_keys` before you disable root SSH login.

Set up firewall (allow SSH + web). **Do this from a session that will stay connected**—once `ufw enable` runs, a wrong SSH rule can lock you out.

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

Optional but recommended: restrict SSH (later) to your IP ranges.

##### C) Install Docker + Compose

Install Docker (official Docker Engine packages for Ubuntu):

```bash
apt -y install ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Let the `deploy` user run Docker (still as root):

```bash
usermod -aG docker deploy
```

Log out and back in as `deploy`:

```bash
exit
ssh deploy@YOUR_SERVER_IP
```

##### D) Create app directories

```bash
sudo mkdir -p /opt/wheelchairtaxipro/{caddy,site,api}
sudo chown -R deploy:deploy /opt/wheelchairtaxipro
cd /opt/wheelchairtaxipro
```

##### E) Upload your Angular build

On your local machine, build Angular:

```bash
cd frontend/wheelchair-taxi
ng build --configuration production
```

Copy the build output to the server. **Confirm the folder name** after your first local `ng build` (Angular version / project name affects `dist/.../browser`).

From macOS/Linux:

```bash
scp -r dist/wheelchair-taxi/browser/* deploy@YOUR_SERVER_IP:/opt/wheelchairtaxipro/site/
```

From **Windows PowerShell**, either use the same `scp` (OpenSSH client) with correct paths, or upload with **WinSCP** / **rsync** (WSL).

##### F) Run Caddy + API (Docker Compose)

**Order matters:** use **Compose phase 1** until a real **API image** exists (**§G**). That way `docker compose up -d` never fails on a missing `api` image. After the image is in a registry, switch to **Compose phase 2** and add **Caddyfile phase 2**.

Create `docker-compose.yml` in `/opt/wheelchairtaxipro`.

**Compose phase 1 — Caddy only (use until the API image exists):**

```yaml
services:
  caddy:
    image: caddy:2
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - ./site:/srv/site:ro
      - caddy_data:/data
      - caddy_config:/config

volumes:
  caddy_data:
  caddy_config:
```

**Compose phase 2 — add API** (merge the `api` service below into the same file, or replace the file):

```yaml
services:
  caddy:
    image: caddy:2
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - ./site:/srv/site:ro
      - caddy_data:/data
      - caddy_config:/config

  api:
    image: ghcr.io/YOUR_GITHUB_USER/wheelchairtaxi-api:latest
    restart: unless-stopped
    environment:
      ASPNETCORE_URLS: http://0.0.0.0:8080
      ASPNETCORE_ENVIRONMENT: Production
    expose:
      - "8080"

volumes:
  caddy_data:
  caddy_config:
```

Create `Caddyfile` in `/opt/wheelchairtaxipro`.

**Caddyfile (phase 1 — site only):**

```caddyfile
wheelchairtaxipro.com, www.wheelchairtaxipro.com {
	root * /srv/site
	encode zstd gzip
	handle {
		try_files {path} {path}/ /index.html
		file_server
	}
}
```

**Caddyfile (phase 2 — add API):** append this block once the `api` container is defined in Compose on the **same** Docker network:

```caddyfile
api.wheelchairtaxipro.com {
	reverse_proxy api:8080
}
```

The `handle` + `try_files` + `file_server` block is the usual **SPA fallback**: real files (JS/CSS/images) are served when they exist; otherwise `/index.html` loads so the Angular router can run. If every public URL is a **real prerendered file** on disk, you can simplify to `file_server` only (no `try_files`).

Start (or restart) Compose as `deploy`:

```bash
cd /opt/wheelchairtaxipro
docker compose up -d
```

If Caddy fails to obtain certificates, check: DNS **A** records point to this server, ports **80/443** reach the VPS (provider firewall + `ufw`), and (with Cloudflare) SSL mode **Full (strict)** only after Let’s Encrypt is working on the origin. If your VPS has **IPv6** and you publish **AAAA** records, ensure **80/443** are open for IPv6 too—or omit **AAAA** until you are ready.

##### G) Build & publish the .NET API image

Best practice: build the API image in **CI** and push to a registry (**GHCR**, Docker Hub, etc.).

1. Add a `backend/Dockerfile` that publishes and runs your API (DLL name must match your project, e.g. `WheelchairTaxi.API.dll` if you used `dotnet new webapi -n WheelchairTaxi.API`).
2. Push to e.g. `ghcr.io/<user>/wheelchairtaxi-api:latest`.
3. On the server, log in to the registry if it is private:

```bash
docker login ghcr.io
```

4. Pull and restart:

```bash
cd /opt/wheelchairtaxipro
docker compose pull api
docker compose up -d
```

**Build on the VPS (acceptable for early testing only):** copy the `backend/` folder, run `docker build -t wheelchairtaxi-api:local .` in that directory, then set `image: wheelchairtaxi-api:local` in `docker-compose.yml` (no pull).

##### H) Cloudflare settings checklist (recommended)

- SSL/TLS: **Full (strict)**
- Always Use HTTPS: **On**
- HSTS: enable only after confirming everything works
- Caching: keep default; Angular hashed assets are safe to cache long
- WAF + Turnstile: configure per **§8**

##### I) Backups & updates (VPS responsibility)

- **Weekly OS updates** (or enable unattended upgrades).
- If you run Postgres on the VPS: nightly `pg_dump` to off-server storage.
- Add uptime monitoring on:
  - `https://wheelchairtaxipro.com/`
  - `https://api.wheelchairtaxipro.com/health` (implement `/health` in the API)

#### 1.5.11 Observability (replace Application Insights)

- **Sentry** (or similar): ASP.NET + Angular SDKs for errors and performance samples.
- **Uptime:** Better Stack, UptimeRobot, or Pingdom on `/health` and the public homepage.
- **Logs:** Use your PaaS log drain or **Docker** `json-file` + a collector if self-hosted.

---

## 2. Prerequisites

Install and verify on your machine:

| Tool | Purpose | Notes |
|------|---------|--------|
| **Git** | Version control | SSH or HTTPS to GitHub. |
| **Node.js LTS** | Angular build | Matches Angular’s current requirement (check https://angular.dev). |
| **npm** or **pnpm** | JS packages | pnpm is optional. |
| **Angular CLI** | `ng` commands | `npm install -g @angular/cli` |
| **.NET SDK** (8.x LTS recommended) | Web API | `dotnet --version` |
| **IDE** | VS Code or Visual Studio | C# + Angular extensions as you prefer. |

**Accounts to create (before integration steps):**

- Google Cloud project (Maps, optional Places).
- Google Analytics 4 property + **Google Tag** (or gtag) install path.
- Google Ads account (for **GCLID** + conversion linking).
- Cloudflare account (DNS, Pages, WAF, Turnstile).
- GitHub (or GitLab / other Git) for repo + CI.
- Optional: account on a **.NET-friendly PaaS** or **VPS** when you deploy the API—compare options in **§1.5**.

---

## 3. Repository layout (recommended)

Aligns with `7-wheelchair_taxi_project_task_breakdown_implementation_guide.md`:

```text
wheelchairtaxi-platform/        (example repo name)
├── frontend/                 # Angular PWA
├── backend/                  # .NET Web API
├── docs/                     # Architecture, runbooks (optional)
├── README.md
└── 8-Guide.md                # copy or link from this project’s docs
```

**Backend structure (suggested for MVP):** start simple; if the API grows, prefer **feature folders** or a **hybrid** of vertical slices + shared infrastructure (see `DiscussArchitectures.md` — avoid over-abstracted “god” helpers; extend by adding code rather than inflating shared utilities).

---

## 4. Backend setup (.NET Web API)

### 4.1 Create the API

```bash
mkdir wheelchairtaxi-platform && cd wheelchairtaxi-platform
mkdir backend && cd backend
dotnet new webapi -n WheelchairTaxi.API -o .
```

### 4.2 Baseline configuration

- Enable **Swagger** in Development (template usually includes it).
- Configure **CORS** for your Angular origin(s), e.g. `https://wheelchairtaxipro.com`, `https://www.wheelchairtaxipro.com`, and `http://localhost:4200` for local dev.
- Add **Forwarded headers** if behind a **reverse proxy** (Cloudflare, nginx, PaaS load balancer) so IP-based rate limits are meaningful. When using **Cloudflare “orange cloud”**, also configure **known proxy networks** (or ForwardedHeaders options) so `X-Forwarded-For` is trusted—see [ASP.NET Core forwarded headers](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/proxy-load-balancer) and Cloudflare IP ranges if you whitelist.

### 4.3 MVP endpoints (from doc 7)

- `POST /api/bookings` — accept name, phone, pickup, destination, time; validate server-side.
- Optional: `POST /api/events/contact` — log call/WhatsApp clicks for analytics pipelines (if you do not send everything only from the browser).

### 4.4 Storage / notifications

Phase 1 options:

- Email the booking via **SendGrid**, **Postmark**, **Resend**, or SMTP.
- Store rows in **SQLite** / **PostgreSQL** (including managed Postgres from your PaaS or Neon/Supabase) when you need history and dashboards.

### 4.5 Anti-fraud / abuse (API layer)

From `2-wheelchair_taxi_website_proposal_bilingual.md` and `7`:

- **Rate limiting** per IP (ASP.NET rate limiting middleware or reverse proxy limits).
- Log timestamps + IP + route for suspicious patterns (privacy: disclose in privacy policy; minimize retention).
- Do **not** claim you can stop Google billing per click; use data to tune Ads and Cloudflare rules.

### 4.6 Run locally

```bash
cd backend
dotnet run
```

Default Kestrel URL (adjust in `launchSettings.json`): often `https://localhost:7xxx`.

---

## 5. Frontend setup (Angular PWA)

### 5.1 Create the app

```bash
cd ..
mkdir frontend && cd frontend
ng new wheelchair-taxi --standalone --routing --style=scss
cd wheelchair-taxi
```

### 5.2 Add libraries (as per doc 7)

```bash
ng add @angular/material
ng add @angular/pwa
```

Configure `manifest.webmanifest` (name, short_name, theme_color, icons using your logo exports).

### 5.3 Routing and layout

- Define routes in `app.routes.ts`: e.g. home, services, pricing, FAQ, contact/booking, `/en/...` if you mirror English inside the same app.
- Create a **shell layout** (header/footer with CTAs).

### 5.4 One-click contact

- **Phone:** `tel:+852XXXXXXXX`
- **WhatsApp:** `https://wa.me/852XXXXXXXX` (digits only, country code, no `+`)
- Track **click** events to GA4 (see **§7**).

### 5.5 Booking form

- Reactive forms with validation; on submit call `POST /api/bookings`.
- Include **honeypot** field + **Cloudflare Turnstile** (or reCAPTCHA) token verified server-side when implemented.

### 5.6 Geolocation + Google Maps

1. In Google Cloud Console: enable **Maps JavaScript API** (and **Geocoding** if reverse-geocoding addresses).
2. Restrict API keys (HTTP referrer for browser key; IP for server key if used server-side).
3. Angular: use `@googlemaps/js-api-loader` or official patterns; handle **permission denied** and **inaccurate GPS** (doc 7 edge cases).

### 5.7 Environment configuration

Use `environment.ts` / `environment.prod.ts`:

- `apiUrl` — backend base URL.
- `googleMapsApiKey` — public key (restricted by referrer).
- `gaMeasurementId` — GA4 ID.
- `turnstileSiteKey` — public site key.

Never commit **secrets**; use **CI/CD variables** or your host’s **environment variables** (Railway, Render, Fly.io, etc.) for server keys.

### 5.8 Build

```bash
ng build --configuration production
```

Output is typically `dist/wheelchair-taxi/browser/` (depending on Angular version).

### 5.9 SEO with Angular (no Next.js required)

Client-only SPAs serve thin initial HTML; for competitive SEO (many pages, bilingual IA from `1-project-plan.md`), add **prerender** and/or **SSR**:

| Approach | What it does | Hosting note |
|----------|----------------|----------------|
| **Prerender** | At build time, generate static HTML for a **known route list** (home, 收費, 服務/*, FAQ, 預約, `/en/...`, blog slugs). | Fits **Cloudflare Pages** and other static hosts. Use Angular’s prerender support (`ng build` with prerender config; see current Angular docs for your version). |
| **SSR** | Server renders each request (or cached) so crawlers and social previews get full HTML. | Requires a **Node** runtime—e.g. **Railway**, **Render**, **Fly.io**, **DigitalOcean**, or a **VPS**—not plain static Pages alone. |

**Always (CSR, prerender, or SSR):**

- Set unique **`Title`** and **`Meta`** per route (Angular `Title` / `Meta` services or route data).
- Use real **heading hierarchy** (`h1`, `h2`), semantic HTML, and **`a href`** internal links.
- Inject **JSON-LD** (`LocalBusiness`, `FAQPage`, `BreadcrumbList`, `Service`) per page or layout.
- Ship **`sitemap.xml`** and **`robots.txt`** (build step or SSR route).
- Keep **Core Web Vitals** strong: lazy routes, optimized images, minimal main-thread work.

`1-project-plan.md` lists **Next.js** as an alternative content stack; your **Angular** app can own the same URL structure and SEO work if you prerender/SSR the public routes.

---

## 6. Optional: separate marketing site (Next.js / Astro — doc 1 only)

Use this **only** if you want a **second codebase or domain** for content velocity. It is **not** required for SEO if you follow **§5.9**.

If you still add it:

```bash
npx create-next-app@latest wheelchair-taxi-web --typescript --tailwind --eslint --app --src-dir
```

Then mirror the planned IA (home, 收費, 服務, blog, `/en/...`), add sitemap/metadata/JSON-LD, and deploy to **Vercel** or **Netlify**. Link “Book now” to your **Angular** app URL so the platform stays one place for booking, maps, and PWA.

---

## 7. Google Analytics 4, Google Ads, and GCLID

### 7.1 GA4 property

1. Create a **GA4** property and web data stream for your domain.
2. Install the tag via **gtag.js** or **Google Tag Manager** (GTM is better if marketing edits events).

### 7.2 Preserve GCLID (from doc 2)

- On first landing, read `gclid` from the query string.
- Store in **first-party cookie** or **localStorage** with a short TTL policy.
- On **form submit**, send `gclid` to your API and/or attach to GA4 event params.

### 7.3 Conversions

Mark as key events in GA4:

- `click_call`
- `click_whatsapp`
- `submit_booking_form`

Link **Google Ads** to GA4 and import conversions, or use **Google Ads** conversion tags with consistent naming.

### 7.4 Optional offline conversions

If operations confirm bookings manually, export offline conversions in Ads using hashed phone/email + order time (advanced; document compliance).

---

## 8. Cloudflare, WAF, and Turnstile

From `2-wheelchair_taxi_website_proposal_bilingual.md` and hosting comparison in `5` / `6`:

1. Move **DNS** to Cloudflare for `wheelchairtaxipro.com`.
2. Enable **Bot Fight Mode** / **Super Bot Fight Mode** as appropriate.
3. Add **WAF** rules for obvious abuse patterns.
4. Create a **Turnstile** widget for the booking form; verify token on the API before accepting the booking.
5. Host the Angular build either on **Cloudflare Pages** (CI build + env vars for public `apiUrl` / keys) **or** on your **VPS** behind the same Cloudflare zone (**§1.5.10** — Caddy serves `/srv/site`).

---

## 9. Deployment checklist

### 9.1 Frontend (Cloudflare Pages **or** VPS — Angular)

**Option A — Cloudflare Pages**

1. Connect the GitHub repo to **Cloudflare Pages**.
2. Build command: use your production build; if you **prerender** (§5.9), the build command may include prerender (e.g. `ng build` with prerender enabled—follow Angular docs for your version). Plain CSR:  
   `cd frontend/wheelchair-taxi && npm ci && ng build --configuration production`
3. Output directory: `frontend/wheelchair-taxi/dist/wheelchair-taxi/browser` (verify after first build; prerender output may use the same or a documented subfolder).
4. Add custom domain `wheelchairtaxipro.com` + `www` redirect policy (choose one canonical host).
5. Enforce **HTTPS** (automatic on Cloudflare).

**Option B — VPS (Vultr HK / DigitalOcean Singapore)**  
Follow **§1.5.10**: build locally or in CI, `scp` the `dist/.../browser` output to `/opt/wheelchairtaxipro/site`, Caddy terminates TLS. Set `environment.prod.ts` `apiUrl` to `https://api.wheelchairtaxipro.com` (or your real API host).

If you use **SSR** instead of static prerender, deploy the **Node** server to a **Node-capable host** (**§1.5.3**), not only static Pages or “static-only” VPS unless you add a Node process (not covered by the default Caddy-only VPS runbook).

### 9.2 Backend (.NET Web API — no Azure)

- **Phase 1:** You can delay a long-lived API if bookings go through **email-only** or a **serverless** form handler; otherwise deploy the API early so Turnstile verification and persistence stay server-side.
- **Phase 2 (scale):** Run the same API on a **Linux** container or runtime at your chosen provider (**§1.5.4**): set `ASPNETCORE_ENVIRONMENT`, connection strings, and CORS for your production Angular origin. Add **health checks** and log shipping to your preferred tool (**Sentry**, host logs, etc.).
- **Docker (recommended):** A `Dockerfile` that publishes `dotnet publish -c Release` and runs Kestrel on the port your host expects (`PORT` or `8080`) makes deploys portable across Railway, Render, Fly.io, and VPS.

### 9.3 Post-deploy verification

- [ ] All routes load over HTTPS.
- [ ] CORS allows production origin only (plus localhost in dev).
- [ ] Booking form succeeds end-to-end.
- [ ] GA4 **Realtime** shows events.
- [ ] Test Ads landing URL with `?gclid=test` and confirm persistence + submission payload.
- [ ] Maps loads only on domains allowed by API key restrictions.
- [ ] Lighthouse: performance / accessibility / SEO (doc 1 targets 90+ where applicable).

---

## 10. SEO and local presence (cross-cutting)

These items come mainly from `1-project-plan.md` and proposal V2 (`6`). Implement crawlable HTML for public routes via **§5.9** (prerender/SSR) in Angular.

- **Google Business Profile:** verify, categories, service areas, photos, services with prices, review process.
- **On-page:** unique titles/meta, H1–H3, internal links, bilingual content.
- **Structured data:** LocalBusiness + FAQ + Service + BreadcrumbList.
- **Technical:** sitemap.xml, robots.txt, canonical URLs, 404 page, Core Web Vitals.
- **Secondary site** (optional): separate domain with **rewritten** content—not duplicate—to capture other keywords (can be a second Angular property, or Next.js/Astro per doc 1—**not** required for the primary app).

---

## 11. Content and information you need from the client

Before going live, collect (from `3` / `4`):

- Primary phone, WhatsApp, optional LINE/WeChat IDs.
- Exact **service areas**, **pricing table**, tunnel/extra charges.
- Operating hours, languages supported, fleet photos, license/credential copy for trust sections.
- Legal entity name for **LocalBusiness** schema and GBP.

---

## 12. Implementation order (recommended)

1. **Repo + Angular + .NET** skeleton with health check and CORS (`7`: tasks 1.1–1.3).
2. **Contact buttons** + GA4 events (task 2.1).
3. **Booking form** + API + email or DB (2.3).
4. **Maps + geolocation** (2.2, 2.6).
5. **PWA** polish (2.4).
6. **Turnstile + rate limits** (2.5 + section 8 here).
7. **Deploy** Angular to **Cloudflare Pages** (**§9.1**), another static host (**§1.5.2**), or **VPS + Caddy** (**§1.5.10**); deploy API to **PaaS** or the **same VPS** (**§1.5.4**, **§9.2**). If you ship **SSR** (§5.9), use a **Node** host from **§1.5.3** (extend the VPS runbook beyond Caddy-only static).
8. **SEO** hardening in Angular: **prerender/SSR** (§5.9), JSON-LD, sitemap, blog/content plan (`1`).
9. **Phase 2** features from `7`: multi-driver, dispatch, payments.

---

## 13. Risk notes (from doc 7)

- **Google Maps billing:** set budgets/alerts in Google Cloud.
- **Location denial:** form must still work manually.
- **Ad fraud:** improve signal quality; expectations with the client must stay realistic (`2`).
- **Hosting cost:** **Cloudflare Pages** (often free/low) + a small **PaaS** or **VPS** for the API fits early stage; proposals `5` / `6` Azure cost bands translate roughly to comparable tiers on Railway/Render/Fly.io or a single small VPS.

---

## 14. Related documents in this folder

| File | Role |
|------|------|
| `1-project-plan.md` | SEO phases, IA, KPIs; suggests Next.js/Astro as one option—**Angular + prerender/SSR** can cover the same SEO goals (§5.9). |
| `2-wheelchair_taxi_website_proposal_bilingual.md` | Ads tracking, fraud layers, dashboard optional. |
| `3-wheelchair_taxi_client_first_step_plan.md` | Discovery questions, MVP scope. |
| `4-wheelchair_taxi_first_plan_enhanced.md` | Conversion tracking + SEO/AI visibility. |
| `5` / `6` (md) | Platform features, timelines; list Azure among hosts—this guide uses **non-Azure** targets (**§1.4–§1.5**). |
| `7-wheelchair_taxi_project_task_breakdown_implementation_guide.md` | Task-level dev order. |
| `DiscussArchitectures.md` | How to grow backend structure without brittle shared helpers. |

---

*Guide version: 1.5 — March 2026. VPS runbook **§1.5.10** corrected for copy-paste (Docker apt line, Compose/Caddy phases). **No Azure**—see §1.4 / §9.2.*
