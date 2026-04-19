---
arc42_section: 09
title: Architecture Decisions
language: en
source: null
last_updated: 2026-04-19
status: stub
---

# 9. Architecture Decisions

> [繁體中文版 (zh-HK)](09-architecture-decisions.zh-HK.md) | [arc42 primer](_methodology/arc42-primer.md) | [ADR primer](_methodology/adr-primer.md) | [Master Index](00-index.md)

## Table of contents

<!-- TODO: fill in during Phase 5 (alongside the ADRs themselves). -->

---

## Status

This chapter is a **stub** that will become the **catalogue of Architecture Decision Records**. Contents will be generated alongside the 12 initial ADRs in **Phase 5** of the approved plan.

This chapter is an **index only** — the ADRs themselves live as individual markdown files under [`adr/`](adr/). When a new decision is made, write a new ADR file under `adr/` and add a row to the table in this chapter.

## Planned scope

- **ADR catalogue table**: one row per ADR showing Number, Title, Status (Proposed / Accepted / Deprecated / Superseded), Date, and a one-line summary
- **Superseded chains**: when ADR-N supersedes ADR-M, both rows are kept and linked
- **How to add a new ADR**: brief pointer to [`adr/README.md`](adr/README.md)

## Planned ADR entries (12 initial)

| # | Title | Status | Phase |
|---|---|---|---|
| 0001 | Use Vertical Slice Architecture | Proposed | Phase 5 |
| 0002 | Use Angular 21 + .NET 10 LTS + Node 22 LTS | Proposed | Phase 5 |
| 0003 | Signals-first state management; RxJS only for streams | Proposed | Phase 5 |
| 0004 | No MediatR in the backend | Proposed | Phase 5 |
| 0005 | Host frontend on Cloudflare Pages (free tier) | Proposed | Phase 5 |
| 0006 | Static prerender via `@angular/ssr` (no SSR runtime) | Proposed | Phase 5 |
| 0007 | GitFlow branching (`main` / `staging` / `develop`) | Proposed | Phase 5 |
| 0008 | `IMapProvider` adapter for China expansion | Proposed | Phase 5 |
| 0009 | Email-only bookings in Phase 1 (no database) | Proposed | Phase 5 |
| 0010 | Bilingual default zh-HK with EN mirror at `/en/…` | Proposed | Phase 5 |
| 0011 | Target WCAG 2.2 Level AA | Proposed | Phase 5 |
| 0012 | Target Core Web Vitals "Good" thresholds | Proposed | Phase 5 |

## Related ADRs

All of the above — see [`adr/`](adr/).

<!-- When you add/rename a heading, update the Table of contents above. -->
