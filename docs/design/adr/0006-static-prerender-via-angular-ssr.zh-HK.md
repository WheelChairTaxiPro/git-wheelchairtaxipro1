---
adr_number: "0006"
title: 以 `@angular/ssr` 進行靜態預渲染（不使用 SSR 運行時）
status: Proposed
date: 2026-04-19
deciders: project owner
language: zh-HK
source: 0006-static-prerender-via-angular-ssr.md
last_synced_with_en: 2026-04-19
supersedes: null
superseded_by: null
---

# ADR-0006：以 `@angular/ssr` 進行靜態預渲染（不使用 SSR 運行時）

> [English version](0006-static-prerender-via-angular-ssr.md) | [ADR 導讀](../_methodology/adr-primer.zh-HK.md) | [ADR 索引](README.zh-HK.md)

## 狀態 (Status)

Proposed — **草稿 (stub)**；完整內容於 Phase 5 撰寫。

## 背景雛形 (Seed context)

SEO 優先表示每條公開路由必須能被爬蟲抓取且達到 Core Web Vitals「Good」(ADR-0012)。已考慮兩種渲染策略：(1) 完整 SSR（運行時逐請求渲染，需 Node 宿主、引入冷啟動延遲）；(2) 靜態預渲染 (SSG)（建構時產生 HTML + 客戶端水合）。本專案內容依語言多數為靜態（地圖、預約、收費、FAQ、關於我們），SSG 已足夠，並與純靜態宿主 (ADR-0005 Cloudflare Pages) 完美配合。`@angular/ssr` 的 `prerender` 任務在建構時為每條路由產生 HTML；應用於客戶端水合。

## 背景 (Context)

TODO — 展開成 2–6 段。

## 決策 (Decision)

TODO — 一句祈使句 + 延伸說明。

**工作表述：** 以 `@angular/ssr` 的「僅預渲染」模式運行。所有具面向用戶內容的路由均加入預渲染清單。不部署 Node 運行時；輸出為靜態 HTML + JS + CSS，由 Cloudflare Pages 提供。

## 後果 (Consequences)

TODO — Positive / Negative / Neutral 清單。標註：真正需要逐請求資料的頁面（例如將來的儀表板）需採用其他策略。

## 相關章節

- [§4 解決方案策略](../04-solution-strategy.zh-HK.md)
- [§7 部署視圖](../07-deployment-view.zh-HK.md)
- [§10 品質需求](../10-quality-requirements.zh-HK.md)
