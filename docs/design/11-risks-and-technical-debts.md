---
arc42_section: 11
title: Risks and Technical Debts
language: en
source: null
last_updated: 2026-04-19
status: stub
---

# 11. Risks and Technical Debts

> [繁體中文版 (zh-HK)](11-risks-and-technical-debts.zh-HK.md) | [arc42 primer](_methodology/arc42-primer.md) | [Master Index](00-index.md)

## Table of contents

<!-- TODO: fill in during Phase 4. -->

---

## Status

This chapter is a **stub**. Content will be authored in **Phase 4** of the approved plan.

## Planned scope

### 11.1 Known risks

Ordered by severity. Each risk gets: likelihood, impact, mitigation, and owner.

- **Single-host API SPOF** — Phase 1 API runs on one PaaS instance in one region. Mitigation: PaaS auto-heal + documented manual failover; acceptable because Phase 1 traffic is low.
- **Cloudflare reachability inside mainland China** — Pages domain can be intermittent from mainland networks. Mitigation: deferred to Phase 2 with a China-resident CDN (Tencent EdgeOne) when that market is pursued.
- **Email delivery failures** — SMTP / SendGrid transient errors cause missed bookings. Mitigation: retry + in-app confirmation fallback + operator alerting.
- **LLM scraper traffic** — may skew analytics and increase egress. Mitigation: Cloudflare's bot management defaults + clear `robots.txt` stance on AI crawlers.
- **Competitor SEO retaliation** — existing HK wheelchair-taxi sites may ramp up SEO on the same keywords. Mitigation: ongoing content + backlink effort per [`initial-design/10-…affiliate_strategy…md`](../../initial-design/10-hosting_affiliate_strategy_for_wheelchair_taxi_pro_hong_kong.md).
- **Google Maps API cost surprise** — unrestricted keys invite abuse. Mitigation: domain-restricted keys + billing alerts.
- **Accessibility regressions** — a11y defects slip in without automated tests. Mitigation: Playwright + axe on every PR, Lighthouse gates.

### 11.2 Accepted technical debts (Phase 1 scope cuts)

These are deliberate, time-boxed choices that we will pay back in Phase 2 or later. Each has a linked Phase 2 backlog item.

- **Email-only bookings** (no DB, no admin dashboard) — ADR-0009.
- **No authentication / rider accounts** — riders are anonymous in Phase 1.
- **No payments** — cash-on-pickup / existing driver arrangement out-of-band.
- **No live fleet tracking** — deferred to Phase 2.
- **No SMS / WhatsApp push notifications to riders** — confirmation is email only.
- **Single business identity** (one phone, one WhatsApp, one WeChat) — multi-driver dispatch is Phase 2.
- **Review schema omitted** — added only when reviews exist (avoids Schema.org penalties for empty review markup).

## Primary inputs

- [`README.md`](../../README.md) §Phase 1 Out of scope, §Phase 2 Roadmap
- [`initial-design/DiscussArchitectures.md`](../../initial-design/DiscussArchitectures.md)
- [`initial-design/10-hosting_affiliate_strategy_for_wheelchair_taxi_pro_hong_kong.md`](../../initial-design/10-hosting_affiliate_strategy_for_wheelchair_taxi_pro_hong_kong.md)

## Related ADRs

- [ADR-0005 Cloudflare Pages for frontend hosting](adr/0005-cloudflare-pages-for-frontend-hosting.md)
- [ADR-0009 Email-only bookings in Phase 1](adr/0009-email-only-bookings-in-phase-1.md)

<!-- When you add/rename a heading, update the Table of contents above. -->
