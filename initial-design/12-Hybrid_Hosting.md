# Hybrid hosting explained (Wheelchair Taxi Pro)

This note expands on **§ Recommended Architecture (MVP) → Hybrid Setup (Best)** in `10-hosting_affiliate_strategy_for_wheelchair_taxi_pro_hong_kong.md`.

---

## 🔥 Hybrid Setup (Best)

**“Hybrid”** here means you **do not put everything on one server**. You split responsibilities so each part uses the **cheapest and fastest** option for that job:

| Layer | Where it runs | Role |
|--------|----------------|------|
| **Frontend** (Angular) | **Cloudflare Pages** | Static files + global **CDN** (often **free** tier) |
| **Backend** (.NET API) | **Vultr VPS (Hong Kong)** | Business logic, bookings, secrets, Turnstile checks, email, etc. |
| **Database** | **Same VPS** or **managed** (e.g. Neon, managed Postgres) | Persistent data |
| **Domain & DNS** | **Namecheap** (registrar) + **Cloudflare** (DNS, often proxy) | Names, SSL at edge, WAF optional |

Rough **total** for a small MVP is often on the order of **~US$5–6/month** for compute (Vultr) plus domain renewal; Pages can be **$0** on the free tier if usage stays within limits.

---

### Why split frontend and backend?

1. **Angular build output is mostly static** (HTML, JS, CSS). That is ideal for **Cloudflare Pages**: fast deploys, automatic HTTPS, and **CDN caching** close to users (including better behaviour than a single HK box alone when traffic is global or when you want edge caching as discussed in doc 10 for China-related reach).

2. **The .NET API is not static**—it needs a **long-running process**, environment variables, and a stable origin for your database. A small **Vultr VPS in Hong Kong** keeps **latency low for HK users** and matches the stack described in your platform proposal (`6` / `8-Guide`).

3. **Secrets stay off the CDN**: API keys for email, Turnstile **secret**, DB connection strings live on the **VPS** (or managed DB), not in the public frontend bundle.

---

### Flow in one sentence

**Users** hit **Cloudflare** (domain → Pages) for the **Angular app**; the app calls **`https://api.yourdomain.com`** (or similar) which points to your **Vultr** machine running **Kestrel** (often behind **Caddy** or nginx). The API talks to **PostgreSQL or MongoDB** on the same VPS or to a **managed** database service.

---

### Database: same VPS vs managed

- **Same VPS (Docker or local install):** lowest monthly cost, you handle backups and updates.
- **Managed (e.g. Neon, Supabase Postgres, MongoDB Atlas):** extra cost, less ops, good if you want automated backups and separation from the app server.

Doc 10 lists **PostgreSQL / MongoDB** as options; pick one stack and stick to it for MVP unless you have a specific need for both.

---

### Domain: Namecheap vs Cloudflare

- **Namecheap (or any registrar):** where you **buy** `wheelchairtaxipro.com`.
- **Cloudflare:** where you often put **DNS** (and orange-cloud proxy) for **Pages**, **Turnstile**, **WAF**, and consistent TLS. The domain can stay registered at Namecheap while **nameservers** point to Cloudflare—common pattern.

---

### Why doc 10 calls this “Best” (for your context)

- **Cost:** Static site on **free/low Pages** + **small HK VPS** is hard to beat for an MVP.
- **Performance:** HK VPS for API + **edge CDN** for static assets.
- **Fit:** Matches **Angular + .NET** without forcing the API onto serverless-only platforms.
- **Alignment:** Same hybrid idea as in `8-Guide.md` (§1.5.10: Caddy + site on VPS *or* Pages for frontend + API on VPS).

---

### What you still own operationally

- **VPS:** OS patches, firewall, Docker/Caddy (if used), SSL on origin if proxied through Cloudflare, **backups**.
- **Pages:** build pipeline (e.g. Git push → build `ng build` output).
- **CORS:** API must allow your real **Pages** and **production** origins.

---

*For step-by-step VPS + Docker + Caddy commands, see `8-Guide.md` §1.5.10.*
