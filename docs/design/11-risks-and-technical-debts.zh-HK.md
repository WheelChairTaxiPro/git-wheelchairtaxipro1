---
arc42_section: 11
title: 風險與技術債
language: zh-HK
source: 11-risks-and-technical-debts.md
last_updated: 2026-04-19
last_synced_with_en: 2026-04-19
status: stub
---

# 11. 風險與技術債

> [English version](11-risks-and-technical-debts.md) | [arc42 導讀](_methodology/arc42-primer.zh-HK.md) | [主目錄](00-index.zh-HK.md)

## 目錄

<!-- TODO：於 Phase 4 撰寫時填寫。 -->

---

## 狀態

本章為 **草稿 (stub)**。內容將於已核准計劃的 **Phase 4** 撰寫。

## 預定範圍

### 11.1 已知風險

依嚴重性排序。每項風險列明：可能性、影響、緩解措施、責任人。

- **單一 API 宿主成為單點故障** — Phase 1 API 僅於單一地區的一個 PaaS 實例運行。緩解：PaaS 自動修復 + 書面化人工故障轉移；因 Phase 1 流量低而可接受。
- **Cloudflare 於中國大陸的可達性** — Pages 網域由大陸網絡連接可能不穩。緩解：推遲至 Phase 2，屆時配合中國本土 CDN (Tencent EdgeOne) 處理。
- **電郵派送失敗** — SMTP / SendGrid 暫時錯誤會導致遺漏預約。緩解：重試機制 + 應用內確認備援 + 營運告警。
- **LLM 爬蟲流量** — 可能扭曲分析數字並增加流量費。緩解：使用 Cloudflare 預設 bot 管理 + 在 `robots.txt` 明確表態拒絕 AI 爬蟲。
- **競爭對手 SEO 反擊** — 現有香港輪椅的士網站可能加強相同關鍵字之 SEO 投入。緩解：依 [`initial-design/10-…affiliate_strategy…md`](../../initial-design/10-hosting_affiliate_strategy_for_wheelchair_taxi_pro_hong_kong.md) 持續投入內容與外鏈。
- **Google Maps API 費用失控** — 未設限的 API 金鑰易遭濫用。緩解：設定網域限制與計費告警。
- **無障礙倒退** — 無自動化測試時 a11y 缺陷易溜入。緩解：每 PR 跑 Playwright + axe，並設 Lighthouse 門檻。

### 11.2 已接受之技術債（Phase 1 範圍取捨）

以下為刻意的、時限性的取捨，將於 Phase 2 或以後補回。每項對應 Phase 2 待辦清單項目。

- **僅以電郵處理預約**（無資料庫、無管理後台）— ADR-0009
- **無認證 / 乘客帳戶** — Phase 1 乘客以匿名方式使用
- **無付款** — 乘車後現金 / 現有司機安排，不經系統
- **無即時車隊追蹤** — 推遲至 Phase 2
- **不向乘客發送 SMS / WhatsApp 推送** — 確認僅以電郵送達
- **單一業務身分**（一個電話、一個 WhatsApp、一個 WeChat）— 多司機調度為 Phase 2
- **暫不實作 Review schema** — 僅於有真實評論後才加入（避免空 review markup 被 Schema.org 處罰）

## 主要輸入來源

- [`README.md`](../../README.md) §Phase 1 Out of scope、§Phase 2 Roadmap
- [`initial-design/DiscussArchitectures.md`](../../initial-design/DiscussArchitectures.md)
- [`initial-design/10-hosting_affiliate_strategy_for_wheelchair_taxi_pro_hong_kong.md`](../../initial-design/10-hosting_affiliate_strategy_for_wheelchair_taxi_pro_hong_kong.md)

## 相關 ADR

- [ADR-0005 前端託管於 Cloudflare Pages](adr/0005-cloudflare-pages-for-frontend-hosting.zh-HK.md)
- [ADR-0009 Phase 1 僅以電郵處理預約](adr/0009-email-only-bookings-in-phase-1.zh-HK.md)

<!-- 新增或更名標題時，請同步更新上方目錄。 -->
