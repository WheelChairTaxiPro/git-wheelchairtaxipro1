---
arc42_section: 10
title: 品質需求
language: zh-HK
source: 10-quality-requirements.md
last_updated: 2026-04-19
last_synced_with_en: 2026-04-19
status: stub
---

# 10. 品質需求

> [English version](10-quality-requirements.md) | [arc42 導讀](_methodology/arc42-primer.zh-HK.md) | [WCAG + Web Vitals 導讀](_methodology/wcag-and-web-vitals-primer.zh-HK.md) | [主目錄](00-index.zh-HK.md)

## 目錄

<!-- TODO：於 Phase 2 撰寫時填寫。 -->

---

## 狀態

本章為 **草稿 (stub)**。內容將於已核准計劃的 **Phase 2** 撰寫。本章面向業務持份者（與 §1、§3、§12 一同閱讀）。

## 預定範圍

### 10.1 無障礙 — WCAG 2.2 Level AA

- 明確目標：每一個乘客可見頁面達 **WCAG 2.2 Level AA**
- 各切片驗收準則（地圖頁、預約表格、聯絡條、收費、常見問題、關於我們）— 每項以可測試準則表達（可用鍵盤操作、屏幕閱讀器可讀、色彩對比達標等）
- 地圖頁提供非地圖替代路徑（無法操作地圖圖釘的用戶可直接輸入地址）
- 測試策略：Playwright + axe、Lighthouse 無障礙評分、定期人工審查

### 10.2 效能 — Core Web Vitals + API SLO

- **LCP p75 ≤ 2.5 秒**（4G 行動網絡，Core Web Vitals「Good」）
- **INP p75 ≤ 200 毫秒**
- **CLS p75 ≤ 0.1**
- **API p95 ≤ 300 毫秒**（預約端點，不計第三方電郵發送時間）
- 可用性目標：Phase 1 端對端 **99.5%**
- 量測方式：每 PR 進行 Lighthouse CI、生產環境使用 Google Search Console CWV 報告、GA4 Web Vitals 事件

### 10.3 私隱

- 預約表格收集 PII（電話、電郵）。依《香港個人資料（私隱）條例》(PDPO) 處理。
- 調度郵箱的資料保留政策、GA4 事件壽命、Cookie 立場
- Phase 1 不使用 GA4 + GSC 以外的第三方廣告追蹤器

### 10.4 安全

- 僅使用 HTTPS（由 Cloudflare 強制）；API 側 CORS 僅允許 Pages 網域
- 聯絡按鈕頻率限制（IP + cookie 基礎）
- 預約端點伺服器端輸入驗證
- Secrets 僅存於 PaaS 環境變數；絕不進入 git（見 [`.gitignore`](../../.gitignore)）

### 10.5 雙語體驗品質

- 同一使用期間內 UI 不可出現混合語言字串
- 繁體中文依香港用法（非台灣、非大陸）；標點與空格需正確
- 語言切換器在任何情況下不得阻礙乘客完成預約

## 主要輸入來源

- [`_methodology/wcag-and-web-vitals-primer.zh-HK.md`](_methodology/wcag-and-web-vitals-primer.zh-HK.md)
- [`README.md`](../../README.md) §Phase 1 KPIs
- [`docs/LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md`](../LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md) §Performance

## 相關 ADR

- [ADR-0011 以 WCAG 2.2 Level AA 為目標](adr/0011-target-wcag-2-2-level-aa.zh-HK.md)
- [ADR-0012 以 Core Web Vitals「Good」閾值為目標](adr/0012-target-core-web-vitals-good-thresholds.zh-HK.md)
- [ADR-0006 以 `@angular/ssr` 進行靜態預渲染](adr/0006-static-prerender-via-angular-ssr.zh-HK.md)

<!-- 新增或更名標題時，請同步更新上方目錄。 -->
