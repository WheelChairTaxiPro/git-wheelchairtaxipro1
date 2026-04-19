---
title: arc42 primer
language: en
source: null
last_updated: 2026-04-19
status: stub
---

# arc42 — what it is and why we use it

> [繁體中文版 (zh-HK)](arc42-primer.zh-HK.md) | [Master Index](../00-index.md)

## Table of contents

<!-- TODO: fill in during Phase 1. -->

---

## Status

This primer is a **stub**. Full content will be written in **Phase 1** of the approved plan. The summary below is enough for a reader to get oriented today.

## One-line definition

**arc42** is a free, open-source template for documenting software architecture, organised into **12 fixed sections** that together answer "what is this system, why is it built this way, and how does it work?"

## Why arc42

- **Free and open-source** (Creative Commons) — no licensing cost, no vendor lock-in.
- **Widely adopted** in industry; new developers who have seen it before will immediately know where to find things.
- **Method-agnostic** — it does not force you into a particular diagramming notation, development process, or technology stack. It pairs naturally with C4 for diagrams, ADRs for decisions, and whatever quality anchors you choose.
- **Audience-friendly** — the 12-section order roughly tracks how different readers think: §1 answers "why", §3 answers "where are the edges", §4–§7 answer "how is it built", §10 answers "how well does it perform", §12 answers "what do the words mean".

## The 12 sections

| § | Title | Answers the question |
|---|---|---|
| 1 | Introduction and Goals | What problem do we solve, for whom, and what "done" looks like? |
| 2 | Constraints | What must we live with (tech, org, regulatory)? |
| 3 | Context and Scope | Where is the system boundary; what is outside? |
| 4 | Solution Strategy | What is the big-picture approach? |
| 5 | Building Block View | What are the static parts (modules / components)? |
| 6 | Runtime View | How do they interact over time for key flows? |
| 7 | Deployment View | Where does it run; how does CI/CD work? |
| 8 | Cross-cutting Concepts | What applies everywhere (i18n, logging, errors)? |
| 9 | Architecture Decisions | What were the key choices and why (links to ADRs)? |
| 10 | Quality Requirements | What are the non-functionals and how are they measured? |
| 11 | Risks and Technical Debts | What keeps us up at night; what shortcuts did we take? |
| 12 | Glossary | What does each term mean (bilingual here)? |

## Reading order for this project

The **Master Index** at [`00-index.md`](../00-index.md) gives tailored reading paths for (a) new developers and (b) business stakeholders.

## How we customised arc42

- Every section is **bilingual**: `NN-title.md` (EN) + `NN-title.zh-HK.md` (zh-HK).
- Diagrams are **Mermaid** and embedded in their home chapter — we do not use a separate image folder.
- Decisions live in [`../adr/`](../adr/) as individual ADRs; §9 is an **index** of those ADRs.
- Quality requirements (§10) are anchored to **WCAG 2.2 AA** + **Core Web Vitals** — see [`wcag-and-web-vitals-primer.md`](wcag-and-web-vitals-primer.md).

## Further reading

- Official site: [arc42.org](https://arc42.org/)
- Template with hints: [arc42.org/overview](https://arc42.org/overview)
- Creative Commons licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

<!-- When you add/rename a heading, update the Table of contents above. -->
