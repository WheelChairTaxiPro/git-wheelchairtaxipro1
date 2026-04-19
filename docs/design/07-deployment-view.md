---
arc42_section: 07
title: Deployment View
language: en
source: null
last_updated: 2026-04-19
status: stub
---

# 7. Deployment View

> [繁體中文版 (zh-HK)](07-deployment-view.zh-HK.md) | [arc42 primer](_methodology/arc42-primer.md) | [C4 primer](_methodology/c4-model-primer.md) | [Master Index](00-index.md)

## Table of contents

<!-- TODO: fill in during Phase 3. -->

---

## Status

This chapter is a **stub**. Content will be authored in **Phase 3** of the approved plan.

## Planned scope

- **C4 Deployment diagram** (Mermaid): physical/cloud topology
  - Cloudflare global edge network (300+ PoPs, incl. HK) serving prerendered Angular 21 HTML + static assets
  - `.NET 10` Web API container on a single-region (HK or SG) PaaS instance (Railway / Render / Fly.io)
  - Email provider (SMTP or SendGrid) for booking notifications
  - DNS (Cloudflare) with `wheelchairtaxipro.com` → Pages and `api.wheelchairtaxipro.com` → PaaS
  - External: Google Maps APIs, Google Analytics 4, Google Search Console, Google Business Profile
- **Environments**: local dev, Cloudflare preview (per-PR), staging, production
- **CI/CD pipeline flow** (Mermaid flowchart):
  - `feature/*` → GitHub push → CF preview deploy → PR review → merge to `develop` → deploy to staging → release branch → merge to `main` → deploy to production
  - API pipeline: GitHub Actions → Docker build → push to registry → PaaS deploy
- **Operational concerns**: rollback strategy, secrets management (environment variables on PaaS; never in git), log aggregation (provider default), uptime monitoring

## Primary inputs

- [`docs/LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md`](../LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md)
- [`initial-design/9-Hosting options and pricing research for WheelchairTaxiPro in Hong Kong.md`](../../initial-design/9-Hosting%20options%20and%20pricing%20research%20for%20WheelchairTaxiPro%20in%20Hong%20Kong.md)
- [`initial-design/10-hosting_affiliate_strategy_for_wheelchair_taxi_pro_hong_kong.md`](../../initial-design/10-hosting_affiliate_strategy_for_wheelchair_taxi_pro_hong_kong.md)
- [`initial-design/12-Hybrid_Hosting.md`](../../initial-design/12-Hybrid_Hosting.md)
- [`initial-design/DiscussArchitectures.md`](../../initial-design/DiscussArchitectures.md)
- [`CONTRIBUTING.md`](../../CONTRIBUTING.md) §Branching

## Related ADRs

- [ADR-0005 Cloudflare Pages for frontend hosting](adr/0005-cloudflare-pages-for-frontend-hosting.md)
- [ADR-0006 Static prerender via `@angular/ssr`](adr/0006-static-prerender-via-angular-ssr.md)
- [ADR-0007 GitFlow branching model](adr/0007-gitflow-branching-model.md)

<!-- When you add/rename a heading, update the Table of contents above. -->
