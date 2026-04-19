---
title: Master Index
language: en
source: null
last_updated: 2026-04-19
status: active
---

# Master Index — Design & Specification

> [繁體中文版 (zh-HK)](00-index.zh-HK.md) | [Folder README](README.md)

This is the **entry point** for the formal Design & Specification. Start here and follow the reading path that matches your role.

## Reading paths

### For a new developer (full depth, ~60 min)

1. [`_methodology/arc42-primer.md`](_methodology/arc42-primer.md) — how this spec is organized
2. [`_methodology/c4-model-primer.md`](_methodology/c4-model-primer.md) — how to read the diagrams
3. [`_methodology/adr-primer.md`](_methodology/adr-primer.md) — how decisions are recorded
4. [`01-introduction-and-goals.md`](01-introduction-and-goals.md) — what we are building and why
5. [`02-constraints.md`](02-constraints.md) — what we must live with
6. [`03-context-and-scope.md`](03-context-and-scope.md) — system boundaries
7. [`04-solution-strategy.md`](04-solution-strategy.md) — the big-picture approach
8. [`05-building-block-view.md`](05-building-block-view.md) — static structure
9. [`06-runtime-view.md`](06-runtime-view.md) — dynamic behaviour
10. [`07-deployment-view.md`](07-deployment-view.md) — where it runs
11. [`08-cross-cutting-concepts.md`](08-cross-cutting-concepts.md) — everything that touches every slice
12. [`09-architecture-decisions.md`](09-architecture-decisions.md) — decision catalogue (ADR index)
13. [`10-quality-requirements.md`](10-quality-requirements.md) — non-functional requirements
14. [`11-risks-and-technical-debts.md`](11-risks-and-technical-debts.md) — known risks + accepted debts
15. [`12-glossary.md`](12-glossary.md) — domain + technical vocabulary

### For a business stakeholder (~15 min)

1. [`01-introduction-and-goals.md`](01-introduction-and-goals.md)
2. [`03-context-and-scope.md`](03-context-and-scope.md)
3. [`10-quality-requirements.md`](10-quality-requirements.md)
4. [`12-glossary.md`](12-glossary.md)

### For a reviewer recording a new decision

1. [`adr/README.md`](adr/README.md) — how to write an ADR
2. [`adr/_template.md`](adr/_template.md) — copy this
3. Increment the number (next ADR is `0013-...`)
4. Link it from [`09-architecture-decisions.md`](09-architecture-decisions.md)

## Document map

### Methodology primers

| File | What it explains |
|---|---|
| [`_methodology/arc42-primer.md`](_methodology/arc42-primer.md) | The 12-section arc42 template and why we chose it |
| [`_methodology/c4-model-primer.md`](_methodology/c4-model-primer.md) | The four C4 zoom levels and Mermaid notation |
| [`_methodology/adr-primer.md`](_methodology/adr-primer.md) | What an ADR is, template, numbering, immutability rules |
| [`_methodology/wcag-and-web-vitals-primer.md`](_methodology/wcag-and-web-vitals-primer.md) | WCAG 2.2 AA and Core Web Vitals as quality anchors |

### arc42 chapters (§1 – §12)

| § | File | Covers |
|---|---|---|
| 1 | [`01-introduction-and-goals.md`](01-introduction-and-goals.md) | Problem, users, top-3 quality goals, KPIs |
| 2 | [`02-constraints.md`](02-constraints.md) | Technical / organisational / regulatory constraints |
| 3 | [`03-context-and-scope.md`](03-context-and-scope.md) | System boundary + C4 L1 Context diagram |
| 4 | [`04-solution-strategy.md`](04-solution-strategy.md) | Big-picture approach + Phase 1 build-order DAG |
| 5 | [`05-building-block-view.md`](05-building-block-view.md) | C4 L2 Container + C4 L3 Component diagrams |
| 6 | [`06-runtime-view.md`](06-runtime-view.md) | Sequence diagrams for key flows |
| 7 | [`07-deployment-view.md`](07-deployment-view.md) | Deployment topology + CI/CD |
| 8 | [`08-cross-cutting-concepts.md`](08-cross-cutting-concepts.md) | Bilingual, SEO/GEO/AEO, state management, logging, errors, anti-fraud |
| 9 | [`09-architecture-decisions.md`](09-architecture-decisions.md) | ADR catalogue (index only; ADRs live in `adr/`) |
| 10 | [`10-quality-requirements.md`](10-quality-requirements.md) | WCAG 2.2 AA, Web Vitals targets, SLOs, privacy, security |
| 11 | [`11-risks-and-technical-debts.md`](11-risks-and-technical-debts.md) | Known risks + accepted technical debts |
| 12 | [`12-glossary.md`](12-glossary.md) | Domain + technical vocabulary (EN ↔ zh-HK) |

### Architecture Decision Records

| ADR | Title |
|---|---|
| [0001](adr/0001-use-vertical-slice-architecture.md) | Use Vertical Slice Architecture (frontend + backend) |
| [0002](adr/0002-use-angular-21-and-dotnet-10-lts.md) | Use Angular 21 + .NET 10 LTS + Node 22 LTS |
| [0003](adr/0003-signals-first-state-management.md) | Signals-first state management; RxJS only for streams |
| [0004](adr/0004-no-mediatr.md) | No MediatR in the backend |
| [0005](adr/0005-cloudflare-pages-for-frontend-hosting.md) | Host frontend on Cloudflare Pages (free tier) |
| [0006](adr/0006-static-prerender-via-angular-ssr.md) | Static prerender via `@angular/ssr` (no SSR runtime) |
| [0007](adr/0007-gitflow-branching-model.md) | GitFlow branching (`main` / `staging` / `develop`) |
| [0008](adr/0008-imapprovider-adapter-for-china-expansion.md) | `IMapProvider` adapter for China expansion |
| [0009](adr/0009-email-only-bookings-in-phase-1.md) | Email-only bookings in Phase 1 (no database) |
| [0010](adr/0010-bilingual-zh-hk-default-with-en-mirror.md) | Bilingual default zh-HK with EN mirror at `/en/…` |
| [0011](adr/0011-target-wcag-2-2-level-aa.md) | Target WCAG 2.2 Level AA |
| [0012](adr/0012-target-core-web-vitals-good-thresholds.md) | Target Core Web Vitals "Good" thresholds |

## Status

| Phase | Deliverable | Status |
|---|---|---|
| 0 | Housekeeping + skeleton | **complete** |
| 1 | Methodology primers + ADR template + INDEX | stub — coming in Phase 1 |
| 2 | Stakeholder chapters (§1, §3, §10, §12) | stub — coming in Phase 2 |
| 3 | Technical chapters (§2, §4, §5, §7) | stub — coming in Phase 3 |
| 4 | Runtime + cross-cutting + risks (§6, §8, §11) | stub — coming in Phase 4 |
| 5 | 12 initial ADRs + §9 index | stub — coming in Phase 5 |

## Gaps register

Anything the spec does not yet cover is tracked here. New gaps are logged when a topic is identified but its chapter is not yet written.

| Topic | Tracked in | Status |
|---|---|---|
| — | — | (Phase 0 has no open gaps yet; gaps will be logged as content is authored.) |

---

*Last updated: 2026-04-19*
