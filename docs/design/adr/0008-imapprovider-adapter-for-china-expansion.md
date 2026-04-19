---
adr_number: "0008"
title: "`IMapProvider` adapter for China expansion"
status: Proposed
date: 2026-04-19
deciders: project owner
language: en
supersedes: null
superseded_by: null
---

# ADR-0008: `IMapProvider` adapter for China expansion

> [繁體中文版 (zh-HK)](0008-imapprovider-adapter-for-china-expansion.zh-HK.md) | [ADR primer](../_methodology/adr-primer.md) | [ADR index](README.md)

## Status

Proposed — **stub**; full Context / Decision / Consequences to be authored in Phase 5.

## Seed context

Phase 1 ships Google Maps JavaScript / Places / Directions APIs for the HK market. Google Maps is blocked or unreliable in mainland China; a Phase 2 expansion to the mainland requires replacing the map provider with a China-native alternative (Tencent, Amap, Baidu, Huawei Maps). Embedding Google-specific calls directly in the `map/` and `booking/` slices would make that swap painful. Defining an `IMapProvider` interface now — covering geocoding, routing, and pin-drop — lets us later implement alternate providers without touching feature code. Recorded in [`initial-design/13-0-…vertical_slice.md`](../../../initial-design/13-0-Frontend-wheelchair_taxi_pro_wireframe_build_specification_updated_with_vertical_slice.md).

## Context

TODO — expand into 2–6 paragraphs.

## Decision

TODO — one imperative sentence + elaboration.

**Working statement:** Define a frontend `IMapProvider` interface and a `core/services/GoogleMapsProvider` implementation. All slice code depends only on the interface, never on `google.maps.*` directly. Phase 2 adds alternate implementations behind the same interface.

## Consequences

TODO — Positive / Negative / Neutral lists. Flag the Phase 1 cost of writing through an interface when only one implementation exists.

## Related chapters

- [§3 Context and Scope](../03-context-and-scope.md)
- [§4 Solution Strategy](../04-solution-strategy.md)
- [§11 Risks and Technical Debts](../11-risks-and-technical-debts.md)
