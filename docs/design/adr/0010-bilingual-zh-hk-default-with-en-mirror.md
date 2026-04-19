---
adr_number: "0010"
title: Bilingual default zh-HK with EN mirror at `/en/…`
status: Proposed
date: 2026-04-19
deciders: project owner
language: en
supersedes: null
superseded_by: null
---

# ADR-0010: Bilingual default zh-HK with EN mirror at `/en/…`

> [繁體中文版 (zh-HK)](0010-bilingual-zh-hk-default-with-en-mirror.zh-HK.md) | [ADR primer](../_methodology/adr-primer.md) | [ADR index](README.md)

## Status

Proposed — **stub**; full Context / Decision / Consequences to be authored in Phase 5.

## Seed context

The primary market is Hong Kong; most rider searches will be in zh-HK. Secondary audiences are English-speaking HK residents, expats, and tourists. We serve zh-HK at the root (`/…`) and mirror every page at `/en/…`. Language is auto-detected on first visit (`Accept-Language` + geolocation hint), surfaced via a persistent switcher in the UI, persisted in `localStorage`, and signalled to search engines via `hreflang` tags and per-language canonical URLs.

## Context

TODO — expand into 2–6 paragraphs covering why `/en/…` path prefix rather than subdomain, and the URL design trade-offs.

## Decision

TODO — one imperative sentence + elaboration.

**Working statement:** Serve zh-HK at the root of the domain; mirror every public route at `/en/…`. Set `lang` on `<html>`, emit `hreflang` tags pairing the two URLs, and emit a self-canonical per-language. Persist user choice in `localStorage` and in the URL.

## Consequences

TODO — Positive / Negative / Neutral lists. Flag: every user-visible string must ship in both languages; string freeze applies during UI review.

## Related chapters

- [§1 Introduction and Goals](../01-introduction-and-goals.md)
- [§8 Cross-cutting Concepts](../08-cross-cutting-concepts.md)
- [§10 Quality Requirements](../10-quality-requirements.md)
