---
arc42_section: 08
title: Cross-cutting Concepts
language: en
source: null
last_updated: 2026-04-19
status: stub
---

# 8. Cross-cutting Concepts

> [繁體中文版 (zh-HK)](08-cross-cutting-concepts.zh-HK.md) | [arc42 primer](_methodology/arc42-primer.md) | [Master Index](00-index.md)

## Table of contents

<!-- TODO: fill in during Phase 4. -->

---

## Status

This chapter is a **stub**. Content will be authored in **Phase 4** of the approved plan.

## Planned scope

Topics that touch every slice and therefore live once in this chapter instead of being repeated per-feature:

- **Bilingual strategy** — default zh-HK at `/`, EN mirror at `/en/…`, `Accept-Language` + geolocation detection, persistent switcher writing to `localStorage`, `hreflang` tagging, canonical URL per language, how `lang` attribute is set on `<html>` and how screen readers benefit
- **SEO / GEO / AEO** — Schema.org JSON-LD catalogue per route (`LocalBusiness`, `FAQPage`, `Service`, `BreadcrumbList`), prerender-first rendering rule, sitemap.xml generation, `robots.txt`, internal-linking component, AI-answer-engine content posture (factual, bilingual, short paragraphs, named entities)
- **State management** — signals-first (cite ADR-0003); RxJS only for HTTP, debounced inputs, websockets; `toSignal` / `toObservable` at boundaries; shared state lives in `shared/services/` with private `signal()` + `asReadonly()` exposure
- **Logging** — structured logs on the backend (Serilog or built-in `ILogger`); correlation ID per request; no PII in logs
- **Error handling** — frontend: typed HTTP error interceptor in `core/http/`; backend: global exception handler; user-facing error copy in both languages
- **Analytics & tracking** — GA4 event catalogue (pageview, map interaction, contact-strip tap, booking submit), conversion funnel definition, Google Search Console baseline
- **Anti-fraud** — IP-based rate limits on contact CTAs, click frequency limiting, Google Ads conversion tracking

## Primary inputs

- [`initial-design/13-2-wheelchair_taxi_pro_wireframe_description_v_4.md`](../../initial-design/13-2-wheelchair_taxi_pro_wireframe_description_v_4.md)
- [`initial-design/13-3-wheelchair_taxi_pro_mobile_wireframe_description_en_????_v_5.md`](../../initial-design/13-3-wheelchair_taxi_pro_mobile_wireframe_description_en_繁體中文_v_5.md)
- [`initial-design/13-4-wheelchair_taxi_pro_booking_form_pricing_content_????.md`](../../initial-design/13-4-wheelchair_taxi_pro_booking_form_pricing_content_中英對照.md)
- [`initial-design/WheelchairTaxiPro_Communication.md`](../../initial-design/WheelchairTaxiPro_Communication.md)
- [`frontend/ARCHITECTURE.md`](../../frontend/ARCHITECTURE.md) §4a State management, §7 SEO
- [`README.md`](../../README.md) §Phase 1 feature checklist (anti-fraud)

## Related ADRs

- [ADR-0003 Signals-first state management](adr/0003-signals-first-state-management.md)
- [ADR-0006 Static prerender via `@angular/ssr`](adr/0006-static-prerender-via-angular-ssr.md)
- [ADR-0010 Bilingual default zh-HK with EN mirror](adr/0010-bilingual-zh-hk-default-with-en-mirror.md)

<!-- When you add/rename a heading, update the Table of contents above. -->
