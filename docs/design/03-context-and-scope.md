---
arc42_section: 03
title: Context and Scope
language: en
source: null
last_updated: 2026-04-19
status: stub
---

# 3. Context and Scope

> [繁體中文版 (zh-HK)](03-context-and-scope.zh-HK.md) | [arc42 primer](_methodology/arc42-primer.md) | [C4 primer](_methodology/c4-model-primer.md) | [Master Index](00-index.md)

## Table of contents

<!-- TODO: fill in during Phase 2. -->

---

## Status

This chapter is a **stub**. Content will be authored in **Phase 2** of the approved plan and is the first chapter a business stakeholder reads alongside §1.

## Planned scope

- **C4 Level 1 System Context diagram** (Mermaid) showing: rider (human actor), Wheelchair Taxi Pro (our system, one box), external systems — Google Maps JavaScript / Places / Directions APIs, SMTP/SendGrid email, Google Analytics 4, Google Search Console, Google Business Profile, Facebook Page, and the dispatcher mailbox
- **Business context**: Hong Kong wheelchair taxi market, named competitors (hkwheelchairtaxis.com, hkwheelchair51846193.com, hongkongcaringtaxi.com), our positioning
- **External interfaces catalogue**: for each external system, the protocol, authentication, SLA/availability posture, and data classification (PII vs public)
- **Scope boundary**: explicit in-scope vs out-of-scope bullets mirroring README §Phase 1 + §Phase 1 Out of scope

## Primary inputs

- [`README.md`](../../README.md) §Architecture, §Phase 1 (MVP) Scope, §Target competitors
- [`initial-design/WheelchairTaxiPro_Communication.md`](../../initial-design/WheelchairTaxiPro_Communication.md)
- [`initial-design/6-wheelchair_taxi_website_platform_proposal_bilingual_v_2.md`](../../initial-design/6-wheelchair_taxi_website_platform_proposal_bilingual_v_2.md)
- [`initial-design/14-Backend-wheelchair_taxi_pro_backend_plan_v_2_no_mediat_r.md`](../../initial-design/14-Backend-wheelchair_taxi_pro_backend_plan_v_2_no_mediat_r.md)

## Related ADRs

- [ADR-0008 IMapProvider adapter for China expansion](adr/0008-imapprovider-adapter-for-china-expansion.md)
- [ADR-0009 Email-only bookings in Phase 1](adr/0009-email-only-bookings-in-phase-1.md)

<!-- When you add/rename a heading, update the Table of contents above. -->
