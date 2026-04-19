---
title: 主目錄
language: zh-HK
source: 00-index.md
last_updated: 2026-04-19
last_synced_with_en: 2026-04-19
status: active
---

# 主目錄 — 設計與規格

> [English version](00-index.md) | [資料夾 README](README.zh-HK.md)

此為正式設計與規格文件的 **入口頁面**。請依照你角色相對應的閱讀路徑開始。

## 閱讀路徑

### 新加入開發者（完整深度，約 60 分鐘）

1. [`_methodology/arc42-primer.zh-HK.md`](_methodology/arc42-primer.zh-HK.md) — 本規格如何組織
2. [`_methodology/c4-model-primer.zh-HK.md`](_methodology/c4-model-primer.zh-HK.md) — 如何閱讀架構圖
3. [`_methodology/adr-primer.zh-HK.md`](_methodology/adr-primer.zh-HK.md) — 決策如何記錄
4. [`01-introduction-and-goals.zh-HK.md`](01-introduction-and-goals.zh-HK.md) — 我們在建構甚麼，為何而建
5. [`02-constraints.zh-HK.md`](02-constraints.zh-HK.md) — 必須遵守的約束
6. [`03-context-and-scope.zh-HK.md`](03-context-and-scope.zh-HK.md) — 系統邊界
7. [`04-solution-strategy.zh-HK.md`](04-solution-strategy.zh-HK.md) — 整體解決方案策略
8. [`05-building-block-view.zh-HK.md`](05-building-block-view.zh-HK.md) — 靜態結構
9. [`06-runtime-view.zh-HK.md`](06-runtime-view.zh-HK.md) — 動態行為
10. [`07-deployment-view.zh-HK.md`](07-deployment-view.zh-HK.md) — 運行環境
11. [`08-cross-cutting-concepts.zh-HK.md`](08-cross-cutting-concepts.zh-HK.md) — 橫向關注點
12. [`09-architecture-decisions.zh-HK.md`](09-architecture-decisions.zh-HK.md) — 決策目錄 (ADR 索引)
13. [`10-quality-requirements.zh-HK.md`](10-quality-requirements.zh-HK.md) — 非功能需求
14. [`11-risks-and-technical-debts.zh-HK.md`](11-risks-and-technical-debts.zh-HK.md) — 已知風險與技術債
15. [`12-glossary.zh-HK.md`](12-glossary.zh-HK.md) — 專業與技術詞彙

### 業務持份者（約 15 分鐘）

1. [`01-introduction-and-goals.zh-HK.md`](01-introduction-and-goals.zh-HK.md)
2. [`03-context-and-scope.zh-HK.md`](03-context-and-scope.zh-HK.md)
3. [`10-quality-requirements.zh-HK.md`](10-quality-requirements.zh-HK.md)
4. [`12-glossary.zh-HK.md`](12-glossary.zh-HK.md)

### 需要記錄新決策的審查者

1. [`adr/README.zh-HK.md`](adr/README.zh-HK.md) — 如何撰寫 ADR
2. [`adr/_template.zh-HK.md`](adr/_template.zh-HK.md) — 複製此範本
3. 編號遞增（下一個 ADR 為 `0013-…`）
4. 從 [`09-architecture-decisions.zh-HK.md`](09-architecture-decisions.zh-HK.md) 建立連結

## 文件地圖

### 方法論導讀

| 檔案 | 解釋內容 |
|---|---|
| [`_methodology/arc42-primer.zh-HK.md`](_methodology/arc42-primer.zh-HK.md) | 12 章節 arc42 範本及採用理由 |
| [`_methodology/c4-model-primer.zh-HK.md`](_methodology/c4-model-primer.zh-HK.md) | 四個 C4 縮放層級與 Mermaid 繪圖 |
| [`_methodology/adr-primer.zh-HK.md`](_methodology/adr-primer.zh-HK.md) | ADR 定義、範本、編號規則、不變性 |
| [`_methodology/wcag-and-web-vitals-primer.zh-HK.md`](_methodology/wcag-and-web-vitals-primer.zh-HK.md) | WCAG 2.2 AA 與 Core Web Vitals 作為品質基準 |

### arc42 章節 (§1 – §12)

| § | 檔案 | 涵蓋內容 |
|---|---|---|
| 1 | [`01-introduction-and-goals.zh-HK.md`](01-introduction-and-goals.zh-HK.md) | 問題、用戶、三項首要品質目標、KPI |
| 2 | [`02-constraints.zh-HK.md`](02-constraints.zh-HK.md) | 技術／組織／法規約束 |
| 3 | [`03-context-and-scope.zh-HK.md`](03-context-and-scope.zh-HK.md) | 系統邊界 + C4 L1 情境圖 |
| 4 | [`04-solution-strategy.zh-HK.md`](04-solution-strategy.zh-HK.md) | 整體策略 + Phase 1 建構次序有向圖 |
| 5 | [`05-building-block-view.zh-HK.md`](05-building-block-view.zh-HK.md) | C4 L2 容器 + C4 L3 元件圖 |
| 6 | [`06-runtime-view.zh-HK.md`](06-runtime-view.zh-HK.md) | 關鍵流程的序列圖 |
| 7 | [`07-deployment-view.zh-HK.md`](07-deployment-view.zh-HK.md) | 部署拓撲與 CI/CD |
| 8 | [`08-cross-cutting-concepts.zh-HK.md`](08-cross-cutting-concepts.zh-HK.md) | 雙語、SEO/GEO/AEO、狀態管理、日誌、錯誤處理、防欺詐 |
| 9 | [`09-architecture-decisions.zh-HK.md`](09-architecture-decisions.zh-HK.md) | ADR 目錄（僅索引；ADR 本身位於 `adr/`）|
| 10 | [`10-quality-requirements.zh-HK.md`](10-quality-requirements.zh-HK.md) | WCAG 2.2 AA、Web Vitals 指標、SLO、私隱、安全性 |
| 11 | [`11-risks-and-technical-debts.zh-HK.md`](11-risks-and-technical-debts.zh-HK.md) | 已知風險與已接受的技術債 |
| 12 | [`12-glossary.zh-HK.md`](12-glossary.zh-HK.md) | 專業與技術詞彙（EN ↔ zh-HK）|

### 架構決策紀錄

| ADR | 標題 |
|---|---|
| [0001](adr/0001-use-vertical-slice-architecture.zh-HK.md) | 採用垂直切片架構（前端與後端）|
| [0002](adr/0002-use-angular-21-and-dotnet-10-lts.zh-HK.md) | 採用 Angular 21 + .NET 10 LTS + Node 22 LTS |
| [0003](adr/0003-signals-first-state-management.zh-HK.md) | Signals 優先狀態管理；RxJS 僅用於串流 |
| [0004](adr/0004-no-mediatr.zh-HK.md) | 後端不採用 MediatR |
| [0005](adr/0005-cloudflare-pages-for-frontend-hosting.zh-HK.md) | 前端託管於 Cloudflare Pages（免費層）|
| [0006](adr/0006-static-prerender-via-angular-ssr.zh-HK.md) | 以 `@angular/ssr` 進行靜態預渲染（不使用 SSR 運行時）|
| [0007](adr/0007-gitflow-branching-model.zh-HK.md) | GitFlow 分支模型 (`main` / `staging` / `develop`) |
| [0008](adr/0008-imapprovider-adapter-for-china-expansion.zh-HK.md) | 以 `IMapProvider` 介面支援中國擴展 |
| [0009](adr/0009-email-only-bookings-in-phase-1.zh-HK.md) | Phase 1 僅以電郵處理預約（無資料庫）|
| [0010](adr/0010-bilingual-zh-hk-default-with-en-mirror.zh-HK.md) | 雙語：zh-HK 為預設，EN 鏡像於 `/en/…` |
| [0011](adr/0011-target-wcag-2-2-level-aa.zh-HK.md) | 以 WCAG 2.2 Level AA 為目標 |
| [0012](adr/0012-target-core-web-vitals-good-thresholds.zh-HK.md) | 以 Core Web Vitals「Good」閾值為目標 |

## 狀態

| 階段 | 交付物 | 狀態 |
|---|---|---|
| 0 | 整理 + 骨架 | **已完成** |
| 1 | 方法論導讀 + ADR 範本 + 索引 | 草稿 — 將於 Phase 1 填寫 |
| 2 | 持份者章節 (§1, §3, §10, §12) | 草稿 — 將於 Phase 2 填寫 |
| 3 | 技術章節 (§2, §4, §5, §7) | 草稿 — 將於 Phase 3 填寫 |
| 4 | 運行時 + 橫向關注點 + 風險 (§6, §8, §11) | 草稿 — 將於 Phase 4 填寫 |
| 5 | 12 項初始 ADR + §9 索引 | 草稿 — 將於 Phase 5 填寫 |

## 缺漏登記冊

尚未涵蓋的主題於此登記。若發現新主題但尚未撰寫章節，將加入此表。

| 主題 | 追蹤於 | 狀態 |
|---|---|---|
| — | — | （Phase 0 暫無未解缺漏；待內容撰寫期間陸續登記。）|

---

*最近更新：2026-04-19*
