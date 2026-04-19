---
adr_number: "0009"
title: Email-only bookings in Phase 1 (no database)
status: Proposed
date: 2026-04-19
deciders: project owner
language: en
supersedes: null
superseded_by: null
---

# ADR-0009: Email-only bookings in Phase 1 (no database)

> [繁體中文版 (zh-HK)](0009-email-only-bookings-in-phase-1.zh-HK.md) | [ADR primer](../_methodology/adr-primer.md) | [ADR index](README.md)

## Status

Proposed — **stub**; full Context / Decision / Consequences to be authored in Phase 5.

## Seed context

Phase 1 is a 6-week MVP. Building a booking database + admin UI + user accounts would eat most of the budget and distract from the primary goal: winning HK SEO visibility. The simpler path: the booking endpoint composes a structured email via SMTP (or SendGrid) and sends two emails — one to the dispatcher mailbox, one confirmation to the rider. The operator then phones or WhatsApp-replies to confirm. No database, no admin dashboard, no auth. Phase 2 adds EF Core persistence and an admin surface.

## Context

TODO — expand into 2–6 paragraphs. Include a worked example of the email payload shape.

## Decision

TODO — one imperative sentence + elaboration.

**Working statement:** In Phase 1, the `/api/bookings` endpoint validates input, composes operator + confirmation emails, and dispatches them via `IEmailSender`. No persistence layer is provisioned. The operator mailbox is the system of record until Phase 2.

## Consequences

TODO — Positive / Negative / Neutral lists. Flag: no analytics on bookings beyond GA4 conversion events; no dispute trail beyond the mailbox; migration to Phase 2 DB must preserve whatever happened via email.

## Related chapters

- [§4 Solution Strategy](../04-solution-strategy.md)
- [§6 Runtime View](../06-runtime-view.md)
- [§11 Risks and Technical Debts](../11-risks-and-technical-debts.md)
