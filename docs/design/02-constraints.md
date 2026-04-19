---
arc42_section: 02
title: Constraints
language: en
source: null
last_updated: 2026-04-19
status: stub
---

# 2. Constraints

> [繁體中文版 (zh-HK)](02-constraints.zh-HK.md) | [arc42 primer](_methodology/arc42-primer.md) | [Master Index](00-index.md)

## Table of contents

<!-- TODO: fill in during Phase 3. -->

---

## Status

This chapter is a **stub**. Content will be authored in **Phase 3** of the approved plan.

## Planned scope

- **Technical constraints**: Angular 21 LTS, .NET 10 LTS, Node.js 22 LTS, Cloudflare Pages free tier, Mermaid-only diagrams, GitHub-flavoured markdown rendering, no paid diagramming tools, no MediatR
- **Organisational constraints**: ~6-week Phase 1 MVP window, solo or small-team initial development, bilingual copy (zh-HK + EN) required for every user-visible surface, GitFlow with `main` / `staging` / `develop` long-lived branches
- **Regulatory constraints**: Hong Kong Personal Data Privacy Ordinance (PDPO) for rider PII (phone, email); accessibility target WCAG 2.2 Level AA; GDPR posture for any EU visitors; Google Maps / Places / Directions API terms of service
- **Business-model constraints**: single default business identity in Phase 1 (one dispatch mailbox, one phone, one WhatsApp, one WeChat); no payments in Phase 1; no driver apps in Phase 1

## Primary inputs

- [`README.md`](../../README.md) §Tech Stack, §Support windows
- [`CONTRIBUTING.md`](../../CONTRIBUTING.md) §Prerequisites, §Branching
- [`docs/LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md`](../LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md) §Limits
- [`initial-design/11-SoftwareTools.md`](../../initial-design/11-SoftwareTools.md)

## Related ADRs

- [ADR-0002 Use Angular 21 + .NET 10 LTS + Node 22 LTS](adr/0002-use-angular-21-and-dotnet-10-lts.md)
- [ADR-0005 Host frontend on Cloudflare Pages](adr/0005-cloudflare-pages-for-frontend-hosting.md)
- [ADR-0007 GitFlow branching model](adr/0007-gitflow-branching-model.md)

<!-- When you add/rename a heading, update the Table of contents above. -->
