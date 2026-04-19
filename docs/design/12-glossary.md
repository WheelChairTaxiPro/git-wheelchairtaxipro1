---
arc42_section: 12
title: Glossary
language: en
source: null
last_updated: 2026-04-19
status: stub
---

# 12. Glossary

> [繁體中文版 (zh-HK)](12-glossary.zh-HK.md) | [arc42 primer](_methodology/arc42-primer.md) | [Master Index](00-index.md)

## A-Z jump

[A](#a) · [B](#b) · [C](#c) · [D](#d) · [E](#e) · [F](#f) · [G](#g) · [H](#h) · [I](#i) · [J](#j) · [K](#k) · [L](#l) · [M](#m) · [N](#n) · [O](#o) · [P](#p) · [Q](#q) · [R](#r) · [S](#s) · [T](#t) · [U](#u) · [V](#v) · [W](#w) · [X](#x) · [Y](#y) · [Z](#z) · [中文詞](#chinese-terms)

<!-- TOC note: this chapter uses an A-Z jump row instead of a section TOC (see docs/design/README.md §TOC convention). -->

---

## Status

This chapter is a **stub**. Content will be authored in **Phase 2** of the approved plan. It will grow continuously as new terms are introduced in other chapters.

## Planned scope

A **bilingual glossary** covering every domain and technical term used anywhere in the Design & Specification. Each entry lists the English term, the zh-HK term, a short definition, and links to the chapter(s) where the term is used.

Planned initial entries (alphabetical):

### Domain terms

- **Wheelchair taxi** / 輪椅的士 — A taxi fitted with a ramp or lift allowing a passenger to board while seated in a wheelchair.
- **Pickup** / 上車點 — The geographic point where the rider boards.
- **Drop-off** / 落車點 — The geographic point where the rider disembarks.
- **Tunnel fee** / 隧道費 — Road-usage charge added to certain HK cross-harbour routes.
- **Surcharge** / 附加費 — Extra fees applied on top of the base fare (night, baggage, etc.).
- **Carer** / 照顧者 — Person accompanying the rider.
- **Dispatcher** / 調度員 — Staff member who receives and assigns bookings.

### Technical terms

- **arc42** — The 12-section architecture-documentation template this spec uses.
- **C4 Model** — The four-zoom-level diagram methodology (Context · Container · Component · Code).
- **ADR** / 架構決策紀錄 — Architecture Decision Record; one-page record of a single decision.
- **Vertical slice** / 垂直切片 — A feature-shaped folder owning UI, data, tests, and routes for one user-facing capability.
- **Signal** — Angular 21's reactive primitive; a variable that auto-notifies readers when its value changes.
- **PWA** / 漸進式網絡應用程式 — Progressive Web App; a website installable like a native app.
- **SSG** — Static Site Generation; rendering HTML at build time rather than per-request.
- **LTS** — Long-Term Support; a release with extended support window.
- **PoP** — Point of Presence; an edge server location in a CDN.
- **hreflang** — HTML attribute that tells search engines which language/locale a page targets.

### Acronyms

- **GEO** — Generative Engine Optimization; SEO for AI-generated answer engines.
- **AEO** — Answer Engine Optimization; optimising content to be cited by AI answer engines.
- **SEO** — Search Engine Optimization.
- **WCAG** — Web Content Accessibility Guidelines (W3C/WAI).
- **CWV** — Core Web Vitals (Google's UX metric program).
- **LCP** — Largest Contentful Paint.
- **INP** — Interaction to Next Paint.
- **CLS** — Cumulative Layout Shift.
- **SLO** — Service Level Objective.
- **CORS** — Cross-Origin Resource Sharing.
- **PDPO** — Personal Data (Privacy) Ordinance — Hong Kong privacy law.
- **PII** — Personally Identifiable Information.

### Chinese terms

<a id="chinese-terms"></a>

*(Phase 2 will add the zh-HK → EN reverse lookup table here, for readers who encounter an unfamiliar term in the zh-HK documents.)*

## Primary inputs

- All files under [`initial-design/`](../../initial-design/) (collected progressively as chapters are written)
- [`frontend/ARCHITECTURE.md`](../../frontend/ARCHITECTURE.md)
- [`README.md`](../../README.md)
- Methodology primers in [`_methodology/`](_methodology/)

<!-- When you add a new term anywhere in the spec, add it here (alphabetical). -->
