---
adr_number: "0002"
title: Use Angular 21 + .NET 10 LTS + Node 22 LTS
status: Proposed
date: 2026-04-19
deciders: project owner
language: en
supersedes: null
superseded_by: null
---

# ADR-0002: Use Angular 21 + .NET 10 LTS + Node 22 LTS

> [繁體中文版 (zh-HK)](0002-use-angular-21-and-dotnet-10-lts.zh-HK.md) | [ADR primer](../_methodology/adr-primer.md) | [ADR index](README.md)

## Status

Proposed — **stub**; full Context / Decision / Consequences to be authored in Phase 5.

## Seed context

The project is greenfield in 2026 and intended to run for multiple years. Angular and .NET both operate LTS release cadences with extended support windows. Picking LTS at the start (Angular 21 LTS, .NET 10 LTS, Node 22 LTS as the required Node for Angular 21 tooling) buys predictable security-patch coverage and avoids a mid-Phase-1 forced migration. Support windows are documented in [`README.md` §Support windows](../../../README.md).

## Context

TODO — expand into 2–6 paragraphs.

## Decision

TODO — one imperative sentence + elaboration.

**Working statement:** Adopt Angular 21 (frontend), .NET 10 LTS (backend), and Node.js 22 LTS (build/tooling). Upgrade only to subsequent LTS releases; skip non-LTS intermediate majors unless a specific feature is required.

## Consequences

TODO — Positive / Negative / Neutral lists.

## Related chapters

- [§2 Constraints](../02-constraints.md)
