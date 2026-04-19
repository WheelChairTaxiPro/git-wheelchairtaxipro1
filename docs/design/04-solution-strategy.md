---
arc42_section: 04
title: Solution Strategy
language: en
source: null
last_updated: 2026-04-19
status: stub
---

# 4. Solution Strategy

> [繁體中文版 (zh-HK)](04-solution-strategy.zh-HK.md) | [arc42 primer](_methodology/arc42-primer.md) | [Master Index](00-index.md)

## Table of contents

<!-- TODO: fill in during Phase 3. -->

---

## Status

This chapter is a **stub**. Content will be authored in **Phase 3** of the approved plan.

## Planned scope

- **Big-picture approach** in a few paragraphs:
  - Vertical-slice architecture on both frontend and backend (one feature folder owns UI + data + tests + routes)
  - Signals-first state management on the frontend; RxJS only for genuine streams
  - Static prerender via `@angular/ssr` — every public route ships as fully-rendered HTML for SEO
  - Bilingual-default (zh-HK) with EN mirror at `/en/…`, hreflang tagged, language auto-detection + persistent switcher
  - `IMapProvider` adapter so HK (Google Maps) and future China (Tencent / Amap / Baidu / Huawei) deployments coexist
  - Phase 1 booking delivery is email-only (no DB), with a clean migration path to EF Core 10 in Phase 2
- **Phase 1 build-order DAG** (Mermaid) showing the dependency-ordered sequence of slices: Foundation → Map → Booking → Contact Strip → Pricing → FAQ → About → Analytics
- **Why these choices** — one-paragraph rationale per choice, each citing the relevant ADR

## Primary inputs

- [`initial-design/13-0-Frontend-wheelchair_taxi_pro_wireframe_build_specification_updated_with_vertical_slice.md`](../../initial-design/13-0-Frontend-wheelchair_taxi_pro_wireframe_build_specification_updated_with_vertical_slice.md)
- [`initial-design/14-Backend-wheelchair_taxi_pro_backend_plan_v_2_no_mediat_r.md`](../../initial-design/14-Backend-wheelchair_taxi_pro_backend_plan_v_2_no_mediat_r.md)
- [`initial-design/15-phase1-build-order.md`](../../initial-design/15-phase1-build-order.md)
- [`initial-design/DiscussArchitectures.md`](../../initial-design/DiscussArchitectures.md)
- [`frontend/ARCHITECTURE.md`](../../frontend/ARCHITECTURE.md)

## Related ADRs

- [ADR-0001 Use Vertical Slice Architecture](adr/0001-use-vertical-slice-architecture.md)
- [ADR-0003 Signals-first state management](adr/0003-signals-first-state-management.md)
- [ADR-0004 No MediatR](adr/0004-no-mediatr.md)
- [ADR-0006 Static prerender via `@angular/ssr`](adr/0006-static-prerender-via-angular-ssr.md)
- [ADR-0008 IMapProvider adapter for China expansion](adr/0008-imapprovider-adapter-for-china-expansion.md)
- [ADR-0009 Email-only bookings in Phase 1](adr/0009-email-only-bookings-in-phase-1.md)
- [ADR-0010 Bilingual default zh-HK with EN mirror](adr/0010-bilingual-zh-hk-default-with-en-mirror.md)

<!-- When you add/rename a heading, update the Table of contents above. -->
