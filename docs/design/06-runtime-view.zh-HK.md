---
arc42_section: 06
title: 運行時視圖
language: zh-HK
source: 06-runtime-view.md
last_updated: 2026-04-19
last_synced_with_en: 2026-04-19
status: stub
---

# 6. 運行時視圖

> [English version](06-runtime-view.md) | [arc42 導讀](_methodology/arc42-primer.zh-HK.md) | [主目錄](00-index.zh-HK.md)

## 目錄

<!-- TODO：於 Phase 4 撰寫時填寫。 -->

---

## 狀態

本章為 **草稿 (stub)**。內容將於已核准計劃的 **Phase 4** 撰寫。

## 預定範圍

三條關鍵運行時流程，每條以 Mermaid 序列圖及配套文字呈現：

1. **預約提交正常流程** — 用戶於地圖放置上車點 → 放置落車點 → 地圖計算路線與估價 → 點擊「立即預約」→ 經 `TripStateService` 保留選擇並轉至 `/booking` → 填寫表格 → 提交 → API 驗證 → `IEmailSender` 分別發送至調度郵箱與乘客確認郵件 → 顯示成功頁面。
2. **Map → Booking 狀態交接** — 一個 `TripSelection` signal 如何經由 `shared/services/TripStateService` 從 `map/` 切片傳至 `booking/` 切片，而兩切片互不相依（維持垂直切片隔離）。
3. **語言偵測與切換** — 首次造訪：讀取 `Accept-Language` 標頭 + 地理位置提示 → 選擇預設語言 (`zh-HK` 或 `en`) → 設定 hreflang 與 canonical 標籤 → 可持久語言切換器寫入 `localStorage` 與 URL。
4. *(可選)* **聯絡條按鈕點擊追蹤** — 電話 / WhatsApp / WeChat 點擊 → 頻率限制檢查 → 觸發 GA4 事件 → 啟動 `tel:` / `wa.me` / WeChat 深度連結。

## 主要輸入來源

- [`initial-design/13-4-wheelchair_taxi_pro_booking_form_pricing_content_中英對照.md`](../../initial-design/13-4-wheelchair_taxi_pro_booking_form_pricing_content_中英對照.md)
- [`initial-design/WheelchairTaxiPro_Communication.md`](../../initial-design/WheelchairTaxiPro_Communication.md)
- [`initial-design/13-2-wheelchair_taxi_pro_wireframe_description_v_4.md`](../../initial-design/13-2-wheelchair_taxi_pro_wireframe_description_v_4.md)
- [`initial-design/15-phase1-build-order.md`](../../initial-design/15-phase1-build-order.md) §共享契約 (TripSelection + TripStateService)
- [`frontend/ARCHITECTURE.md`](../../frontend/ARCHITECTURE.md) §4a 狀態管理

## 相關 ADR

- [ADR-0003 Signals 優先狀態管理](adr/0003-signals-first-state-management.zh-HK.md)
- [ADR-0009 Phase 1 僅以電郵處理預約](adr/0009-email-only-bookings-in-phase-1.zh-HK.md)
- [ADR-0010 雙語：zh-HK 為預設，EN 鏡像](adr/0010-bilingual-zh-hk-default-with-en-mirror.zh-HK.md)

<!-- 新增或更名標題時，請同步更新上方目錄。 -->
