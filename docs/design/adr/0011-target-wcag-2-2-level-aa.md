---
adr_number: "0011"
title: Target WCAG 2.2 Level AA
status: Proposed
date: 2026-04-19
deciders: project owner
language: en
supersedes: null
superseded_by: null
---

# ADR-0011: Target WCAG 2.2 Level AA

> [繁體中文版 (zh-HK)](0011-target-wcag-2-2-level-aa.zh-HK.md) | [ADR primer](../_methodology/adr-primer.md) | [WCAG + Web Vitals primer](../_methodology/wcag-and-web-vitals-primer.md) | [ADR index](README.md)

## Status

Proposed — **stub**; full Context / Decision / Consequences to be authored in Phase 5.

## Seed context

We are building a **wheelchair taxi** booking service. Accessibility is a product requirement, not a nice-to-have. WCAG 2.2 is the current W3C recommendation (2023); Level AA is the industry and legal-procurement baseline worldwide. Level AAA is not achievable on a map-heavy product at Phase 1 budget. Aiming too low (Level A) ignores the very users we exist to serve.

## Context

TODO — expand into 2–6 paragraphs.

## Decision

TODO — one imperative sentence + elaboration.

**Working statement:** Target WCAG 2.2 Level AA on every rider-facing page. Per-slice acceptance criteria live in [§10 Quality Requirements](../10-quality-requirements.md). Automated gating via Playwright + axe on every PR; Lighthouse accessibility audit in CI; manual keyboard-only + screen-reader walkthrough before every release; wheelchair-user beta round before Phase 1 launch. The map tab must provide a non-map fallback for users who cannot manipulate a pin.

## Consequences

TODO — Positive / Negative / Neutral lists.

## Related chapters

- [§1 Introduction and Goals](../01-introduction-and-goals.md)
- [§10 Quality Requirements](../10-quality-requirements.md)
