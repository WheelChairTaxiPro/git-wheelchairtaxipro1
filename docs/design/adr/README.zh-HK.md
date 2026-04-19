# 架構決策紀錄 (ADR) 索引

> [English version](README.md) | [ADR 導讀](../_methodology/adr-primer.zh-HK.md) | [主目錄](../00-index.zh-HK.md)

本資料夾每個檔案對應一項架構決策。每份 ADR 均為雙語 (EN + zh-HK)。

如需了解 **甚麼是 ADR 及如何撰寫**，請先閱讀 [`_methodology/adr-primer.zh-HK.md`](../_methodology/adr-primer.zh-HK.md)。

## 索引

權威目錄（連同狀態與一句簡述）位於 [§9 架構決策](../09-architecture-decisions.zh-HK.md)。

## 快速連結 — 12 項初始 ADR（將於 Phase 5 填寫）

| # | 檔案 | 標題 |
|---|---|---|
| 0001 | [`0001-use-vertical-slice-architecture.zh-HK.md`](0001-use-vertical-slice-architecture.zh-HK.md) | 採用垂直切片架構 |
| 0002 | [`0002-use-angular-21-and-dotnet-10-lts.zh-HK.md`](0002-use-angular-21-and-dotnet-10-lts.zh-HK.md) | 採用 Angular 21 + .NET 10 LTS + Node 22 LTS |
| 0003 | [`0003-signals-first-state-management.zh-HK.md`](0003-signals-first-state-management.zh-HK.md) | Signals 優先狀態管理 |
| 0004 | [`0004-no-mediatr.zh-HK.md`](0004-no-mediatr.zh-HK.md) | 不採用 MediatR |
| 0005 | [`0005-cloudflare-pages-for-frontend-hosting.zh-HK.md`](0005-cloudflare-pages-for-frontend-hosting.zh-HK.md) | 前端託管於 Cloudflare Pages |
| 0006 | [`0006-static-prerender-via-angular-ssr.zh-HK.md`](0006-static-prerender-via-angular-ssr.zh-HK.md) | 以 `@angular/ssr` 進行靜態預渲染 |
| 0007 | [`0007-gitflow-branching-model.zh-HK.md`](0007-gitflow-branching-model.zh-HK.md) | GitFlow 分支模型 |
| 0008 | [`0008-imapprovider-adapter-for-china-expansion.zh-HK.md`](0008-imapprovider-adapter-for-china-expansion.zh-HK.md) | IMapProvider 適配介面 |
| 0009 | [`0009-email-only-bookings-in-phase-1.zh-HK.md`](0009-email-only-bookings-in-phase-1.zh-HK.md) | Phase 1 僅以電郵處理預約 |
| 0010 | [`0010-bilingual-zh-hk-default-with-en-mirror.zh-HK.md`](0010-bilingual-zh-hk-default-with-en-mirror.zh-HK.md) | 雙語：zh-HK 為預設，EN 鏡像 |
| 0011 | [`0011-target-wcag-2-2-level-aa.zh-HK.md`](0011-target-wcag-2-2-level-aa.zh-HK.md) | 以 WCAG 2.2 Level AA 為目標 |
| 0012 | [`0012-target-core-web-vitals-good-thresholds.zh-HK.md`](0012-target-core-web-vitals-good-thresholds.zh-HK.md) | 以 Core Web Vitals「Good」閾值為目標 |

## 如何新增 ADR

1. 下一個編號 = 現有最大編號 + 1，以零填充至四位數。
2. 複製 [`_template.md`](_template.md) → `NNNN-short-kebab-slug.md`
3. 複製 [`_template.zh-HK.md`](_template.zh-HK.md) → `NNNN-short-kebab-slug.zh-HK.md`
4. 於兩個檔案填寫 Status = `Proposed`、Context、Decision、Consequences。
5. 於 [`../09-architecture-decisions.md`](../09-architecture-decisions.md) 及 zh-HK 版表格新增一行。
6. 開啟 PR；合併時將狀態改為 `Accepted`。

## 規則

- **內容僅能追加**。已決策的 ADR 不可再修改 Context 或 Decision。若要翻轉決策，請寫一份 **新的** ADR 取代舊的（將舊 ADR 的 Status 改為 `Superseded by ADR-NNNN` 並加連結）。
- **每份 ADR 只紀錄一項決策**。
- **雙語對等**。每份 ADR 必須同時有 `.md` 與 `.zh-HK.md`。
- **命名**：`NNNN-short-kebab-slug.md` — 小寫、連字號分隔、slug 部份僅用 ASCII 字元。

## 本資料夾中的 meta 檔案

- `README.md` / `README.zh-HK.md` — 本檔案及 zh-HK 並列（資料夾入口頁）
- `_template.md` / `_template.zh-HK.md` — 新 ADR 的起始範本（底線前綴使其排列於資料夾頂部）
