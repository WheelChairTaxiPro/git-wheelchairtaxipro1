# 設計與規格文件

> [English version](README.md)

此資料夾存放 Wheelchair Taxi Pro 的 **正式設計與規格文件 (Design & Specification)**，採用四項業界標準方法：

- **[arc42](_methodology/arc42-primer.zh-HK.md)** — 12 章節文件骨架
- **[C4 模型](_methodology/c4-model-primer.zh-HK.md)** — 四個縮放層級的架構圖 (Context · Container · Component · Code)，使用 Mermaid 繪製
- **[架構決策紀錄 (ADRs)](_methodology/adr-primer.zh-HK.md)** — 每項重要決策一頁的紀錄
- **[WCAG 2.2 + Core Web Vitals](_methodology/wcag-and-web-vitals-primer.zh-HK.md)** — 無障礙與效能品質的明確基準

> **首次接觸這四項方法？** 建議先閱讀這篇獨立、可分享的導讀（現時只有英文版）：[`../LearningNotes/arc42-c4-adrs-wcag-and-web-vitals-explained.md`](../LearningNotes/arc42-c4-adrs-wcag-and-web-vitals-explained.md)。單篇文章即可說明四項方法論各自是甚麼、為何採用、彼此如何配合，並附延伸閱讀連結。

## 由此開始

| 你是… | 請閱讀… |
|---|---|
| 未接觸過 arc42 / C4 / ADRs / WCAG / Web Vitals | [`../LearningNotes/arc42-c4-adrs-wcag-and-web-vitals-explained.md`](../LearningNotes/arc42-c4-adrs-wcag-and-web-vitals-explained.md) — 通俗易懂的英文導讀 |
| **新加入的開發者** | [`00-index.zh-HK.md`](00-index.zh-HK.md) — 完整閱讀路徑 |
| **業務持份者** | [`01-introduction-and-goals.zh-HK.md`](01-introduction-and-goals.zh-HK.md) → [`03-context-and-scope.zh-HK.md`](03-context-and-scope.zh-HK.md) → [`10-quality-requirements.zh-HK.md`](10-quality-requirements.zh-HK.md) → [`12-glossary.zh-HK.md`](12-glossary.zh-HK.md) |
| 要**記錄一項決策** | [`adr/README.zh-HK.md`](adr/README.zh-HK.md) |
| 想於本 repo 了解**這些方法論是甚麼** | [`_methodology/`](_methodology/) |

## 與 `initial-design/` 的關係

[`initial-design/`](../../initial-design/) 資料夾存放的是 **原始研究、建議書與早期草稿**，是本正式規格的輸入來源。那些文件仍可供查閱以理解歷史脈絡，但 **本資料夾才是建構系統的主要參考**。

## 雙語

本資料夾每份文件都以 **兩個並列檔案** 形式存在：

- `<filename>.md` — 英文（內容主體，以此為準）
- `<filename>.zh-HK.md` — 繁體中文 (香港)

跨文件連結使用相對路徑；語言由檔名後綴決定。每頁頂部設有語言切換連結。

## 狀態

Phase 0 完成骨架建立。內容將按已核准計劃於 Phase 1–5 陸續填寫。尚未填寫的文件會在前置資料 (front matter) 標示 `status: stub`，並列出預定內容範圍與主要輸入來源。

---

*最近更新：2026-04-19*
