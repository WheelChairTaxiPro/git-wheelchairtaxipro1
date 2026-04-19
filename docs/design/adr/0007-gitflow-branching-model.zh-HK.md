---
adr_number: "0007"
title: GitFlow 分支模型 (`main` / `staging` / `develop`)
status: Proposed
date: 2026-04-19
deciders: project owner
language: zh-HK
source: 0007-gitflow-branching-model.md
last_synced_with_en: 2026-04-19
supersedes: null
superseded_by: null
---

# ADR-0007：GitFlow 分支模型 (`main` / `staging` / `develop`)

> [English version](0007-gitflow-branching-model.md) | [ADR 導讀](../_methodology/adr-primer.zh-HK.md) | [ADR 索引](README.zh-HK.md)

## 狀態 (Status)

Proposed — **草稿 (stub)**；完整內容於 Phase 5 撰寫。

## 背景雛形 (Seed context)

我們有三個環境（production、staging、每個 PR 的預覽）。採用每個環境對應一條長期分支的模型（`main` → production、`staging` → staging、`develop` → preview + 整合）最直接對應。短期 `feature/*`、`fix/*`、`release/*`、`hotfix/*` 分支承載進行中的工作，以 PR 合併。詳見 [`CONTRIBUTING.md` §Branching](../../../CONTRIBUTING.md)。

## 背景 (Context)

TODO — 展開成 2–6 段。討論 GitHub Flow（單一 `main` + PR）作為替代方案，及為何在三環境設定下被否決。

## 決策 (Decision)

TODO — 一句祈使句 + 延伸說明。

**工作表述：** 採用 GitFlow，設三條長期分支 (`main`、`staging`、`develop`)，並以慣用短期前綴 (`feature/`、`fix/`、`release/`、`hotfix/`) 命名短期分支。所有合併須經 PR；分支保護禁止直接推送至長期分支。

## 後果 (Consequences)

TODO — Positive / Negative / Neutral 清單。

## 相關章節

- [§2 約束](../02-constraints.zh-HK.md)
- [§7 部署視圖](../07-deployment-view.zh-HK.md)
