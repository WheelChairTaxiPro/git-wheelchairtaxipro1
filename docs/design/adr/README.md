# Architecture Decision Records (ADR) index

> [繁體中文版 (zh-HK)](README.zh-HK.md) | [ADR primer](../_methodology/adr-primer.md) | [Master Index](../00-index.md)

This folder contains one file per architectural decision. Each ADR is bilingual (EN + zh-HK).

For **what an ADR is and how to write one**, read [`_methodology/adr-primer.md`](../_methodology/adr-primer.md) first.

## Index

The authoritative catalogue with status and one-line summaries lives in [§9 Architecture Decisions](../09-architecture-decisions.md).

## Quick links — 12 initial ADRs (to be filled in Phase 5)

| # | File | Title |
|---|---|---|
| 0001 | [`0001-use-vertical-slice-architecture.md`](0001-use-vertical-slice-architecture.md) | Use Vertical Slice Architecture |
| 0002 | [`0002-use-angular-21-and-dotnet-10-lts.md`](0002-use-angular-21-and-dotnet-10-lts.md) | Use Angular 21 + .NET 10 LTS + Node 22 LTS |
| 0003 | [`0003-signals-first-state-management.md`](0003-signals-first-state-management.md) | Signals-first state management |
| 0004 | [`0004-no-mediatr.md`](0004-no-mediatr.md) | No MediatR |
| 0005 | [`0005-cloudflare-pages-for-frontend-hosting.md`](0005-cloudflare-pages-for-frontend-hosting.md) | Cloudflare Pages for frontend hosting |
| 0006 | [`0006-static-prerender-via-angular-ssr.md`](0006-static-prerender-via-angular-ssr.md) | Static prerender via `@angular/ssr` |
| 0007 | [`0007-gitflow-branching-model.md`](0007-gitflow-branching-model.md) | GitFlow branching |
| 0008 | [`0008-imapprovider-adapter-for-china-expansion.md`](0008-imapprovider-adapter-for-china-expansion.md) | IMapProvider adapter |
| 0009 | [`0009-email-only-bookings-in-phase-1.md`](0009-email-only-bookings-in-phase-1.md) | Email-only bookings in Phase 1 |
| 0010 | [`0010-bilingual-zh-hk-default-with-en-mirror.md`](0010-bilingual-zh-hk-default-with-en-mirror.md) | Bilingual default zh-HK with EN mirror |
| 0011 | [`0011-target-wcag-2-2-level-aa.md`](0011-target-wcag-2-2-level-aa.md) | Target WCAG 2.2 Level AA |
| 0012 | [`0012-target-core-web-vitals-good-thresholds.md`](0012-target-core-web-vitals-good-thresholds.md) | Target Core Web Vitals "Good" thresholds |

## How to add a new ADR

1. Next number = highest existing + 1. Zero-pad to four digits.
2. Copy [`_template.md`](_template.md) → `NNNN-short-kebab-slug.md`
3. Copy [`_template.zh-HK.md`](_template.zh-HK.md) → `NNNN-short-kebab-slug.zh-HK.md`
4. Fill in Status = `Proposed`, Context, Decision, Consequences (both files).
5. Add a row to [`../09-architecture-decisions.md`](../09-architecture-decisions.md) and its zh-HK sibling.
6. Open a PR. On merge, change Status to `Accepted`.

## Rules

- **Append-only content**. Never edit a decided ADR's Context or Decision. To reverse a decision, write a **new** ADR that supersedes the old one (set the old one's Status to `Superseded by ADR-NNNN` with a link).
- **One decision per file**.
- **Bilingual parity**. Every ADR must have both `.md` and `.zh-HK.md`.
- **Naming**: `NNNN-short-kebab-slug.md` — lowercase, hyphens only, ASCII-only in the filename slug.

## Meta files in this folder

- `README.md` / `README.zh-HK.md` — this file and its zh-HK sibling (folder landing page)
- `_template.md` / `_template.zh-HK.md` — starting template for new ADRs (underscore prefix keeps them at the top of the folder listing)
