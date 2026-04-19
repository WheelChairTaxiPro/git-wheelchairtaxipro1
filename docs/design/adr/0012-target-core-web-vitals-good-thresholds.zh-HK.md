---
adr_number: "0012"
title: 以 Core Web Vitals「Good」閾值為目標
status: Proposed
date: 2026-04-19
deciders: project owner
language: zh-HK
source: 0012-target-core-web-vitals-good-thresholds.md
last_synced_with_en: 2026-04-19
supersedes: null
superseded_by: null
---

# ADR-0012：以 Core Web Vitals「Good」閾值為目標

> [English version](0012-target-core-web-vitals-good-thresholds.md) | [ADR 導讀](../_methodology/adr-primer.zh-HK.md) | [WCAG + Web Vitals 導讀](../_methodology/wcag-and-web-vitals-primer.zh-HK.md) | [ADR 索引](README.zh-HK.md)

## 狀態 (Status)

Proposed — **草稿 (stub)**；完整內容於 Phase 5 撰寫。

## 背景雛形 (Seed context)

本專案 SEO 優先；Core Web Vitals (LCP / INP / CLS) 直接納入 Google 搜尋頁面體驗訊號。p75 達「Good」既是 UX 品質門檻亦是 SEO 槓桿。我們的渲染選擇 (ADR-0006 靜態預渲染) 與宿主選擇 (ADR-0005 Cloudflare Pages) 很大程度上正是為了容易達到這些閾值。

## 背景 (Context)

TODO — 展開成 2–6 段，涵蓋為何採 p75（非中位數），以及為何以 CWV 為準（或與 Lighthouse 分數並用）。

## 決策 (Decision)

TODO — 一句祈使句 + 延伸說明。

**工作表述：** 每條公開路由以真實用戶流量 p75 達 Core Web Vitals「Good」為目標：LCP ≤ 2.5 秒、INP ≤ 200 毫秒、CLS ≤ 0.1。每 PR 強制 Lighthouse 預算；以 Google Search Console 與 GA4 Web Vitals 事件監察真實用戶 CWV。任何倒退均阻擋發行。

## 後果 (Consequences)

TODO — Positive / Negative / Neutral 清單。

## 相關章節

- [§4 解決方案策略](../04-solution-strategy.zh-HK.md)
- [§7 部署視圖](../07-deployment-view.zh-HK.md)
- [§10 品質需求](../10-quality-requirements.zh-HK.md)
