---
adr_number: "0012"
title: Target Core Web Vitals "Good" thresholds
status: Proposed
date: 2026-04-19
deciders: project owner
language: en
supersedes: null
superseded_by: null
---

# ADR-0012: Target Core Web Vitals "Good" thresholds

> [繁體中文版 (zh-HK)](0012-target-core-web-vitals-good-thresholds.zh-HK.md) | [ADR primer](../_methodology/adr-primer.md) | [WCAG + Web Vitals primer](../_methodology/wcag-and-web-vitals-primer.md) | [ADR index](README.md)

## Status

Proposed — **stub**; full Context / Decision / Consequences to be authored in Phase 5.

## Seed context

The project is SEO-first; Core Web Vitals (LCP / INP / CLS) feed directly into Google Search's page-experience ranking signal. "Good" at p75 is simultaneously a UX quality bar and an SEO lever. Our rendering choice (ADR-0006 static prerender) and hosting choice (ADR-0005 Cloudflare Pages) were made largely to make these thresholds easy to hit.

## Context

TODO — expand into 2–6 paragraphs covering why p75 (not median), and why CWV rather than (or in addition to) Lighthouse scores.

## Decision

TODO — one imperative sentence + elaboration.

**Working statement:** On every public route, target Core Web Vitals "Good" at p75 of real-user traffic: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. Enforce Lighthouse budgets on every PR; monitor real-user CWV via Google Search Console and GA4 Web Vitals events. Regressions block release.

## Consequences

TODO — Positive / Negative / Neutral lists.

## Related chapters

- [§4 Solution Strategy](../04-solution-strategy.md)
- [§7 Deployment View](../07-deployment-view.md)
- [§10 Quality Requirements](../10-quality-requirements.md)
