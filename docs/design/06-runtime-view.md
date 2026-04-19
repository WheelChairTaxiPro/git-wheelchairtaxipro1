---
arc42_section: 06
title: Runtime View
language: en
source: null
last_updated: 2026-04-19
status: stub
---

# 6. Runtime View

> [繁體中文版 (zh-HK)](06-runtime-view.zh-HK.md) | [arc42 primer](_methodology/arc42-primer.md) | [Master Index](00-index.md)

## Table of contents

<!-- TODO: fill in during Phase 4. -->

---

## Status

This chapter is a **stub**. Content will be authored in **Phase 4** of the approved plan.

## Planned scope

Three key runtime flows, each rendered as a Mermaid sequence diagram with accompanying narrative:

1. **Booking submit happy path** — User drops pickup pin → drops drop-off pin → map computes route + fare estimate → taps "Book now" → navigates to `/booking` with selection preserved via `TripStateService` → fills form → submits → API validates → `IEmailSender` dispatches to operator mailbox + confirmation to rider → UI shows success page.
2. **Map → Booking state handoff** — How a `TripSelection` signal travels from the `map/` slice through the `shared/services/TripStateService` to the `booking/` slice without the two slices importing each other (vertical-slice isolation).
3. **Language detection & switching** — First visit: read `Accept-Language` header + geolocation hint → choose default (`zh-HK` or `en`) → hreflang + canonical tags set → persistent switcher writes to `localStorage` and URL.
4. *(optional)* **Contact-strip click tracking** — Phone / WhatsApp / WeChat tap → rate-limit check → GA4 event → `tel:` / `wa.me` / WeChat deep link fires.

## Primary inputs

- [`initial-design/13-4-wheelchair_taxi_pro_booking_form_pricing_content_????.md`](../../initial-design/13-4-wheelchair_taxi_pro_booking_form_pricing_content_中英對照.md)
- [`initial-design/WheelchairTaxiPro_Communication.md`](../../initial-design/WheelchairTaxiPro_Communication.md)
- [`initial-design/13-2-wheelchair_taxi_pro_wireframe_description_v_4.md`](../../initial-design/13-2-wheelchair_taxi_pro_wireframe_description_v_4.md)
- [`initial-design/15-phase1-build-order.md`](../../initial-design/15-phase1-build-order.md) §Shared contract (TripSelection + TripStateService)
- [`frontend/ARCHITECTURE.md`](../../frontend/ARCHITECTURE.md) §4a State management

## Related ADRs

- [ADR-0003 Signals-first state management](adr/0003-signals-first-state-management.md)
- [ADR-0009 Email-only bookings in Phase 1](adr/0009-email-only-bookings-in-phase-1.md)
- [ADR-0010 Bilingual default zh-HK with EN mirror](adr/0010-bilingual-zh-hk-default-with-en-mirror.md)

<!-- When you add/rename a heading, update the Table of contents above. -->
