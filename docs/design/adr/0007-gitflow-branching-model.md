---
adr_number: "0007"
title: GitFlow branching (`main` / `staging` / `develop`)
status: Proposed
date: 2026-04-19
deciders: project owner
language: en
supersedes: null
superseded_by: null
---

# ADR-0007: GitFlow branching (`main` / `staging` / `develop`)

> [繁體中文版 (zh-HK)](0007-gitflow-branching-model.zh-HK.md) | [ADR primer](../_methodology/adr-primer.md) | [ADR index](README.md)

## Status

Proposed — **stub**; full Context / Decision / Consequences to be authored in Phase 5.

## Seed context

We operate three environments (production, staging, per-PR preview). A branch model with one long-lived branch per environment (`main` → production, `staging` → staging, `develop` → preview + integration) maps cleanly to this. Short-lived `feature/*`, `fix/*`, `release/*`, and `hotfix/*` branches carry in-flight work and merge back through PRs. Documented in [`CONTRIBUTING.md` §Branching](../../../CONTRIBUTING.md).

## Context

TODO — expand into 2–6 paragraphs. Discuss GitHub Flow (single `main` + PRs) as the alternative and why it was rejected for a three-environment setup.

## Decision

TODO — one imperative sentence + elaboration.

**Working statement:** Adopt GitFlow with three long-lived branches (`main`, `staging`, `develop`) and conventional short-lived prefixes (`feature/`, `fix/`, `release/`, `hotfix/`). All merges are via PR; direct pushes to long-lived branches are forbidden via branch protection.

## Consequences

TODO — Positive / Negative / Neutral lists.

## Related chapters

- [§2 Constraints](../02-constraints.md)
- [§7 Deployment View](../07-deployment-view.md)
