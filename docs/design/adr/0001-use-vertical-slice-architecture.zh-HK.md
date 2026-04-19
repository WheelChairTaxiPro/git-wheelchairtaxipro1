---
adr_number: "0001"
title: 採用垂直切片架構（前端與後端）
status: Proposed
date: 2026-04-19
deciders: project owner
language: zh-HK
source: 0001-use-vertical-slice-architecture.md
last_synced_with_en: 2026-04-19
supersedes: null
superseded_by: null
---

# ADR-0001：採用垂直切片架構（前端與後端）

> [English version](0001-use-vertical-slice-architecture.md) | [ADR 導讀](../_methodology/adr-primer.zh-HK.md) | [ADR 索引](README.zh-HK.md)

## 狀態 (Status)

Proposed — **草稿 (stub)**；完整 Context / Decision / Consequences 於 Phase 5 撰寫。

## 背景雛形 (Seed context)

Phase 1 MVP 大約有八個面向用戶的功能（地圖、預約、收費、聯絡條、常見問題、關於我們、分析、聯絡）。若按技術層分組（後端的 `controllers/`、`services/`、`repositories/`；前端根目錄的 `components/`、`services/`、`models/`），每個功能會分散在多個資料夾，導致任何功能層級的修改都會觸及所有層次。垂直切片 — 每個功能一個資料夾，同時擁有其 UI、資料存取、測試與路由 — 讓修改集中、切片可獨立測試、退役時可乾淨刪除。前端設計 ([`frontend/ARCHITECTURE.md`](../../../frontend/ARCHITECTURE.md)) 與後端規劃 ([`initial-design/14-Backend-…md`](../../../initial-design/14-Backend-wheelchair_taxi_pro_backend_plan_v_2_no_mediat_r.md)) 已以此為前提。

## 背景 (Context)

TODO — 展開成 2–6 段。

## 決策 (Decision)

TODO — 一句祈使句 + 延伸說明。

**工作表述：** 前後端程式主要按功能（垂直切片）組織，不按技術層。橫跨切片的基礎設施置於共享層（前端 `core/`；後端 `Core/Interfaces/` + `Infrastructure/`）。

## 後果 (Consequences)

TODO — Positive / Negative / Neutral 清單。

## 相關章節

- [§4 解決方案策略](../04-solution-strategy.zh-HK.md)
- [§5 建構塊視圖](../05-building-block-view.zh-HK.md)
