---
adr_number: "0003"
title: Signals-first state management; RxJS only for streams
status: Proposed
date: 2026-04-19
deciders: project owner
language: en
supersedes: null
superseded_by: null
---

# ADR-0003: Signals-first state management; RxJS only for streams

> [繁體中文版 (zh-HK)](0003-signals-first-state-management.zh-HK.md) | [ADR primer](../_methodology/adr-primer.md) | [ADR index](README.md)

## Status

Proposed — **stub**; full Context / Decision / Consequences to be authored in Phase 5.

## Seed context

Angular 21 ships Signals as a first-class reactive primitive: synchronous reads, zoneless-ready, no subscription lifecycle to manage. Historically Angular apps reached for RxJS `BehaviorSubject` for every piece of shared state, which pulled developers into marble thinking, subscription management, and zone interop concerns for problems that are fundamentally "hold a value, notify readers on change". Signals solve that problem directly. RxJS remains the right tool when the problem is a **stream** (debounced inputs, websockets, HTTP orchestration, combining async events) — `@angular/core/rxjs-interop` provides `toSignal` / `toObservable` for the boundaries. See [`frontend/ARCHITECTURE.md` §4a](../../../frontend/ARCHITECTURE.md) for the canonical frontend rule and [`initial-design/15-phase1-build-order.md`](../../../initial-design/15-phase1-build-order.md) for the worked example (`TripStateService`).

## Context

TODO — expand into 2–6 paragraphs.

## Decision

TODO — one imperative sentence + elaboration.

**Working statement:** Use Angular Signals as the default state-management primitive throughout the frontend. Reach for RxJS only when the problem is a true stream (async events over time that need `debounceTime`, `switchMap`, `merge`, or similar). Cross the boundary with `toSignal` / `toObservable` from `@angular/core/rxjs-interop`. Shared state lives in `shared/services/` with a private `signal()` + `asReadonly()` public surface.

## Consequences

TODO — Positive / Negative / Neutral lists.

## Related chapters

- [§4 Solution Strategy](../04-solution-strategy.md)
- [§6 Runtime View](../06-runtime-view.md)
- [§8 Cross-cutting Concepts](../08-cross-cutting-concepts.md)
