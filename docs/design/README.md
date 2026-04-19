# Design & Specification

> [繁體中文版 (zh-HK)](README.zh-HK.md)

This folder contains the **canonical Design & Specification** for Wheelchair Taxi Pro, structured around four industry-standard methodologies:

- **[arc42](_methodology/arc42-primer.md)** — 12-section documentation skeleton
- **[C4 Model](_methodology/c4-model-primer.md)** — four-zoom-level diagrams (Context · Container · Component · Code), rendered with Mermaid
- **[Architecture Decision Records (ADRs)](_methodology/adr-primer.md)** — one-page records of architectural choices
- **[WCAG 2.2 + Core Web Vitals](_methodology/wcag-and-web-vitals-primer.md)** — explicit anchors for accessibility and performance quality goals

> **First time seeing these four names together?** Read the standalone, shareable primer before diving into the spec: [`../LearningNotes/arc42-c4-adrs-wcag-and-web-vitals-explained.md`](../LearningNotes/arc42-c4-adrs-wcag-and-web-vitals-explained.md). It explains what each methodology is, why it was adopted, and how the four fit together — in one article, with further-reading links.

## Start here

| If you are… | Read… |
|---|---|
| New to arc42 / C4 / ADRs / WCAG / Web Vitals | [`../LearningNotes/arc42-c4-adrs-wcag-and-web-vitals-explained.md`](../LearningNotes/arc42-c4-adrs-wcag-and-web-vitals-explained.md) — plain-English walkthrough |
| A **new developer** joining the project | [`00-index.md`](00-index.md) — full reading path |
| A **business stakeholder** | [`01-introduction-and-goals.md`](01-introduction-and-goals.md) → [`03-context-and-scope.md`](03-context-and-scope.md) → [`10-quality-requirements.md`](10-quality-requirements.md) → [`12-glossary.md`](12-glossary.md) |
| Here to **record a decision** | [`adr/README.md`](adr/README.md) |
| Wondering **what these methodologies are** in-repo | [`_methodology/`](_methodology/) |

## Relationship to `initial-design/`

The [`initial-design/`](../../initial-design/) folder contains the **raw research, proposals, and early drafts** that fed into this formal spec. Those documents remain available for historical context, but **this folder is the primary reference** for building the system.

## Bilingual

Every document in this folder ships as **two sibling files**:

- `<filename>.md` — English (source of truth)
- `<filename>.zh-HK.md` — 繁體中文 (香港)

Cross-links between documents use plain relative paths; language is implied by the filename suffix. Each page has a language-switcher link at the top.

## Status

Skeleton created in Phase 0. Content is being filled in over Phases 1–5 as described in the approved plan. Stubs are clearly marked `status: stub` in their front matter and include their planned scope and primary inputs.

---

*Last updated: 2026-04-19*
