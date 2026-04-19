---
adr_number: "0004"
title: No MediatR in the backend
status: Proposed
date: 2026-04-19
deciders: project owner
language: en
supersedes: null
superseded_by: null
---

# ADR-0004: No MediatR in the backend

> [繁體中文版 (zh-HK)](0004-no-mediatr.zh-HK.md) | [ADR primer](../_methodology/adr-primer.md) | [ADR index](README.md)

## Status

Proposed — **stub**; full Context / Decision / Consequences to be authored in Phase 5.

## Seed context

MediatR is the de-facto in-process mediator for .NET that many CQRS / Clean Architecture projects adopt. It historically came free; its licence model changed in recent releases. Combined with our choice of vertical slice architecture (ADR-0001), the mediator indirection buys little: feature handlers can be called directly from minimal API endpoints or thin controllers. The original backend plan ([`initial-design/14-Backend-…md`](../../../initial-design/14-Backend-wheelchair_taxi_pro_backend_plan_v_2_no_mediat_r.md)) already documents this choice.

## Context

TODO — expand into 2–6 paragraphs covering the licensing change and the architectural argument.

## Decision

TODO — one imperative sentence + elaboration.

**Working statement:** Do not use MediatR. Implement feature slices as self-contained handler classes invoked directly from minimal API endpoints or controllers. Cross-cutting concerns (logging, validation) ride on middleware / endpoint filters rather than a pipeline behavior.

## Consequences

TODO — Positive / Negative / Neutral lists.

## Related chapters

- [§4 Solution Strategy](../04-solution-strategy.md)
- [§5 Building Block View](../05-building-block-view.md)
