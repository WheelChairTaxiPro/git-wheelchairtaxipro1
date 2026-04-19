---
adr_number: "0005"
title: Host frontend on Cloudflare Pages (free tier)
status: Proposed
date: 2026-04-19
deciders: project owner
language: en
supersedes: null
superseded_by: null
---

# ADR-0005: Host frontend on Cloudflare Pages (free tier)

> [繁體中文版 (zh-HK)](0005-cloudflare-pages-for-frontend-hosting.zh-HK.md) | [ADR primer](../_methodology/adr-primer.md) | [ADR index](README.md)

## Status

Proposed — **stub**; full Context / Decision / Consequences to be authored in Phase 5.

## Seed context

The frontend ships as static HTML (prerendered) + PWA assets. Cloudflare Pages provides a global edge network with automatic HTTPS, per-PR preview deploys, a free tier with generous build minutes and unlimited bandwidth, and native integration with Cloudflare DNS. Alternatives evaluated: Vercel (limits & commercial fair-use questions), Netlify (slightly tighter free-tier bandwidth), GitHub Pages (no preview deploys, no edge redirects), traditional PaaS (overkill for static). Detailed rationale is in [`docs/LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md`](../../LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md).

## Context

TODO — expand into 2–6 paragraphs covering the comparison matrix.

## Decision

TODO — one imperative sentence + elaboration.

**Working statement:** Deploy the Angular 21 prerendered build to Cloudflare Pages on the free tier. Use Cloudflare DNS for `wheelchairtaxipro.com`; API lives on a separate PaaS host behind `api.wheelchairtaxipro.com`.

## Consequences

TODO — Positive / Negative / Neutral lists. Flag the China-reachability trade-off (see ADR-0008 / §11).

## Related chapters

- [§2 Constraints](../02-constraints.md)
- [§7 Deployment View](../07-deployment-view.md)
- [§11 Risks and Technical Debts](../11-risks-and-technical-debts.md)
