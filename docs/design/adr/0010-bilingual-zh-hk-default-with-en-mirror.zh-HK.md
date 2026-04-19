---
adr_number: "0010"
title: 雙語：zh-HK 為預設，EN 鏡像於 `/en/…`
status: Proposed
date: 2026-04-19
deciders: project owner
language: zh-HK
source: 0010-bilingual-zh-hk-default-with-en-mirror.md
last_synced_with_en: 2026-04-19
supersedes: null
superseded_by: null
---

# ADR-0010：雙語：zh-HK 為預設，EN 鏡像於 `/en/…`

> [English version](0010-bilingual-zh-hk-default-with-en-mirror.md) | [ADR 導讀](../_methodology/adr-primer.zh-HK.md) | [ADR 索引](README.zh-HK.md)

## 狀態 (Status)

Proposed — **草稿 (stub)**；完整內容於 Phase 5 撰寫。

## 背景雛形 (Seed context)

主要市場為香港，大多數乘客搜尋為 zh-HK。次要受眾包括說英語的香港居民、外派人士及遊客。我們於網域根目錄 (`/…`) 提供 zh-HK，於 `/en/…` 鏡像所有頁面。首次造訪時以 `Accept-Language` + 地理位置自動偵測語言，透過 UI 中的持久切換器切換，寫入 `localStorage`，並以 `hreflang` 及每語言的 canonical URL 告知搜尋引擎。

## 背景 (Context)

TODO — 展開成 2–6 段，涵蓋為何採用 `/en/…` 路徑前綴而非子網域，以及 URL 設計的權衡。

## 決策 (Decision)

TODO — 一句祈使句 + 延伸說明。

**工作表述：** 於網域根目錄提供 zh-HK；每條公開路由於 `/en/…` 鏡像。`<html>` 設定對應 `lang`；以 `hreflang` 成對連結兩個 URL；每語言發射 self-canonical。用戶選擇寫入 `localStorage` 與 URL。

## 後果 (Consequences)

TODO — Positive / Negative / Neutral 清單。標註：所有面向用戶的字串須同時提供兩語；UI 審查期間實施 string freeze。

## 相關章節

- [§1 簡介與目標](../01-introduction-and-goals.zh-HK.md)
- [§8 橫向關注點](../08-cross-cutting-concepts.zh-HK.md)
- [§10 品質需求](../10-quality-requirements.zh-HK.md)
