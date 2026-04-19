# arc42, C4, ADRs, and WCAG + Web Vitals — the four pillars of a modern Design & Specification

> *A reference primer on the four industry-standard methodologies that underpin the formal Design & Specification in [`docs/design/`](../design/). Written as a standalone article so you can share it, link it, or read it before touching the spec itself.*

## Why these four, and why together?

A good software spec has to answer four very different questions:

1. **What order do we write things in so nothing gets forgotten?** → *arc42*
2. **How do we draw the diagrams so every box has an unambiguous meaning?** → *C4 Model*
3. **How do we record *why* we made each architectural choice, permanently?** → *ADRs*
4. **How do we pin accessibility and performance to numbers that can be tested on every pull request?** → *WCAG 2.2* and *Web Vitals*

Each of the four is a focused, well-maintained, vendor-neutral standard with a short learning curve. Combined, they give you a spec that a new developer can read from top to bottom and trust; a business stakeholder can skim and understand; and a future maintainer can extend without archaeology. They are the scaffolding the rest of the docs hang on.

---

## 1. arc42 — the D&S structural template

### What it is

**arc42** is a free, open-source template for documenting software architecture. It was created by two German architects, **Gernot Starke** and **Peter Hruschka**, around 2005, and is now maintained at [arc42.org](https://arc42.org/). It is deliberately **vendor-neutral, technology-neutral, and methodology-neutral** — it is just a skeleton of **12 numbered sections** that covers everything an architecture document typically needs to say, in a consistent order, with consistent names, across any kind of software project.

### The 12 sections

| § | Section | What it answers |
|---|---|---|
| 1 | Introduction & Goals | What is this system? Who is it for? What are the top-3 quality goals? |
| 2 | Constraints | Technical, organizational, and regulatory things we must live with |
| 3 | Context & Scope | What's inside our system vs. outside? Who talks to it? |
| 4 | Solution Strategy | The big-picture approach in a few paragraphs (e.g. "Angular PWA + .NET 10 API, vertical slices, signals-first, Cloudflare Pages prerender") |
| 5 | Building Block View | Static decomposition — folders, slices, components (this is where C4 Component diagrams live) |
| 6 | Runtime View | Sequence diagrams — how does "submit booking" flow at runtime? |
| 7 | Deployment View | Where does the code run? (Cloudflare Pages, PaaS, DNS, CDN) |
| 8 | Cross-cutting Concepts | Topics that touch every slice: bilingual content, SEO/GEO, logging, errors, state management |
| 9 | Architecture Decisions | Index of ADRs (see §3 below) |
| 10 | Quality Requirements | The "shall" list — performance, a11y, security, availability |
| 11 | Risks & Technical Debts | Known problems we're accepting for now |
| 12 | Glossary | Every domain term defined once, so EN and zh-HK readers agree on meaning |

### Why adopt it for the D&S

- **It's a recognized standard.** If you later hire a senior developer or hand the spec to a partner, they immediately recognize the structure and know where to look. No onboarding needed.
- **It prevents "we forgot to document X".** The 12 sections are a checklist. It's hard to accidentally omit quality requirements or constraints when the template has named slots for them.
- **It separates static, dynamic, and operational views.** §5 (what things exist), §6 (how things behave at runtime), and §7 (where things run) are three different questions that lazy docs tend to mush together. arc42 enforces the separation.
- **It's free, English, has a German edition, uses plain markdown.** No licence fee, no tooling lock-in.

### How it applies to this project

The [`initial-design/`](../../initial-design/) folder already contains raw material for nine of the twelve sections. The new arc42-structured spec in [`docs/design/`](../design/) reorganizes and formalizes that material into the canonical skeleton, filling only the genuinely missing parts (API spec, NFRs, SEO spec, ADRs, diagrams).

Concretely, each numbered section becomes one markdown file. A reader reads `01-introduction-and-goals.md` through `12-glossary.md` in order and ends up with a complete understanding of the system.

---

## 2. C4 Model — for diagrams

### What it is

The **C4 model**, created by **Simon Brown** and documented at [c4model.com](https://c4model.com/), is a way of drawing software diagrams at **four zoom levels**, each with a fixed, unambiguous meaning. The four levels are:

| Level | Name | Zoom | Audience | One for this project |
|---|---|---|---|---|
| **L1** | Context | "The system in its world" — users, your system as one box, external systems it talks to | Anyone — stakeholders, business | Rider uses our PWA → talks to our API → which calls Google Maps, SMTP, GA4 |
| **L2** | Container | Inside your system — the high-level deployable units (web app, API, database, worker, cache) | Developers, ops | Cloudflare Pages (Angular) · .NET API on PaaS · (later) PostgreSQL |
| **L3** | Component | Inside one container — the slices / modules / services | Developers on that container | The frontend's `features/map`, `features/booking`, `shared/services/TripStateService` + the backend's Booking slice, `IEmailSender`, `GoogleMapsProvider` |
| **L4** | Code | Inside one component — classes and methods | Rarely drawn — let the IDE generate it | Skipped for us |

### Why this matters

Most architecture diagrams you see in the wild are ambiguous: a box on the page could be a class, a process, a container, a team, or a database — the reader has to guess. C4 solves that by giving every box **a defined type at a defined zoom level**. Three clear diagrams (L1, L2, L3) beat one messy "kitchen-sink" diagram.

### Notation & tooling

- Simple shapes: rectangles for elements, arrows for relationships. Labels say **what** and **how** (e.g. `Browser → Cloudflare Pages : HTTPS / HTML + JS`).
- **Mermaid** renders C4 diagrams natively in markdown — GitHub, GitLab, and VS Code all display them without any build step. That's what we use.
- Alternatives exist (Structurizr, PlantUML, draw.io) but Mermaid is the least friction for this setup.

### How it applies to this project

The new arc42 sections get C4 diagrams at the right places:

| arc42 section | C4 diagram type |
|---|---|
| §3 Context & Scope | C4 L1 (Context) |
| §5 Building Block View | C4 L2 (Container) + C4 L3 (Component) — one per key container |
| §6 Runtime View | Sequence diagrams (not strictly C4, but complementary) |
| §7 Deployment View | C4 Deployment variant — where each container runs |

---

## 3. ADRs — Architecture Decision Records

### What they are

An **ADR** is a small markdown file that records **one architectural decision**, including the context around it and the consequences of making it. The concept was popularized by **Michael Nygard** in a 2011 blog post *Documenting Architecture Decisions*. They've since become a near-universal practice in mature engineering teams (ThoughtWorks, Microsoft, AWS, Spotify, Shopify all use them).

### Standard ADR template

```markdown
# ADR-0003: Use Signals-first State Management (RxJS Only for Streams)

Status: Accepted
Date:   2026-04-19

## Context
Angular 21 introduced signals as the recommended reactive primitive.
BehaviorSubject was the historical default for shared state services…

## Decision
All feature and shared state is held in `signal()`. RxJS is used
only for HTTP, debounced input, and event streams…

## Consequences
+ Zoneless-ready, less subscription boilerplate, simpler tests
- Team must learn signal idioms; a few libraries still emit Observables
```

### Key rules

- **One decision per file.** Numbered sequentially: `0001-…`, `0002-…`, `0003-…`.
- **Immutable once accepted.** You never edit an "accepted" ADR. If you change your mind, you create a **new** ADR that says "supersedes ADR-0003" and change ADR-0003's status to "Superseded".
- **Short.** One page is ideal. If you need more, you're probably describing architecture, not a single decision.
- **Every non-trivial choice gets one.** "We chose X over Y because Z" is the universal format.

### Why adopt them

- **Kills the "why is it like this?" question.** Six months from now, nobody remembers why you picked .NET 10 over Node.js, Cloudflare Pages over Vercel, vertical slices over clean architecture, signals over RxJS. An ADR answers in 60 seconds.
- **Keeps the main spec short.** The spec says **what** the system is; ADRs say **why** we chose it this way. Separating them keeps both readable.
- **Good signal for a healthy project.** Projects with ADRs tend to have thought through their choices. Projects without ADRs tend to have a lot of "we've always done it this way" decisions nobody can defend.

### Candidate ADRs for this project

A quick, non-exhaustive preview of the ADRs we'd capture:

```
docs/design/adr/
├── 0001-use-vertical-slice-architecture.md
├── 0002-use-angular-21-and-dotnet-10-lts.md
├── 0003-signals-first-state-management.md
├── 0004-no-mediatr.md
├── 0005-cloudflare-pages-for-frontend-hosting.md
├── 0006-static-prerender-via-angular-ssr.md
├── 0007-gitflow-branching.md
├── 0008-imapprovider-adapter-for-china-expansion.md
├── 0009-email-only-bookings-in-phase-1.md
└── 0010-bilingual-default-zh-hk-with-en-mirror.md
```

Each captures one historical choice already made or documented in scattered form across the initial design folder. Pulling them into ADRs makes the reasoning **explicit** and **permanent**.

---

## 4. WCAG 2.2 and Web Vitals — anchors for accessibility + performance

These are **two separate industry standards** that together define most of the §10 "Quality Requirements" chapter.

### 4a. WCAG 2.2 — Web Content Accessibility Guidelines

**What it is.** WCAG (Web Content Accessibility Guidelines) is the **W3C/WAI** global standard for how to make web content accessible to people with disabilities. Version 2.2 was published in **October 2023** and is the current stable release. The authoritative reference is the [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/).

**The four principles — "POUR":**

| Principle | Meaning | Examples of what it forces |
|---|---|---|
| **Perceivable** | Users must be able to perceive the content (sight, hearing, touch) | Text alternatives for images, captions for video, sufficient colour contrast |
| **Operable** | All functionality must be usable without a specific input method | Keyboard-navigable (no mouse required), no flashing triggers, enough time |
| **Understandable** | Content and operation must be predictable and clear | Language of the page declared, consistent navigation, labelled form fields |
| **Robust** | Content must work with current and future assistive technologies | Valid HTML, correct ARIA, name/role/value for all custom controls |

**Three conformance levels:**

- **Level A** — minimum (mostly a "do no harm" floor)
- **Level AA** — the industry-standard legal target (EU European Accessibility Act, UK Equality Act, US ADA case law, HK Government accessibility guidance all cite AA)
- **Level AAA** — aspirational; rarely achievable for every page

**Why this is non-negotiable for this project.** A service whose primary audience includes wheelchair users will very plausibly also serve users with visual, cognitive, or motor impairments. If a wheelchair-taxi website is harder to use than a standard taxi website, that's both an ethical failure and a brand-fit failure — and in some jurisdictions, a **legal liability**. WCAG 2.2 AA is the right target and should be encoded explicitly in the quality requirements chapter, with per-slice acceptance criteria.

Concretely, for this site, **AA** means things like:

- Every interactive element (phone button, booking submit, map pin, language toggle) must be reachable **by keyboard alone**.
- Text contrast **≥ 4.5:1** for body text, **≥ 3:1** for large text.
- The map tab must expose an **accessible non-map fallback** (address input) — don't strand users who can't manipulate a pin.
- Form fields have real `<label>`s, error messages are programmatically associated, and errors are announced to screen readers.
- The language of each page is declared (`<html lang="zh-HK">` / `lang="en"`).
- **No colour alone as information** (e.g. "red = error" must also have text or an icon).

These get captured as testable criteria in the new `10-quality-requirements.md` and verified in E2E + manual audits.

### 4b. Web Vitals — performance as a user experience metric

**What it is.** **Web Vitals** is Google's program for defining the user-experience metrics that matter most on the modern web. The central subset is **Core Web Vitals (CWV)** — three metrics that are also **direct ranking signals in Google Search** since 2021.

**The three Core Web Vitals** (current as of 2026):

| Metric | Full name | Measures | "Good" target |
|---|---|---|---|
| **LCP** | Largest Contentful Paint | How long until the main content appears | **≤ 2.5 seconds** |
| **INP** | Interaction to Next Paint | How responsive the page feels to input | **≤ 200 milliseconds** |
| **CLS** | Cumulative Layout Shift | How much the layout jumps during load | **≤ 0.1** |

Google measures these on **real users' devices** ("field data" via the Chrome User Experience Report) and on **synthetic tests** (Lighthouse). Both feed into your Search ranking.

**Why this is non-negotiable for this project.** The product strategy — stated in the [`README.md`](../../README.md) — is to **outrank competitors on Google Search, Maps, and AI answer engines**. Core Web Vitals are literally ranking signals for that search. A site that fails CWV starts every SEO contest at a disadvantage before the content is even considered. Cloudflare Pages + static prerender + Angular signals-first + lazy-loaded slices (every choice already made, actually) are tuned to hit these targets.

Concretely, for this site, that means:

- Define **explicit SLOs** in §10: `LCP p75 ≤ 2.5s on 4G`, `INP p75 ≤ 200ms`, `CLS p75 ≤ 0.1`.
- **Measure continuously**: Lighthouse CI in the Cloudflare Pages preview pipeline; Google Search Console CWV report once live.
- Specific engineering rules derived from these: preload the hero image, avoid layout-shifting banners, keep main-thread work short (signals help), ship one prerendered HTML file per route.

### Why these two, together

**WCAG covers "can everybody use it?"** **Web Vitals cover "does it feel fast?"** Together they define ~80% of the non-functional requirements, and both come with well-documented targets and off-the-shelf testing tools (axe, Lighthouse, PageSpeed Insights, Playwright accessibility assertions). That's why they're the right anchor for the quality chapter — **rigour without inventing metrics from scratch**.

---

## Putting it all together

| Layer | Question it answers | Tool |
|---|---|---|
| **Structure** | What order do we document things in? | **arc42** — 12 numbered sections |
| **Visuals** | What does each box in a diagram mean? | **C4 Model** — four zoom levels, rendered in Mermaid |
| **History** | Why did we choose X over Y? | **ADRs** — one decision per markdown file, immutable once accepted |
| **Quality floor** | What does "accessible and fast enough" mean in numbers? | **WCAG 2.2 Level AA** + **Core Web Vitals "Good"** |

Each one is free, well-documented, widely adopted, and independent of any particular technology stack. Adopting all four means the Design & Specification is **auditable** (anyone can compare it to the standard), **checkable** (CI can enforce most of WCAG and all of CWV), and **durable** (ADRs preserve reasoning long after the people who made the decisions move on).

## Further reading

| Methodology | Canonical source |
|---|---|
| arc42 | [arc42.org](https://arc42.org/) · Starke & Hruschka, *Documenting Software Architectures with arc42* |
| C4 Model | [c4model.com](https://c4model.com/) · Simon Brown, *Software Architecture for Developers* |
| ADRs | Michael Nygard, [*Documenting Architecture Decisions*](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions) (2011) · [adr.github.io](https://adr.github.io/) |
| WCAG 2.2 | [W3C WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/) · [WebAIM checklist](https://webaim.org/standards/wcag/checklist) |
| Web Vitals | [web.dev/vitals](https://web.dev/vitals/) · [Google Search — Page Experience](https://developers.google.com/search/docs/appearance/page-experience) |

## Where this applies in the repo

- Formal spec built on arc42 + C4 + ADRs: [`docs/design/`](../design/)
- Methodology primers (brief in-repo restatements): [`docs/design/_methodology/`](../design/_methodology/)
- ADRs capturing historical and ongoing decisions: [`docs/design/adr/`](../design/adr/)
- Quality chapter anchored to WCAG + CWV: [`docs/design/10-quality-requirements.md`](../design/10-quality-requirements.md)

---

*Last updated: 2026-04-19*
