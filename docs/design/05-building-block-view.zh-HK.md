---
arc42_section: 05
title: 建構塊視圖
language: zh-HK
source: 05-building-block-view.md
last_updated: 2026-04-19
last_synced_with_en: 2026-04-19
status: stub
---

# 5. 建構塊視圖

> [English version](05-building-block-view.md) | [arc42 導讀](_methodology/arc42-primer.zh-HK.md) | [C4 導讀](_methodology/c4-model-primer.zh-HK.md) | [主目錄](00-index.zh-HK.md)

## 目錄

<!-- TODO：於 Phase 3 撰寫時填寫。 -->

---

## 狀態

本章為 **草稿 (stub)**。內容將於已核准計劃的 **Phase 3** 撰寫。

## 預定範圍

- **C4 Level 2 容器圖**（Mermaid）：顯示四個可部署／運行單元
  - 乘客瀏覽器 (Angular 21 PWA)
  - Cloudflare Pages（靜態託管 + 預渲染 HTML）
  - `.NET 10` Web API（PaaS 宿主，例如 Railway / Render / Fly.io）
  - 外部服務 (Google Maps、SMTP、GA4)
- **C4 Level 3 前端元件圖**（Mermaid）：`features/` 切片 (`map`、`booking`、`pricing`、`contact-strip`、`faq`、`about`) 加上 `core/`（HTTP 攔截器、config、analytics、guards）及 `shared/`（ui、pipes、models、`TripStateService`）。引用 [`frontend/ARCHITECTURE.md`](../../frontend/ARCHITECTURE.md) 作為官方資料夾佈局依據。
- **C4 Level 3 後端元件圖**（Mermaid）：`API/`（controllers、DI）、`Features/` 切片 (`Booking`、`MapRouting` 等)、`Core/Interfaces/` (`IMapProvider`、`IEmailSender`、`IBookingRepository`)、`Infrastructure/` (`GoogleMapsProvider`、`SmtpEmailSender`)。
- **圖表目錄** — 本章頂部列出所有 L2/L3 圖表，每張附一句說明及錨點，方便審查者一次掃視所有圖形。

## 主要輸入來源

- [`initial-design/13-0-Frontend-wheelchair_taxi_pro_wireframe_build_specification_updated_with_vertical_slice.md`](../../initial-design/13-0-Frontend-wheelchair_taxi_pro_wireframe_build_specification_updated_with_vertical_slice.md)
- [`initial-design/14-Backend-wheelchair_taxi_pro_backend_plan_v_2_no_mediat_r.md`](../../initial-design/14-Backend-wheelchair_taxi_pro_backend_plan_v_2_no_mediat_r.md)
- [`initial-design/wheelchair_taxi_pro_backend_plan_v_4_detailed_slice_explanation.md`](../../initial-design/wheelchair_taxi_pro_backend_plan_v_4_detailed_slice_explanation.md)
- [`initial-design/wheelchair_taxi_pro_backend_plan_v_3_with_mermaid_diagrams.md`](../../initial-design/wheelchair_taxi_pro_backend_plan_v_3_with_mermaid_diagrams.md)
- [`frontend/ARCHITECTURE.md`](../../frontend/ARCHITECTURE.md)

## 相關 ADR

- [ADR-0001 採用垂直切片架構](adr/0001-use-vertical-slice-architecture.zh-HK.md)
- [ADR-0003 Signals 優先狀態管理](adr/0003-signals-first-state-management.zh-HK.md)
- [ADR-0004 不採用 MediatR](adr/0004-no-mediatr.zh-HK.md)
- [ADR-0008 以 IMapProvider 介面支援中國擴展](adr/0008-imapprovider-adapter-for-china-expansion.zh-HK.md)

<!-- 新增或更名標題時，請同步更新上方目錄。 -->
