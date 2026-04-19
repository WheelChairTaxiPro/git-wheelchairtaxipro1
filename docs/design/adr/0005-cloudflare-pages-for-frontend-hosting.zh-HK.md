---
adr_number: "0005"
title: 前端託管於 Cloudflare Pages（免費層）
status: Proposed
date: 2026-04-19
deciders: project owner
language: zh-HK
source: 0005-cloudflare-pages-for-frontend-hosting.md
last_synced_with_en: 2026-04-19
supersedes: null
superseded_by: null
---

# ADR-0005：前端託管於 Cloudflare Pages（免費層）

> [English version](0005-cloudflare-pages-for-frontend-hosting.md) | [ADR 導讀](../_methodology/adr-primer.zh-HK.md) | [ADR 索引](README.zh-HK.md)

## 狀態 (Status)

Proposed — **草稿 (stub)**；完整內容於 Phase 5 撰寫。

## 背景雛形 (Seed context)

前端以靜態 HTML（預渲染）+ PWA 資源發佈。Cloudflare Pages 提供全球邊緣網絡、自動 HTTPS、每 PR 預覽部署、大方的免費層（充裕建置分鐘、無限頻寬），並與 Cloudflare DNS 原生整合。已評估替代方案：Vercel（限制與商用 fair-use 疑問）、Netlify（免費層頻寬較緊）、GitHub Pages（無預覽部署、無邊緣重寫）、傳統 PaaS（對純靜態而言過頭）。詳細分析見 [`docs/LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md`](../../LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md)。

## 背景 (Context)

TODO — 展開成 2–6 段，涵蓋比較矩陣。

## 決策 (Decision)

TODO — 一句祈使句 + 延伸說明。

**工作表述：** 將 Angular 21 預渲染建置部署至 Cloudflare Pages 免費層。使用 Cloudflare DNS 管理 `wheelchairtaxipro.com`；API 獨立部署於 PaaS 宿主，以 `api.wheelchairtaxipro.com` 公開。

## 後果 (Consequences)

TODO — Positive / Negative / Neutral 清單。標註中國可達性之權衡（見 ADR-0008 / §11）。

## 相關章節

- [§2 約束](../02-constraints.zh-HK.md)
- [§7 部署視圖](../07-deployment-view.zh-HK.md)
- [§11 風險與技術債](../11-risks-and-technical-debts.zh-HK.md)
