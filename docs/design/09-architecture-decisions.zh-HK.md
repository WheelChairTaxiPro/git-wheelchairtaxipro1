---
arc42_section: 09
title: 架構決策
language: zh-HK
source: 09-architecture-decisions.md
last_updated: 2026-04-19
last_synced_with_en: 2026-04-19
status: stub
---

# 9. 架構決策

> [English version](09-architecture-decisions.md) | [arc42 導讀](_methodology/arc42-primer.zh-HK.md) | [ADR 導讀](_methodology/adr-primer.zh-HK.md) | [主目錄](00-index.zh-HK.md)

## 目錄

<!-- TODO：於 Phase 5 撰寫時填寫（與各 ADR 同時完成）。 -->

---

## 狀態

本章為 **草稿 (stub)**，未來將成為 **架構決策紀錄 (ADR) 的目錄**。內容將於已核准計劃的 **Phase 5**（撰寫 12 項初始 ADR 時）同步完成。

本章 **僅作索引之用** — ADR 本身以獨立 markdown 檔案置於 [`adr/`](adr/) 之下。新的決策應於 `adr/` 建立新 ADR 檔案，並於本章表格新增一行。

## 預定範圍

- **ADR 目錄表格**：每項 ADR 一行，列明編號、標題、狀態 (Proposed / Accepted / Deprecated / Superseded)、日期，以及一句簡述
- **取代關係鏈**：當 ADR-N 取代 ADR-M 時，兩者均保留並互相連結
- **如何新增 ADR**：簡短指引，連結至 [`adr/README.zh-HK.md`](adr/README.zh-HK.md)

## 預定初始 ADR (12 項)

| # | 標題 | 狀態 | 階段 |
|---|---|---|---|
| 0001 | 採用垂直切片架構 | Proposed | Phase 5 |
| 0002 | 採用 Angular 21 + .NET 10 LTS + Node 22 LTS | Proposed | Phase 5 |
| 0003 | Signals 優先狀態管理；RxJS 僅用於串流 | Proposed | Phase 5 |
| 0004 | 後端不採用 MediatR | Proposed | Phase 5 |
| 0005 | 前端託管於 Cloudflare Pages（免費層） | Proposed | Phase 5 |
| 0006 | 以 `@angular/ssr` 進行靜態預渲染（不使用 SSR 運行時） | Proposed | Phase 5 |
| 0007 | GitFlow 分支模型 (`main` / `staging` / `develop`) | Proposed | Phase 5 |
| 0008 | 以 `IMapProvider` 介面支援中國擴展 | Proposed | Phase 5 |
| 0009 | Phase 1 僅以電郵處理預約（無資料庫） | Proposed | Phase 5 |
| 0010 | 雙語：zh-HK 為預設，EN 鏡像於 `/en/…` | Proposed | Phase 5 |
| 0011 | 以 WCAG 2.2 Level AA 為目標 | Proposed | Phase 5 |
| 0012 | 以 Core Web Vitals「Good」閾值為目標 | Proposed | Phase 5 |

## 相關 ADR

上述全部 — 詳見 [`adr/`](adr/)。

<!-- 新增或更名標題時，請同步更新上方目錄。 -->
