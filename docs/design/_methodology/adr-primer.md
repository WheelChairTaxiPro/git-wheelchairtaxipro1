---
title: ADR primer
language: en
source: null
last_updated: 2026-04-19
status: stub
---

# Architecture Decision Records (ADRs) — what they are

> [繁體中文版 (zh-HK)](adr-primer.zh-HK.md) | [Master Index](../00-index.md)

## Table of contents

<!-- TODO: fill in during Phase 1. -->

---

## Status

This primer is a **stub**. Full content will be written in **Phase 1** of the approved plan, alongside the ADR template.

## One-line definition

An **Architecture Decision Record (ADR)** is a short, append-only markdown file that captures **one architectural decision** — its context, the decision itself, and its consequences — so future readers understand **why** the code is the way it is.

## Why ADRs

- Code answers "**how**". ADRs answer "**why**".
- New joiners can read the ADR folder and understand the system's history in an hour.
- When we reconsider a decision later, we have a single source-of-truth record that shows what the world looked like when we made it, and we supersede it (rather than overwrite it) so history is preserved.

## Structure of one ADR

Every ADR has the same four parts. See [`../adr/_template.md`](../adr/_template.md) for the exact template.

| Part | Contents |
|---|---|
| **Status** | Proposed / Accepted / Deprecated / Superseded by ADR-NNNN |
| **Context** | What forces led to this decision? (The situation, the constraints, the problem.) |
| **Decision** | What did we decide? (One clear sentence, then elaboration.) |
| **Consequences** | What becomes easier? What becomes harder? What trade-offs did we accept? |

Some teams add optional parts (Options Considered, Related ADRs, References). We allow these at the author's discretion.

## Rules we follow in this project

- **Numbering is zero-padded four digits**: `0001`, `0002`, …, `0012`, `0013`, …
- **Filenames are lowercase-kebab-case**: `0003-signals-first-state-management.md`
- **Every ADR has a bilingual sibling**: `NNNN-slug.zh-HK.md`
- **ADRs are append-only**: once Accepted, you do not edit the Decision or Context sections. You write a **new** ADR that supersedes the old one. The old one's Status is updated to `Superseded by ADR-NNNN` and a link is added, but its content is preserved.
- **Status updates are allowed** — "Proposed → Accepted" or "Accepted → Superseded by …" are metadata, not content changes.
- **One decision per ADR** — if you find yourself listing two alternatives, write two ADRs.
- **Link from the relevant arc42 chapter** — e.g. [§4 Solution Strategy](../04-solution-strategy.md) and [§9 Architecture Decisions](../09-architecture-decisions.md) both link to every ADR.

## How to add a new ADR

1. Look at the highest-numbered file in [`../adr/`](../adr/). Pick the next number.
2. Copy [`../adr/_template.md`](../adr/_template.md) to `../adr/NNNN-short-slug.md`.
3. Copy [`../adr/_template.zh-HK.md`](../adr/_template.zh-HK.md) to `../adr/NNNN-short-slug.zh-HK.md`.
4. Fill in Status = `Proposed`, Context, Decision, Consequences.
5. Add a row to the table in [`../09-architecture-decisions.md`](../09-architecture-decisions.md) and its zh-HK sibling.
6. Open a PR.
7. On merge, change Status to `Accepted` (or reject by setting `Rejected`).

## Further reading

- Michael Nygard's original post: [Documenting Architecture Decisions](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [adr.github.io](https://adr.github.io/) — community collection of templates and tools
- Joel Parker Henderson's curated list: [github.com/joelparkerhenderson/architecture-decision-record](https://github.com/joelparkerhenderson/architecture-decision-record)

<!-- When you add/rename a heading, update the Table of contents above. -->
