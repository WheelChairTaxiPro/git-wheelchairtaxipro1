---
title: ADR 導讀
language: zh-HK
source: adr-primer.md
last_updated: 2026-04-19
last_synced_with_en: 2026-04-19
status: stub
---

# 架構決策紀錄 (ADR) — 是甚麼

> [English version](adr-primer.md) | [主目錄](../00-index.zh-HK.md)

## 目錄

<!-- TODO：於 Phase 1 撰寫時填寫。 -->

---

## 狀態

本導讀為 **草稿 (stub)**。完整內容將於已核准計劃的 **Phase 1**（與 ADR 範本一同）撰寫。

## 一句話定義

**架構決策紀錄 (ADR)** 是一份簡短、僅能追加的 markdown 檔案，紀錄 **單一項架構決策** — 其背景、決策內容與後果 — 讓未來的讀者明白代碼為何如此設計。

## 為何採用 ADR

- 代碼回答「**怎樣**」；ADR 回答「**為何**」。
- 新加入者可在一小時內讀完 ADR 資料夾，掌握系統歷史。
- 日後重新檢視決策時，有單一的事實紀錄，顯示當時世界的樣貌；我們採用「取代」而非「覆寫」的方式，保留歷史。

## ADR 的結構

每份 ADR 有相同的四個部份。確實模板見 [`../adr/_template.md`](../adr/_template.md)。

| 部份 | 內容 |
|---|---|
| **狀態 (Status)** | Proposed / Accepted / Deprecated / Superseded by ADR-NNNN |
| **背景 (Context)** | 何種力量導致此決策？（情況、約束、問題。） |
| **決策 (Decision)** | 我們決定甚麼？（一句清晰的話，再延伸說明。） |
| **後果 (Consequences)** | 甚麼變得容易？甚麼變得困難？接受了何種權衡？ |

有些團隊會加入額外部份（已考慮方案、相關 ADR、參考資料）。我們容許作者視情況加入。

## 本專案採用的規則

- **編號為零填充四位數**：`0001`、`0002`、…、`0012`、`0013`、…
- **檔名為小寫連字號格式**：`0003-signals-first-state-management.md`
- **每份 ADR 有雙語並列**：`NNNN-slug.zh-HK.md`
- **ADR 僅可追加**：一旦接納，不可再修改決策或背景段落；若要改變決策，寫一份 **新的** ADR 以取代舊的。舊 ADR 狀態更新為 `Superseded by ADR-NNNN` 並加連結，但內容保留。
- **狀態更新可接受** — 「Proposed → Accepted」或「Accepted → Superseded by …」屬於元資料，不是內容修改。
- **一份 ADR 只紀錄一項決策** — 若發現列出兩個替代方案，請寫兩份 ADR。
- **從相關 arc42 章節建立連結** — 例如 [§4 解決方案策略](../04-solution-strategy.zh-HK.md) 及 [§9 架構決策](../09-architecture-decisions.zh-HK.md) 均需連結至所有 ADR。

## 如何新增 ADR

1. 查看 [`../adr/`](../adr/) 中編號最大的檔案，取下一個編號。
2. 複製 [`../adr/_template.md`](../adr/_template.md) 至 `../adr/NNNN-short-slug.md`。
3. 複製 [`../adr/_template.zh-HK.md`](../adr/_template.zh-HK.md) 至 `../adr/NNNN-short-slug.zh-HK.md`。
4. 填寫 Status = `Proposed`、Context、Decision、Consequences。
5. 在 [`../09-architecture-decisions.md`](../09-architecture-decisions.md) 及 zh-HK 版表格新增一行。
6. 開啟 PR。
7. 合併時將狀態改為 `Accepted`（若拒絕則改為 `Rejected`）。

## 延伸閱讀

- Michael Nygard 原文：[Documenting Architecture Decisions](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [adr.github.io](https://adr.github.io/) — 社群範本與工具集
- Joel Parker Henderson 的收錄清單：[github.com/joelparkerhenderson/architecture-decision-record](https://github.com/joelparkerhenderson/architecture-decision-record)

<!-- 新增或更名標題時，請同步更新上方目錄。 -->
