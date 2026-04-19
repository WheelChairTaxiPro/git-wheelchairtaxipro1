---
arc42_section: 07
title: 部署視圖
language: zh-HK
source: 07-deployment-view.md
last_updated: 2026-04-19
last_synced_with_en: 2026-04-19
status: stub
---

# 7. 部署視圖

> [English version](07-deployment-view.md) | [arc42 導讀](_methodology/arc42-primer.zh-HK.md) | [C4 導讀](_methodology/c4-model-primer.zh-HK.md) | [主目錄](00-index.zh-HK.md)

## 目錄

<!-- TODO：於 Phase 3 撰寫時填寫。 -->

---

## 狀態

本章為 **草稿 (stub)**。內容將於已核准計劃的 **Phase 3** 撰寫。

## 預定範圍

- **C4 部署圖**（Mermaid）：實體／雲端拓撲
  - Cloudflare 全球邊緣網絡（逾 300 個 PoP，包括香港）提供預渲染的 Angular 21 HTML 及靜態資源
  - `.NET 10` Web API 容器，部署於單一地區 (HK 或 SG) 的 PaaS 實例 (Railway / Render / Fly.io)
  - 電郵供應商 (SMTP 或 SendGrid) 用於預約通知
  - DNS (Cloudflare)：`wheelchairtaxipro.com` → Pages，`api.wheelchairtaxipro.com` → PaaS
  - 外部：Google Maps API、Google Analytics 4、Google Search Console、Google Business Profile
- **環境**：本地開發、Cloudflare 預覽（每個 PR 一個）、staging、production
- **CI/CD 流程**（Mermaid 流程圖）：
  - `feature/*` → GitHub push → CF 預覽部署 → PR 審查 → 合併至 `develop` → 部署至 staging → release 分支 → 合併至 `main` → 部署至 production
  - API 流程：GitHub Actions → Docker build → push 至 registry → PaaS 部署
- **營運考量**：回滾策略、secrets 管理（PaaS 環境變數；絕不進入 git）、日誌彙整（使用供應商預設）、可用性監察

## 主要輸入來源

- [`docs/LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md`](../LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md)
- [`initial-design/9-Hosting options and pricing research for WheelchairTaxiPro in Hong Kong.md`](../../initial-design/9-Hosting%20options%20and%20pricing%20research%20for%20WheelchairTaxiPro%20in%20Hong%20Kong.md)
- [`initial-design/10-hosting_affiliate_strategy_for_wheelchair_taxi_pro_hong_kong.md`](../../initial-design/10-hosting_affiliate_strategy_for_wheelchair_taxi_pro_hong_kong.md)
- [`initial-design/12-Hybrid_Hosting.md`](../../initial-design/12-Hybrid_Hosting.md)
- [`initial-design/DiscussArchitectures.md`](../../initial-design/DiscussArchitectures.md)
- [`CONTRIBUTING.md`](../../CONTRIBUTING.md) §Branching

## 相關 ADR

- [ADR-0005 前端託管於 Cloudflare Pages](adr/0005-cloudflare-pages-for-frontend-hosting.zh-HK.md)
- [ADR-0006 以 `@angular/ssr` 進行靜態預渲染](adr/0006-static-prerender-via-angular-ssr.zh-HK.md)
- [ADR-0007 GitFlow 分支模型](adr/0007-gitflow-branching-model.zh-HK.md)

<!-- 新增或更名標題時，請同步更新上方目錄。 -->
