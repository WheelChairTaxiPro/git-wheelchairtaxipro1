---
adr_number: "0006"
title: Static prerender via `@angular/ssr` (no SSR runtime)
status: Proposed
date: 2026-04-19
deciders: project owner
language: en
supersedes: null
superseded_by: null
---

# ADR-0006: Static prerender via `@angular/ssr` (no SSR runtime)

> [繁體中文版 (zh-HK)](0006-static-prerender-via-angular-ssr.zh-HK.md) | [ADR primer](../_methodology/adr-primer.md) | [ADR index](README.md)

## Status

Proposed — **stub**; full Context / Decision / Consequences to be authored in Phase 5.

## Seed context

SEO-first means every public route must ship crawlable HTML and hit Core Web Vitals "Good" (ADR-0012). Two rendering strategies were considered: (1) full server-side rendering (SSR) — runtime per-request rendering that requires a Node host and adds cold-start latency, and (2) static prerender (SSG) — build-time HTML generation + client-side hydration. Our content is largely static per locale (map, booking, pricing, FAQ, about), so SSG is sufficient and pairs perfectly with a static-only host (ADR-0005 Cloudflare Pages). `@angular/ssr`'s `prerender` task generates per-route HTML at build time; the app then hydrates on the client.

## Context

TODO — expand into 2–6 paragraphs.

## Decision

TODO — one imperative sentence + elaboration.

**Working statement:** Use `@angular/ssr` in prerender-only mode. Every route that has user-facing content is added to the prerender route list. No Node runtime is deployed; the output is static HTML + JS + CSS served by Cloudflare Pages.

## Consequences

TODO — Positive / Negative / Neutral lists. Flag: pages that need true per-request data (e.g. a future dashboard) will need a different strategy.

## Related chapters

- [§4 Solution Strategy](../04-solution-strategy.md)
- [§7 Deployment View](../07-deployment-view.md)
- [§10 Quality Requirements](../10-quality-requirements.md)
