---
adr_number: "0001"
title: Use Vertical Slice Architecture (frontend and backend)
status: Proposed
date: 2026-04-19
deciders: project owner
language: en
supersedes: null
superseded_by: null
---

# ADR-0001: Use Vertical Slice Architecture (frontend and backend)

> [繁體中文版 (zh-HK)](0001-use-vertical-slice-architecture.zh-HK.md) | [ADR primer](../_methodology/adr-primer.md) | [ADR index](README.md)

## Status

Proposed — **stub**; full Context / Decision / Consequences to be authored in Phase 5.

## Seed context

The Phase 1 MVP has roughly eight user-facing capabilities (map, booking, pricing, contact strip, FAQ, about, analytics, contact). Organising by technical layer (`controllers/`, `services/`, `repositories/` on the backend; `components/`, `services/`, `models/` at the root on the frontend) scatters each capability across many folders, so every feature-level change touches every layer. Vertical slicing — one folder per capability that owns its UI, data access, tests, and routes — keeps changes local, lets slices be independently tested, and lets slices be deleted cleanly when the capability is retired. Both the frontend design ([`frontend/ARCHITECTURE.md`](../../../frontend/ARCHITECTURE.md)) and backend plan ([`initial-design/14-Backend-…md`](../../../initial-design/14-Backend-wheelchair_taxi_pro_backend_plan_v_2_no_mediat_r.md)) already assume this shape.

## Context

TODO — expand into 2–6 paragraphs.

## Decision

TODO — one imperative sentence + elaboration.

**Working statement:** Organise both frontend and backend code primarily by feature (vertical slice), not by technical layer. Cross-cutting infrastructure lives in a shared layer (`core/` on the frontend; `Core/Interfaces/` + `Infrastructure/` on the backend).

## Consequences

TODO — Positive / Negative / Neutral lists.

## Related chapters

- [§4 Solution Strategy](../04-solution-strategy.md)
- [§5 Building Block View](../05-building-block-view.md)
