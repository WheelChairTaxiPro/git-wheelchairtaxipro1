---
arc42_section: 05
title: Building Block View
language: en
source: null
last_updated: 2026-04-19
status: stub
---

# 5. Building Block View

> [繁體中文版 (zh-HK)](05-building-block-view.zh-HK.md) | [arc42 primer](_methodology/arc42-primer.md) | [C4 primer](_methodology/c4-model-primer.md) | [Master Index](00-index.md)

## Table of contents

<!-- TODO: fill in during Phase 3. -->

---

## Status

This chapter is a **stub**. Content will be authored in **Phase 3** of the approved plan.

## Planned scope

- **C4 Level 2 Container diagram** (Mermaid) showing the four deployable/runtime units:
  - Rider's browser (Angular 21 PWA)
  - Cloudflare Pages (static hosting + prerendered HTML)
  - `.NET 10` Web API (PaaS host, e.g. Railway / Render / Fly.io)
  - External services (Google Maps, SMTP, GA4)
- **C4 Level 3 Frontend component diagram** (Mermaid): the `features/` slices (`map`, `booking`, `pricing`, `contact-strip`, `faq`, `about`), plus `core/` (HTTP interceptor, config, analytics, guards) and `shared/` (ui, pipes, models, `TripStateService`). Links to [`frontend/ARCHITECTURE.md`](../../frontend/ARCHITECTURE.md) as the canonical folder-layout reference.
- **C4 Level 3 Backend component diagram** (Mermaid): `API/` (controllers, DI), `Features/` slices (`Booking`, `MapRouting`, etc.), `Core/Interfaces/` (`IMapProvider`, `IEmailSender`, `IBookingRepository`), `Infrastructure/` (`GoogleMapsProvider`, `SmtpEmailSender`).
- **Diagram gallery** — short index at the top of this chapter listing every L2/L3 diagram with a one-line caption and an in-page anchor, so reviewers can scan all the pictures in one glance.

## Primary inputs

- [`initial-design/13-0-Frontend-wheelchair_taxi_pro_wireframe_build_specification_updated_with_vertical_slice.md`](../../initial-design/13-0-Frontend-wheelchair_taxi_pro_wireframe_build_specification_updated_with_vertical_slice.md)
- [`initial-design/14-Backend-wheelchair_taxi_pro_backend_plan_v_2_no_mediat_r.md`](../../initial-design/14-Backend-wheelchair_taxi_pro_backend_plan_v_2_no_mediat_r.md)
- [`initial-design/wheelchair_taxi_pro_backend_plan_v_4_detailed_slice_explanation.md`](../../initial-design/wheelchair_taxi_pro_backend_plan_v_4_detailed_slice_explanation.md)
- [`initial-design/wheelchair_taxi_pro_backend_plan_v_3_with_mermaid_diagrams.md`](../../initial-design/wheelchair_taxi_pro_backend_plan_v_3_with_mermaid_diagrams.md)
- [`frontend/ARCHITECTURE.md`](../../frontend/ARCHITECTURE.md)

## Related ADRs

- [ADR-0001 Use Vertical Slice Architecture](adr/0001-use-vertical-slice-architecture.md)
- [ADR-0003 Signals-first state management](adr/0003-signals-first-state-management.md)
- [ADR-0004 No MediatR](adr/0004-no-mediatr.md)
- [ADR-0008 IMapProvider adapter for China expansion](adr/0008-imapprovider-adapter-for-china-expansion.md)

<!-- When you add/rename a heading, update the Table of contents above. -->
