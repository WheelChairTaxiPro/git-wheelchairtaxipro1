---
adr_number: "0004"
title: 後端不採用 MediatR
status: Proposed
date: 2026-04-19
deciders: project owner
language: zh-HK
source: 0004-no-mediatr.md
last_synced_with_en: 2026-04-19
supersedes: null
superseded_by: null
---

# ADR-0004：後端不採用 MediatR

> [English version](0004-no-mediatr.md) | [ADR 導讀](../_methodology/adr-primer.zh-HK.md) | [ADR 索引](README.zh-HK.md)

## 狀態 (Status)

Proposed — **草稿 (stub)**；完整內容於 Phase 5 撰寫。

## 背景雛形 (Seed context)

MediatR 是 .NET 界事實上的 in-process mediator，許多 CQRS / Clean Architecture 專案採用。過去免費，近期版本已變更授權。結合我們選定的垂直切片架構（ADR-0001），mediator 的間接層帶來的好處有限：feature handler 可直接由 minimal API 端點或薄 controller 呼叫。後端原計劃 ([`initial-design/14-Backend-…md`](../../../initial-design/14-Backend-wheelchair_taxi_pro_backend_plan_v_2_no_mediat_r.md)) 已記錄此選擇。

## 背景 (Context)

TODO — 展開成 2–6 段，涵蓋授權變更與架構論據。

## 決策 (Decision)

TODO — 一句祈使句 + 延伸說明。

**工作表述：** 不使用 MediatR。feature 切片以自足的 handler 類別實作，直接由 minimal API 端點或 controller 呼叫。橫切關注點（日誌、驗證）以 middleware / endpoint filter 實作，而非 pipeline behavior。

## 後果 (Consequences)

TODO — Positive / Negative / Neutral 清單。

## 相關章節

- [§4 解決方案策略](../04-solution-strategy.zh-HK.md)
- [§5 建構塊視圖](../05-building-block-view.zh-HK.md)
