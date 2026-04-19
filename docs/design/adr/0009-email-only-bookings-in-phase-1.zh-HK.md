---
adr_number: "0009"
title: Phase 1 僅以電郵處理預約（無資料庫）
status: Proposed
date: 2026-04-19
deciders: project owner
language: zh-HK
source: 0009-email-only-bookings-in-phase-1.md
last_synced_with_en: 2026-04-19
supersedes: null
superseded_by: null
---

# ADR-0009：Phase 1 僅以電郵處理預約（無資料庫）

> [English version](0009-email-only-bookings-in-phase-1.md) | [ADR 導讀](../_methodology/adr-primer.zh-HK.md) | [ADR 索引](README.zh-HK.md)

## 狀態 (Status)

Proposed — **草稿 (stub)**；完整內容於 Phase 5 撰寫。

## 背景雛形 (Seed context)

Phase 1 為 6 週的 MVP。建立預約資料庫 + 管理後台 + 用戶帳戶會耗去大部份預算，並分散主要目標 — 取得香港 SEO 能見度。更簡的路徑：預約端點經 SMTP（或 SendGrid）組成結構化電郵並發送兩封 — 一封至調度郵箱、一封確認至乘客。營運方以電話或 WhatsApp 回覆確認。不設資料庫、不設管理後台、無身份驗證。Phase 2 再加入 EF Core 持久層與管理介面。

## 背景 (Context)

TODO — 展開成 2–6 段，附上電郵內容結構之示例。

## 決策 (Decision)

TODO — 一句祈使句 + 延伸說明。

**工作表述：** Phase 1 `/api/bookings` 端點僅做輸入驗證、組成給營運方與乘客的兩封電郵，並經 `IEmailSender` 發送。不提供持久層。直至 Phase 2 之前，調度郵箱即為事實紀錄。

## 後果 (Consequences)

TODO — Positive / Negative / Neutral 清單。標註：除 GA4 轉換事件外無預約層面的分析；除郵箱外無爭議紀錄；Phase 2 資料庫遷移時須保留已經由電郵處理過的事件。

## 相關章節

- [§4 解決方案策略](../04-solution-strategy.zh-HK.md)
- [§6 運行時視圖](../06-runtime-view.zh-HK.md)
- [§11 風險與技術債](../11-risks-and-technical-debts.zh-HK.md)
