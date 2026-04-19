---
arc42_section: 03
title: 情境與範圍
language: zh-HK
source: 03-context-and-scope.md
last_updated: 2026-04-19
last_synced_with_en: 2026-04-19
status: stub
---

# 3. 情境與範圍

> [English version](03-context-and-scope.md) | [arc42 導讀](_methodology/arc42-primer.zh-HK.md) | [C4 導讀](_methodology/c4-model-primer.zh-HK.md) | [主目錄](00-index.zh-HK.md)

## 目錄

<!-- TODO：於 Phase 2 撰寫時填寫。 -->

---

## 狀態

本章為 **草稿 (stub)**。內容將於已核准計劃的 **Phase 2** 撰寫，是業務持份者於 §1 之後閱讀的第一章。

## 預定範圍

- **C4 Level 1 系統情境圖**（Mermaid）：顯示乘客（外部角色）、Wheelchair Taxi Pro（我方系統，單一方格）、外部系統 — Google Maps JavaScript / Places / Directions API、SMTP/SendGrid 電郵、Google Analytics 4、Google Search Console、Google Business Profile、Facebook 專頁、以及調度郵箱
- **業務情境**：香港輪椅的士市場、已知競爭對手 (hkwheelchairtaxis.com、hkwheelchair51846193.com、hongkongcaringtaxi.com) 及我方定位
- **外部介面目錄**：對每個外部系統列明協定、驗證方式、SLA／可用性立場、資料分類 (PII 對比公開資料)
- **範圍邊界**：明確列出納入及不納入項目，對應 README §Phase 1 及 §Phase 1 Out of scope

## 主要輸入來源

- [`README.md`](../../README.md) §Architecture、§Phase 1 (MVP) Scope、§Target competitors
- [`initial-design/WheelchairTaxiPro_Communication.md`](../../initial-design/WheelchairTaxiPro_Communication.md)
- [`initial-design/6-wheelchair_taxi_website_platform_proposal_bilingual_v_2.md`](../../initial-design/6-wheelchair_taxi_website_platform_proposal_bilingual_v_2.md)
- [`initial-design/14-Backend-wheelchair_taxi_pro_backend_plan_v_2_no_mediat_r.md`](../../initial-design/14-Backend-wheelchair_taxi_pro_backend_plan_v_2_no_mediat_r.md)

## 相關 ADR

- [ADR-0008 以 IMapProvider 介面支援中國擴展](adr/0008-imapprovider-adapter-for-china-expansion.zh-HK.md)
- [ADR-0009 Phase 1 僅以電郵處理預約](adr/0009-email-only-bookings-in-phase-1.zh-HK.md)

<!-- 新增或更名標題時，請同步更新上方目錄。 -->
