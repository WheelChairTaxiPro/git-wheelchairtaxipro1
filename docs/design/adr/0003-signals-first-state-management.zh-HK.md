---
adr_number: "0003"
title: Signals 優先狀態管理；RxJS 僅用於串流
status: Proposed
date: 2026-04-19
deciders: project owner
language: zh-HK
source: 0003-signals-first-state-management.md
last_synced_with_en: 2026-04-19
supersedes: null
superseded_by: null
---

# ADR-0003：Signals 優先狀態管理；RxJS 僅用於串流

> [English version](0003-signals-first-state-management.md) | [ADR 導讀](../_methodology/adr-primer.zh-HK.md) | [ADR 索引](README.zh-HK.md)

## 狀態 (Status)

Proposed — **草稿 (stub)**；完整內容於 Phase 5 撰寫。

## 背景雛形 (Seed context)

Angular 21 將 Signals 列為一等響應式原型：同步讀取、zoneless-ready、無需管理訂閱生命週期。過往 Angular 應用習慣以 RxJS `BehaviorSubject` 處理所有共享狀態，結果把開發者拖入 marble 思考、訂閱管理與 zone 互通的問題 — 但這類問題本質上只是「保存一個值，值變時通知讀取者」。Signals 直接解決這個問題。當問題是真正的 **串流**（去抖動輸入、websocket、HTTP 編排、合併非同步事件）時，RxJS 仍是合適工具 — `@angular/core/rxjs-interop` 提供 `toSignal` / `toObservable` 作邊界轉換。規範見 [`frontend/ARCHITECTURE.md` §4a](../../../frontend/ARCHITECTURE.md)，實例見 [`initial-design/15-phase1-build-order.md`](../../../initial-design/15-phase1-build-order.md)（`TripStateService`）。

## 背景 (Context)

TODO — 展開成 2–6 段。

## 決策 (Decision)

TODO — 一句祈使句 + 延伸說明。

**工作表述：** 全前端預設以 Angular Signals 作為狀態管理原型。僅當問題是真正的串流（需 `debounceTime`、`switchMap`、`merge` 等隨時間變化的非同步事件）才使用 RxJS。邊界以 `@angular/core/rxjs-interop` 的 `toSignal` / `toObservable` 轉換。共享狀態置於 `shared/services/`，以私有 `signal()` + `asReadonly()` 作公開介面。

## 後果 (Consequences)

TODO — Positive / Negative / Neutral 清單。

## 相關章節

- [§4 解決方案策略](../04-solution-strategy.zh-HK.md)
- [§6 運行時視圖](../06-runtime-view.zh-HK.md)
- [§8 橫向關注點](../08-cross-cutting-concepts.zh-HK.md)
