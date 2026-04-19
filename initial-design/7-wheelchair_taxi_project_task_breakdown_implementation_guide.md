# Wheelchair Taxi Project – Task Breakdown & Implementation Guide

> **For the actual build order (which slice to build first and why), see [`15-phase1-build-order.md`](15-phase1-build-order.md).** This document is the reference catalogue of *what* needs to exist; `15-phase1-build-order.md` is the prescription for *in what order* to build it.

(Based on proposal fileciteturn0file0)

---

# 0. Project Structure Overview

## Tech Stack
- Frontend: Angular (PWA)
- Backend: .NET Web API
- Hosting: Cloudflare Pages (frontend) → PaaS/VPS for API (e.g. Railway, Render, Fly.io, DigitalOcean—see `8-Guide.md` §1.5)
- Maps: Google Maps API

## Phases
- Phase 1: MVP (4–6 weeks)
- Phase 2: Scaling (8–12 weeks)

---

# 1. Project Setup (Foundation)

## Task 1.1 – Repository & Structure

### Steps
1. Create GitHub repo (e.g. `wheelchairtaxi-platform`)
2. Create folders:
   - `/frontend`
   - `/backend`
   - `/docs`
3. Setup README with project overview

### Output
- Clean project structure

---

## Task 1.2 – Frontend Setup (Angular)

### Steps
1. Create Angular app:
   ```bash
   ng new wheelchair-taxi --standalone
   ```
2. Add Angular Material
3. Setup routing (`app.routes.ts`)
4. Setup layout component

### Key Decisions
- Mobile-first design
- Use Angular Material components

### Output
- Running Angular app

---

## Task 1.3 – Backend Setup (.NET)

### Steps
1. Create Web API:
   ```bash
   dotnet new webapi -n WheelchairTaxi.API
   ```
2. Setup layers:
   - Controllers
   - Services
   - Domain
3. Enable Swagger

### Output
- Running API project

---

# 2. Core Features (MVP)

---

## Task 2.1 – One-Click Contact

### Goal
Allow users to contact instantly

### Steps
1. Create UI buttons:
   - Call (`tel:`)
   - WhatsApp (`https://wa.me/...`)
2. Add dynamic phone config
3. Track clicks (for analytics)

### Backend (Optional)
- Log contact events

### Output
- Working contact buttons

---

## Task 2.2 – Location Detection

### Goal
Auto-fill pickup location

### Steps
1. Use browser geolocation API
2. Integrate Google Maps
3. Reverse geocoding to address
4. Populate form automatically

### Edge Cases
- User denies permission
- Low GPS accuracy

### Output
- Location auto-filled

---

## Task 2.3 – Booking Form (Basic)

### Goal
Allow users to submit booking request

### Frontend Steps
1. Create form fields:
   - Name
   - Phone
   - Pickup location
   - Destination
   - Time
2. Validate inputs

### Backend Steps
1. Create `BookingController`
2. Create POST endpoint `/api/bookings`
3. Store in database or send notification

### Output
- Booking submission works

---

## Task 2.4 – PWA (Installable App)

### Goal
Make site installable

### Steps
1. Add Angular PWA:
   ```bash
   ng add @angular/pwa
   ```
2. Configure manifest
3. Enable service worker

### Output
- App installable on mobile

---

## Task 2.5 – Anti-Fraud Protection

### Goal
Reduce fake clicks

### Steps
1. Capture IP (backend)
2. Store click logs
3. Implement rate limiting:
   - Same IP → limit per minute
4. Add Google Ads conversion tracking

### Advanced (Optional)
- Block suspicious IPs

### Output
- Basic protection system

---

## Task 2.6 – Google Maps Integration

### Goal
Show map and improve SEO

### Steps
1. Embed Google Map
2. Show pickup location
3. Add markers
4. Enable directions preview

### Output
- Map working in UI

---

## Task 2.7 – SEO & Google Visibility

### Goal
Appear in search & AI Mode

### Steps
1. Add meta tags
2. Add structured data (Schema.org)
3. Setup sitemap
4. Register Google Business Profile

### Output
- SEO-ready site

---

# 3. Deployment (MVP)

---

## Task 3.1 – Frontend Hosting (Cloudflare)

### Steps
1. Build Angular:
   ```bash
   ng build
   ```
2. Deploy to Cloudflare Pages
3. Configure domain: wheelchairtaxipro.com

### Output
- Live website

---

## Task 3.2 – Backend Hosting

### Options
- Phase 1: Lightweight (optional backend)
- Phase 2: Any Linux host that runs .NET 8+ (Railway, Render, Fly.io, DigitalOcean, VPS + Docker)

### Steps (generic)
1. Containerize or use the host’s .NET buildpack; expose Kestrel on the port the platform assigns (`PORT` / `8080`).
2. Deploy the API and set **environment variables** (secrets, DB connection string, CORS origins).
3. Point the Angular `apiUrl` at the live API base URL; verify CORS.

### Output
- Live API

*See `8-Guide.md` §1.5 (detailed options) and §9.2 if you are not using Microsoft Azure.*

---

# 4. Phase 2 (Scaling)

---

## Task 4.1 – Multi-Driver System

### Steps
1. Create Driver entity
2. Assign bookings
3. Driver dashboard

---

## Task 4.2 – Dispatch System

### Steps
1. Auto-assign nearest driver
2. Use geolocation logic

---

## Task 4.3 – Payment Integration

### Steps
1. Integrate Stripe / payment gateway
2. Add payment UI

---

# 5. Analytics & Monitoring

---

## Task 5.1 – Tracking

### Steps
1. Google Analytics
2. Track conversions
3. Monitor user flow

---

# 6. Suggested Timeline Breakdown

## Week 1
- Setup frontend + backend

## Week 2
- Contact + booking form

## Week 3
- Location + maps

## Week 4
- PWA + SEO

## Week 5–6
- Anti-fraud + deployment

---

# 7. Key Risks & Notes

- Google Maps API cost
- User permission for location
- Ad fraud complexity
- Hosting scaling cost

---

# 8. Next Step

Start with:
👉 Task 1.1 → 1.3 (setup)

Then move sequentially through MVP tasks.

---

If needed, this can be further expanded into:
- Jira tickets
- GitHub Issues
- CI/CD pipelines

