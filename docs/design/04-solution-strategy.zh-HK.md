---
arc42_section: 04
title: 解決方案策略
language: zh-HK
source: 04-solution-strategy.md
last_updated: 2026-04-19
last_synced_with_en: 2026-04-19
status: stub
---

# 4. 解決方案策略

> [English version](04-solution-strategy.md) | [arc42 導讀](_methodology/arc42-primer.zh-HK.md) | [主目錄](00-index.zh-HK.md)

## 目錄

<!-- TODO：於 Phase 3 撰寫時填寫。 -->

---

## 狀態

本章為 **草稿 (stub)**。內容將於已核准計劃的 **Phase 3** 撰寫。

## 預定範圍

- **整體策略**（以數段文字闡述）：
  - 前端與後端同採垂直切片架構（一個功能資料夾同時擁有 UI + 資料存取 + 測試 + 路由）
  - 前端採 Signals 優先的狀態管理；RxJS 僅用於真正的串流場景
  - 以 `@angular/ssr` 進行靜態預渲染 — 每條公開路由均以完整渲染 HTML 發佈，利於 SEO
  - 預設 zh-HK，EN 鏡像於 `/en/…`，加上 hreflang，配合語言自動偵測與可持久切換
  - 採用 `IMapProvider` 介面，讓香港 (Google Maps) 與未來中國部署 (Tencent / Amap / Baidu / Huawei) 可並存
  - Phase 1 預約僅以電郵派發（不使用資料庫），但保留日後 Phase 2 過渡至 EF Core 10 的清晰路徑
- **Phase 1 建構次序有向圖**（Mermaid）：依相依關係排列的切片序列 — Foundation → Map → Booking → Contact Strip → Pricing → FAQ → About → Analytics
- **為何如此選擇** — 每項選擇以一段說明其理據，並引用對應的 ADR

## 主要輸入來源

- [`initial-design/13-0-Frontend-wheelchair_taxi_pro_wireframe_build_specification_updated_with_vertical_slice.md`](../../initial-design/13-0-Frontend-wheelchair_taxi_pro_wireframe_build_specification_updated_with_vertical_slice.md)
- [`initial-design/14-Backend-wheelchair_taxi_pro_backend_plan_v_2_no_mediat_r.md`](../../initial-design/14-Backend-wheelchair_taxi_pro_backend_plan_v_2_no_mediat_r.md)
- [`initial-design/15-phase1-build-order.md`](../../initial-design/15-phase1-build-order.md)
- [`initial-design/DiscussArchitectures.md`](../../initial-design/DiscussArchitectures.md)
- [`frontend/ARCHITECTURE.md`](../../frontend/ARCHITECTURE.md)

## 相關 ADR

- [ADR-0001 採用垂直切片架構](adr/0001-use-vertical-slice-architecture.zh-HK.md)
- [ADR-0003 Signals 優先狀態管理](adr/0003-signals-first-state-management.zh-HK.md)
- [ADR-0004 不採用 MediatR](adr/0004-no-mediatr.zh-HK.md)
- [ADR-0006 以 `@angular/ssr` 進行靜態預渲染](adr/0006-static-prerender-via-angular-ssr.zh-HK.md)
- [ADR-0008 以 IMapProvider 介面支援中國擴展](adr/0008-imapprovider-adapter-for-china-expansion.zh-HK.md)
- [ADR-0009 Phase 1 僅以電郵處理預約](adr/0009-email-only-bookings-in-phase-1.zh-HK.md)
- [ADR-0010 雙語：zh-HK 為預設，EN 鏡像](adr/0010-bilingual-zh-hk-default-with-en-mirror.zh-HK.md)

<!-- 新增或更名標題時，請同步更新上方目錄。 -->
