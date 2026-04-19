---
adr_number: "0011"
title: 以 WCAG 2.2 Level AA 為目標
status: Proposed
date: 2026-04-19
deciders: project owner
language: zh-HK
source: 0011-target-wcag-2-2-level-aa.md
last_synced_with_en: 2026-04-19
supersedes: null
superseded_by: null
---

# ADR-0011：以 WCAG 2.2 Level AA 為目標

> [English version](0011-target-wcag-2-2-level-aa.md) | [ADR 導讀](../_methodology/adr-primer.zh-HK.md) | [WCAG + Web Vitals 導讀](../_methodology/wcag-and-web-vitals-primer.zh-HK.md) | [ADR 索引](README.zh-HK.md)

## 狀態 (Status)

Proposed — **草稿 (stub)**；完整內容於 Phase 5 撰寫。

## 背景雛形 (Seed context)

我們在建構 **輪椅的士** 預約服務。無障礙是產品要求，並非可有可無。WCAG 2.2 是現行 W3C 建議版本（2023）；Level AA 為全球業界與法規／採購基線。Level AAA 於 Phase 1 預算及以地圖為主的產品中難以達到。僅設 Level A 則忽略了我們所服務的核心用戶。

## 背景 (Context)

TODO — 展開成 2–6 段。

## 決策 (Decision)

TODO — 一句祈使句 + 延伸說明。

**工作表述：** 每一個乘客可見頁面以 WCAG 2.2 Level AA 為目標。各切片驗收準則置於 [§10 品質需求](../10-quality-requirements.zh-HK.md)。自動化把關以 Playwright + axe 於每 PR 執行；CI 執行 Lighthouse 無障礙審計；每次發行前進行人工鍵盤／屏幕閱讀器測試；Phase 1 上線前進行輪椅使用者 Beta 測試。地圖頁必須為無法操作圖釘的用戶提供非地圖替代。

## 後果 (Consequences)

TODO — Positive / Negative / Neutral 清單。

## 相關章節

- [§1 簡介與目標](../01-introduction-and-goals.zh-HK.md)
- [§10 品質需求](../10-quality-requirements.zh-HK.md)
