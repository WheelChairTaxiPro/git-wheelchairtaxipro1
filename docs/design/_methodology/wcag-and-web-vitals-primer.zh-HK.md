---
title: WCAG 2.2 + Core Web Vitals 導讀
language: zh-HK
source: wcag-and-web-vitals-primer.md
last_updated: 2026-04-19
last_synced_with_en: 2026-04-19
status: stub
---

# WCAG 2.2 + Core Web Vitals — 我們的品質基準

> [English version](wcag-and-web-vitals-primer.md) | [主目錄](../00-index.zh-HK.md)

## 目錄

<!-- TODO：於 Phase 1 撰寫時填寫。 -->

---

## 狀態

本導讀為 **草稿 (stub)**。完整內容將於已核准計劃的 **Phase 1** 撰寫。

## 為何選這兩項？為何需要明確？

arc42 §10「品質需求」最容易被含糊寫成願望（「網站應快速且無障礙」）。我們以兩個 **業界標準、可測試** 的框架作為錨點，讓「快速」與「無障礙」變成每個 PR 都可量度的數字。

對一間 **輪椅的士服務** 而言，無障礙並非選項 — 而是產品要求。WCAG 2.2 AA 為明確標準。

對一個 **SEO 優先的專案** 而言，Core Web Vitals 直接影響 Google 搜尋排名，同時是 UX 指標與 SEO 槓桿。

## WCAG 2.2 概覽

**WCAG (Web Content Accessibility Guidelines)** 為 W3C／WAI 的網頁無障礙標準，2.2 為現行建議版本（2023 年發佈）。

- **四項原則** — 內容必須具備：**可感知 (Perceivable)**、**可操作 (Operable)**、**可理解 (Understandable)**、**穩健 (Robust)** (POUR)。
- **三個符合等級** — A（最低）、**AA（我們的目標）**、AAA（最嚴格）。
- **Success Criteria** — 2.2 相對 2.1 新增九項，著重拖曳操作、焦點外觀、目標尺寸、認證認知負擔與一致的說明。
- 多個法域（歐盟、美國、英國、香港公部門採購）將 **Level AA** 訂為法規／採購基線。

我們在每一個乘客可見頁面均以 **WCAG 2.2 Level AA** 為目標。正式決策與理據見 [ADR-0011](../adr/0011-target-wcag-2-2-level-aa.zh-HK.md)。

### 測試方式

| 層面 | 工具 | 時機 |
|---|---|---|
| 自動化 | axe-core（於 Playwright 內） | 每個 PR |
| 合成測試 | Lighthouse 無障礙審計 | 每個 PR + 每晚 |
| 人工 | 純鍵盤操作全程測試 | 每次發行前 |
| 人工 | 屏幕閱讀器 (VoiceOver / NVDA) | 每次發行前 |
| 真實用戶 | 輪椅使用者 Beta 測試 | Phase 1 上線前 |

## Core Web Vitals 概覽

**Core Web Vitals (CWV)** 是 Google 的用戶體驗指標計劃。三項指標均以真實用戶流量的 **p75**（第 75 百分位數）量度，各有「Good / Needs Improvement / Poor」三個區間。

| 指標 | 衡量 | 「Good」閾值 |
|---|---|---|
| **LCP** (Largest Contentful Paint) | 主要內容何時可見 | **≤ 2.5 秒** |
| **INP** (Interaction to Next Paint) | 對用戶輸入的反應速度（2024 年取代 FID） | **≤ 200 毫秒** |
| **CLS** (Cumulative Layout Shift) | 視覺穩定度（畫面跳動程度） | **≤ 0.1** |

CWV 納入 Google 搜尋的頁面體驗訊號，達到「Good」閾值既是 UX 上的勝利亦是 SEO 上的勝利。

我們在每條公開路由均以 **p75 三項皆 Good** 為目標。見 [ADR-0012](../adr/0012-target-core-web-vitals-good-thresholds.zh-HK.md)。

### 測試方式

| 層面 | 工具 | 時機 |
|---|---|---|
| 合成測試 | Lighthouse CI | 每個 PR（設預算門檻） |
| 真實用戶 | Google Search Console CWV 報告 | 生產環境（持續） |
| 真實用戶 | GA4 Web Vitals 事件 | 生產環境（持續） |

## 如何映射到本規格

- 完整可測試準則置於 [§10 品質需求](../10-quality-requirements.zh-HK.md)（雙語）。
- 每個垂直切片（map / booking / pricing / contact-strip / faq / about）均有以 WCAG success criteria 及 CWV 預算表達的 **切片驗收準則**。
- 選擇 Cloudflare Pages 作託管、以 `@angular/ssr` 進行靜態預渲染，**主要** 正是為了達到這些指標 — 見 [ADR-0005](../adr/0005-cloudflare-pages-for-frontend-hosting.zh-HK.md) 及 [ADR-0006](../adr/0006-static-prerender-via-angular-ssr.zh-HK.md)。

## 延伸閱讀

- [WCAG 2.2 完整規格](https://www.w3.org/TR/WCAG22/)
- [WebAIM 快速參考](https://webaim.org/standards/wcag/checklist)
- [web.dev — Learn Core Web Vitals](https://web.dev/learn-core-web-vitals/)
- [Google Search Console — CWV 報告](https://support.google.com/webmasters/answer/9205520)

<!-- 新增或更名標題時，請同步更新上方目錄。 -->
