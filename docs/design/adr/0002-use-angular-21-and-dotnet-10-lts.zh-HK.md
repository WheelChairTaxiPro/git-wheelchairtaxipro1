---
adr_number: "0002"
title: 採用 Angular 21 + .NET 10 LTS + Node 22 LTS
status: Proposed
date: 2026-04-19
deciders: project owner
language: zh-HK
source: 0002-use-angular-21-and-dotnet-10-lts.md
last_synced_with_en: 2026-04-19
supersedes: null
superseded_by: null
---

# ADR-0002：採用 Angular 21 + .NET 10 LTS + Node 22 LTS

> [English version](0002-use-angular-21-and-dotnet-10-lts.md) | [ADR 導讀](../_methodology/adr-primer.zh-HK.md) | [ADR 索引](README.zh-HK.md)

## 狀態 (Status)

Proposed — **草稿 (stub)**；完整內容於 Phase 5 撰寫。

## 背景雛形 (Seed context)

本專案於 2026 年新建，預期運行多年。Angular 與 .NET 均以 LTS 發行節奏運作並提供延長支援期。在專案起步即採用 LTS（Angular 21 LTS、.NET 10 LTS，以及為支援 Angular 21 工具所需的 Node 22 LTS）可取得可預期的安全補丁保障，避免 Phase 1 中段被迫進行重大版本遷移。支援期細節見 [`README.md` §Support windows](../../../README.md)。

## 背景 (Context)

TODO — 展開成 2–6 段。

## 決策 (Decision)

TODO — 一句祈使句 + 延伸說明。

**工作表述：** 採用 Angular 21（前端）、.NET 10 LTS（後端）、Node.js 22 LTS（建構／工具）。只升級至下一個 LTS 版本；除非有特定需要，否則跳過中間的非 LTS 主版本。

## 後果 (Consequences)

TODO — Positive / Negative / Neutral 清單。

## 相關章節

- [§2 約束](../02-constraints.zh-HK.md)
