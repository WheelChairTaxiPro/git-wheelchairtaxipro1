---
adr_number: "0008"
title: 以 `IMapProvider` 介面支援中國擴展
status: Proposed
date: 2026-04-19
deciders: project owner
language: zh-HK
source: 0008-imapprovider-adapter-for-china-expansion.md
last_synced_with_en: 2026-04-19
supersedes: null
superseded_by: null
---

# ADR-0008：以 `IMapProvider` 介面支援中國擴展

> [English version](0008-imapprovider-adapter-for-china-expansion.md) | [ADR 導讀](../_methodology/adr-primer.zh-HK.md) | [ADR 索引](README.zh-HK.md)

## 狀態 (Status)

Proposed — **草稿 (stub)**；完整內容於 Phase 5 撰寫。

## 背景雛形 (Seed context)

Phase 1 於香港市場使用 Google Maps JavaScript / Places / Directions API。Google Maps 於中國大陸被封鎖或不穩；Phase 2 擴展至大陸市場時需改用本地替代方案（Tencent、Amap、Baidu、Huawei Maps）。若在 `map/` 與 `booking/` 切片直接嵌入 Google 專屬 API，屆時更換會非常痛苦。現在先定義 `IMapProvider` 介面（涵蓋 geocoding、路線、圖釘），日後可加入其他實作而不觸及功能程式。見 [`initial-design/13-0-…vertical_slice.md`](../../../initial-design/13-0-Frontend-wheelchair_taxi_pro_wireframe_build_specification_updated_with_vertical_slice.md)。

## 背景 (Context)

TODO — 展開成 2–6 段。

## 決策 (Decision)

TODO — 一句祈使句 + 延伸說明。

**工作表述：** 定義前端 `IMapProvider` 介面，並實作 `core/services/GoogleMapsProvider`。所有切片程式僅依賴該介面，不直接引用 `google.maps.*`。Phase 2 於同一介面下加入替代實作。

## 後果 (Consequences)

TODO — Positive / Negative / Neutral 清單。標註 Phase 1 只有單一實作時，引入介面的成本。

## 相關章節

- [§3 情境與範圍](../03-context-and-scope.zh-HK.md)
- [§4 解決方案策略](../04-solution-strategy.zh-HK.md)
- [§11 風險與技術債](../11-risks-and-technical-debts.zh-HK.md)
