---
arc42_section: 02
title: 約束
language: zh-HK
source: 02-constraints.md
last_updated: 2026-04-19
last_synced_with_en: 2026-04-19
status: stub
---

# 2. 約束

> [English version](02-constraints.md) | [arc42 導讀](_methodology/arc42-primer.zh-HK.md) | [主目錄](00-index.zh-HK.md)

## 目錄

<!-- TODO：於 Phase 3 撰寫時填寫。 -->

---

## 狀態

本章為 **草稿 (stub)**。內容將於已核准計劃的 **Phase 3** 撰寫。

## 預定範圍

- **技術約束**：Angular 21 LTS、.NET 10 LTS、Node.js 22 LTS、Cloudflare Pages 免費層、僅使用 Mermaid 繪圖、以 GitHub 風格 Markdown 渲染、不採用付費繪圖工具、不使用 MediatR
- **組織約束**：約 6 週的 Phase 1 MVP 時程、初期為獨立或小規模團隊、所有用戶可見介面必須同時提供 zh-HK 與 EN 文案、採用 GitFlow 並以 `main` / `staging` / `develop` 為長期分支
- **法規約束**：對乘客個人資料（電話、電郵）須遵守香港個人資料（私隱）條例 (PDPO)；無障礙目標為 WCAG 2.2 Level AA；面向歐盟訪客的 GDPR 立場；Google Maps / Places / Directions API 使用條款
- **商業模式約束**：Phase 1 僅設單一預設業務身分（一個調度郵箱、一個電話、一個 WhatsApp、一個 WeChat）；Phase 1 不處理付款；Phase 1 不提供司機應用程式

## 主要輸入來源

- [`README.md`](../../README.md) §Tech Stack、§Support windows
- [`CONTRIBUTING.md`](../../CONTRIBUTING.md) §Prerequisites、§Branching
- [`docs/LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md`](../LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md) §Limits
- [`initial-design/11-SoftwareTools.md`](../../initial-design/11-SoftwareTools.md)

## 相關 ADR

- [ADR-0002 採用 Angular 21 + .NET 10 LTS + Node 22 LTS](adr/0002-use-angular-21-and-dotnet-10-lts.zh-HK.md)
- [ADR-0005 前端託管於 Cloudflare Pages](adr/0005-cloudflare-pages-for-frontend-hosting.zh-HK.md)
- [ADR-0007 GitFlow 分支模型](adr/0007-gitflow-branching-model.zh-HK.md)

<!-- 新增或更名標題時，請同步更新上方目錄。 -->
