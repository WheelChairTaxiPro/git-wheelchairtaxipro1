---
arc42_section: 08
title: 橫向關注點
language: zh-HK
source: 08-cross-cutting-concepts.md
last_updated: 2026-04-19
last_synced_with_en: 2026-04-19
status: stub
---

# 8. 橫向關注點

> [English version](08-cross-cutting-concepts.md) | [arc42 導讀](_methodology/arc42-primer.zh-HK.md) | [主目錄](00-index.zh-HK.md)

## 目錄

<!-- TODO：於 Phase 4 撰寫時填寫。 -->

---

## 狀態

本章為 **草稿 (stub)**。內容將於已核准計劃的 **Phase 4** 撰寫。

## 預定範圍

以下主題跨越所有切片，故集中於本章而非在每個功能中重複：

- **雙語策略** — 預設 zh-HK 位於 `/`、EN 鏡像於 `/en/…`，以 `Accept-Language` + 地理位置偵測，可持久切換並寫入 `localStorage`、加上 `hreflang`、每種語言設置 canonical URL、`<html>` 的 `lang` 屬性設定，以及對屏幕閱讀器的好處
- **SEO / GEO / AEO** — 每條路由的 Schema.org JSON-LD 目錄 (`LocalBusiness`、`FAQPage`、`Service`、`BreadcrumbList`)、預渲染優先的規則、sitemap.xml 產生、`robots.txt`、內部連結元件、面向 AI 回答引擎的內容立場（事實為本、雙語、短段落、命名實體）
- **狀態管理** — Signals 優先（引用 ADR-0003）；RxJS 僅用於 HTTP、去抖動輸入、websockets；邊界使用 `toSignal` / `toObservable` 轉換；共享狀態置於 `shared/services/`，以私有 `signal()` + `asReadonly()` 暴露
- **日誌記錄** — 後端使用結構化日誌 (Serilog 或內建 `ILogger`)；每個請求有 correlation ID；日誌中不包含 PII
- **錯誤處理** — 前端：`core/http/` 的型別化 HTTP 錯誤攔截器；後端：全域異常處理；面向用戶的錯誤文案以雙語提供
- **分析與追蹤** — GA4 事件目錄（頁面瀏覽、地圖互動、聯絡條點擊、預約提交）、轉換漏斗定義、Google Search Console 基準
- **防欺詐** — 聯絡按鈕的 IP 頻率限制、點擊頻率限制、Google Ads 轉換追蹤

## 主要輸入來源

- [`initial-design/13-2-wheelchair_taxi_pro_wireframe_description_v_4.md`](../../initial-design/13-2-wheelchair_taxi_pro_wireframe_description_v_4.md)
- [`initial-design/13-3-wheelchair_taxi_pro_mobile_wireframe_description_en_繁體中文_v_5.md`](../../initial-design/13-3-wheelchair_taxi_pro_mobile_wireframe_description_en_繁體中文_v_5.md)
- [`initial-design/13-4-wheelchair_taxi_pro_booking_form_pricing_content_中英對照.md`](../../initial-design/13-4-wheelchair_taxi_pro_booking_form_pricing_content_中英對照.md)
- [`initial-design/WheelchairTaxiPro_Communication.md`](../../initial-design/WheelchairTaxiPro_Communication.md)
- [`frontend/ARCHITECTURE.md`](../../frontend/ARCHITECTURE.md) §4a 狀態管理、§7 SEO
- [`README.md`](../../README.md) §Phase 1 feature checklist（防欺詐）

## 相關 ADR

- [ADR-0003 Signals 優先狀態管理](adr/0003-signals-first-state-management.zh-HK.md)
- [ADR-0006 以 `@angular/ssr` 進行靜態預渲染](adr/0006-static-prerender-via-angular-ssr.zh-HK.md)
- [ADR-0010 雙語：zh-HK 為預設，EN 鏡像](adr/0010-bilingual-zh-hk-default-with-en-mirror.zh-HK.md)

<!-- 新增或更名標題時，請同步更新上方目錄。 -->
