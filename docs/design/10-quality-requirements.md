---
arc42_section: 10
title: Quality Requirements
language: en
source: null
last_updated: 2026-04-19
status: stub
---

# 10. Quality Requirements

> [繁體中文版 (zh-HK)](10-quality-requirements.zh-HK.md) | [arc42 primer](_methodology/arc42-primer.md) | [WCAG + Web Vitals primer](_methodology/wcag-and-web-vitals-primer.md) | [Master Index](00-index.md)

## Table of contents

<!-- TODO: fill in during Phase 2. -->

---

## Status

This chapter is a **stub**. Content will be authored in **Phase 2** of the approved plan. This chapter is stakeholder-facing (read alongside §1, §3, §12).

## Planned scope

### 10.1 Accessibility — WCAG 2.2 Level AA

- Explicit target: **WCAG 2.2 Level AA** across every rider-facing page.
- Per-slice acceptance criteria (map tab, booking form, contact strip, pricing, FAQ, about) — each expressed as a testable criterion (keyboard reachable, screen-reader announced, colour contrast met, etc.).
- Non-map fallback for the map tab (address-input path for users who cannot manipulate a pin).
- Testing strategy: Playwright + axe, Lighthouse accessibility score, periodic manual audit.

### 10.2 Performance — Core Web Vitals + API SLOs

- **LCP p75 ≤ 2.5 s** on 4G mobile (Core Web Vitals "Good")
- **INP p75 ≤ 200 ms**
- **CLS p75 ≤ 0.1**
- **API p95 ≤ 300 ms** for the booking endpoint (excluding third-party email send)
- Availability target: **99.5%** end-to-end in Phase 1
- Measurement: Lighthouse CI on every PR, Google Search Console CWV report in production, GA4 Web Vitals events

### 10.3 Privacy

- Booking form collects PII (phone, email). Handled under HK Personal Data Privacy Ordinance (PDPO).
- Data retention policy for dispatcher mailbox, GA4 event lifetimes, cookie posture.
- No third-party ad trackers in Phase 1 beyond GA4 + GSC.

### 10.4 Security

- HTTPS-only (enforced by Cloudflare). CORS locked to the Pages domain on the API side.
- Rate limits on contact CTAs (IP + cookie based).
- Input validation on the booking endpoint (server-side).
- Secrets only in PaaS env vars; never in git (see [`.gitignore`](../../.gitignore)).

### 10.5 Bilingual UX quality

- Zero mixed-language UI strings within a single session.
- Traditional Chinese conventions: HK usage (not Taiwan / not mainland); correct punctuation and spacing.
- Language switcher never blocks the rider from completing a booking.

## Primary inputs

- [`_methodology/wcag-and-web-vitals-primer.md`](_methodology/wcag-and-web-vitals-primer.md)
- [`README.md`](../../README.md) §Phase 1 KPIs
- [`docs/LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md`](../LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md) §Performance

## Related ADRs

- [ADR-0011 Target WCAG 2.2 Level AA](adr/0011-target-wcag-2-2-level-aa.md)
- [ADR-0012 Target Core Web Vitals "Good" thresholds](adr/0012-target-core-web-vitals-good-thresholds.md)
- [ADR-0006 Static prerender via `@angular/ssr`](adr/0006-static-prerender-via-angular-ssr.md)

<!-- When you add/rename a heading, update the Table of contents above. -->
