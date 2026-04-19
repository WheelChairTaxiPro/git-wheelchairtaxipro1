---
title: WCAG 2.2 + Core Web Vitals primer
language: en
source: null
last_updated: 2026-04-19
status: stub
---

# WCAG 2.2 + Core Web Vitals — our quality anchors

> [繁體中文版 (zh-HK)](wcag-and-web-vitals-primer.zh-HK.md) | [Master Index](../00-index.md)

## Table of contents

<!-- TODO: fill in during Phase 1. -->

---

## Status

This primer is a **stub**. Full content will be written in **Phase 1** of the approved plan.

## Why these two, and why explicit?

Quality Requirements (§10) is the arc42 chapter that is easiest to fill with vague wishes ("the site should be fast and accessible"). We anchor the chapter to two **industry-standard, testable** frameworks so "fast" and "accessible" become numbers a developer can measure on every PR.

For a **wheelchair taxi service**, accessibility is not optional — it is a product requirement. WCAG 2.2 AA is the explicit standard.

For an **SEO-first project**, Core Web Vitals directly influence Google Search ranking. They are both a UX metric and an SEO lever.

## WCAG 2.2 at a glance

**WCAG (Web Content Accessibility Guidelines)** is the W3C/WAI standard for web accessibility. Version 2.2 is the current recommendation (published 2023).

- **Four principles** — content must be **P**erceivable, **O**perable, **U**nderstandable, **R**obust (POUR).
- **Three conformance levels** — A (minimum), **AA (our target)**, AAA (strictest).
- **Success criteria** — 2.2 adds nine new criteria over 2.1, notably around drag operations, focus appearance, target size, authentication cognitive load, and consistent help.
- Many jurisdictions (EU, US, UK, HK tendering) reference **Level AA** as the legal/procurement baseline.

We target **WCAG 2.2 Level AA** across every rider-facing page. See [ADR-0011](../adr/0011-target-wcag-2-2-level-aa.md) for the formal decision and rationale.

### How we test it

| Layer | Tool | When |
|---|---|---|
| Automated | axe-core (inside Playwright) | Every PR |
| Synthetic | Lighthouse accessibility audit | Every PR + nightly |
| Manual | Keyboard-only walkthrough | Before each release |
| Manual | Screen reader (VoiceOver / NVDA) | Before each release |
| Real users | Wheelchair-user beta round | Before Phase 1 launch |

## Core Web Vitals at a glance

**Core Web Vitals (CWV)** is Google's user-experience metric programme. Three metrics, each with a "Good / Needs Improvement / Poor" band measured at the **p75** (75th percentile) of real-user traffic.

| Metric | Measures | "Good" threshold |
|---|---|---|
| **LCP** (Largest Contentful Paint) | How long until the main content is visible | **≤ 2.5 s** |
| **INP** (Interaction to Next Paint) | Responsiveness to user input (replaces FID in 2024) | **≤ 200 ms** |
| **CLS** (Cumulative Layout Shift) | Visual stability (how much stuff jumps around) | **≤ 0.1** |

CWV feed into Google Search's page-experience signal, so hitting "Good" thresholds is both a UX win and an SEO win.

We target **"Good" on all three metrics at p75** for every public route. See [ADR-0012](../adr/0012-target-core-web-vitals-good-thresholds.md).

### How we test it

| Layer | Tool | When |
|---|---|---|
| Synthetic | Lighthouse CI | Every PR (budget gates) |
| Real users | Google Search Console CWV report | Production (ongoing) |
| Real users | GA4 Web Vitals events | Production (ongoing) |

## How these map into our spec

- The full testable criteria live in [§10 Quality Requirements](../10-quality-requirements.md) (bilingual).
- Each vertical slice (map / booking / pricing / contact-strip / faq / about) has **per-slice acceptance criteria** expressed in terms of WCAG success criteria and CWV budgets.
- Decisions about hosting (Cloudflare Pages) and rendering (static prerender via `@angular/ssr`) were made **primarily** to hit these targets — see [ADR-0005](../adr/0005-cloudflare-pages-for-frontend-hosting.md) and [ADR-0006](../adr/0006-static-prerender-via-angular-ssr.md).

## Further reading

- [WCAG 2.2 full specification](https://www.w3.org/TR/WCAG22/)
- [WebAIM quick reference](https://webaim.org/standards/wcag/checklist)
- [web.dev — Learn Core Web Vitals](https://web.dev/learn-core-web-vitals/)
- [Google Search Console — CWV report](https://support.google.com/webmasters/answer/9205520)

<!-- When you add/rename a heading, update the Table of contents above. -->
