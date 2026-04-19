---
arc42_section: 12
title: 詞彙表
language: zh-HK
source: 12-glossary.md
last_updated: 2026-04-19
last_synced_with_en: 2026-04-19
status: stub
---

# 12. 詞彙表

> [English version](12-glossary.md) | [arc42 導讀](_methodology/arc42-primer.zh-HK.md) | [主目錄](00-index.zh-HK.md)

## A-Z 快速跳轉

[A](#a) · [B](#b) · [C](#c) · [D](#d) · [E](#e) · [F](#f) · [G](#g) · [H](#h) · [I](#i) · [J](#j) · [K](#k) · [L](#l) · [M](#m) · [N](#n) · [O](#o) · [P](#p) · [Q](#q) · [R](#r) · [S](#s) · [T](#t) · [U](#u) · [V](#v) · [W](#w) · [X](#x) · [Y](#y) · [Z](#z) · [英文詞彙](#english-terms)

<!-- 目錄說明：本章使用 A-Z 快速跳轉取代一般章節目錄（見 docs/design/README.zh-HK.md 的目錄慣例）。 -->

---

## 狀態

本章為 **草稿 (stub)**。內容將於已核准計劃的 **Phase 2** 撰寫，並會隨其他章節陸續新增的術語持續擴充。

## 預定範圍

一份 **雙語詞彙表**，涵蓋設計與規格文件中所有專業及技術詞彙。每項條目列出英文、繁體中文 (香港)、簡短定義，以及出現該詞的章節連結。

預定初始條目（按字母順序）：

### 業務詞彙

- **輪椅的士** / Wheelchair taxi — 配備斜道或升降台、讓乘客保持在輪椅上上下車的的士。
- **上車點** / Pickup — 乘客上車的地理位置。
- **落車點** / Drop-off — 乘客下車的地理位置。
- **隧道費** / Tunnel fee — 部份香港過海路線需繳付的道路費。
- **附加費** / Surcharge — 於基本車費以外收取的額外費用（夜間、行李等）。
- **照顧者** / Carer — 陪同乘客的人士。
- **調度員** / Dispatcher — 接收並派發預約的營運人員。

### 技術詞彙

- **arc42** — 本規格所採用的 12 章節架構文件範本。
- **C4 模型** — 四個縮放層級的架構圖方法論 (Context · Container · Component · Code)。
- **ADR (架構決策紀錄)** — 每項決策一頁的紀錄文件。
- **垂直切片 (Vertical slice)** — 以功能為中心的資料夾，同時擁有一項面向用戶功能的 UI、資料、測試與路由。
- **Signal** — Angular 21 的響應式原型；當值改變時會自動通知讀取者的變數。
- **漸進式網絡應用程式 (PWA)** — 可像原生應用般安裝的網站。
- **SSG** — 靜態網站產生；於建構時生成 HTML，非每次請求時產生。
- **LTS** — 長期支援版本；擁有延長維護期的發行版本。
- **PoP** — Point of Presence；CDN 邊緣伺服器位置。
- **hreflang** — 告知搜尋引擎該頁面之語言／地區的 HTML 屬性。

### 縮寫

- **GEO** — Generative Engine Optimization；針對 AI 生成式回答引擎之 SEO。
- **AEO** — Answer Engine Optimization；優化內容以被 AI 回答引擎引用。
- **SEO** — 搜尋引擎優化 (Search Engine Optimization)。
- **WCAG** — Web Content Accessibility Guidelines（W3C／WAI）。
- **CWV** — Core Web Vitals（Google 的使用者體驗指標計劃）。
- **LCP** — Largest Contentful Paint。
- **INP** — Interaction to Next Paint。
- **CLS** — Cumulative Layout Shift。
- **SLO** — 服務等級目標 (Service Level Objective)。
- **CORS** — 跨來源資源共享 (Cross-Origin Resource Sharing)。
- **PDPO** — 《個人資料（私隱）條例》— 香港私隱法例。
- **PII** — 個人可識別資訊 (Personally Identifiable Information)。

### 英文詞彙

<a id="english-terms"></a>

*(Phase 2 將於此加入 EN → zh-HK 反向查詢表，方便閱讀英文版時遇到不熟悉的詞語。)*

## 主要輸入來源

- [`initial-design/`](../../initial-design/) 所有檔案（隨各章節撰寫過程陸續採集）
- [`frontend/ARCHITECTURE.md`](../../frontend/ARCHITECTURE.md)
- [`README.md`](../../README.md)
- [`_methodology/`](_methodology/) 下之方法論導讀

<!-- 於規格其他地方新增術語時，請同步於此（按字母順序）新增條目。 -->
