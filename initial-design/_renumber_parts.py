import re
from pathlib import Path

p = Path(__file__).parent / "advertisement-and-tracking-instructions.md"
text = p.read_text(encoding="utf-8")

# Placeholder main part headers (avoid collision)
text = text.replace("# Part 5 — Summary", "# Part __P7_SUMMARY__")
text = text.replace(
    "# Part 7 — SEO, GEO, AEO & AI search optimization",
    "# Part __P6_SEO__",
)
text = text.replace(
    "# Part 6 — End-to-end setup: Google Ad → Cloudflare Worker → GA4",
    "# Part __P5_E2E__",
)

# Old Part 7 (SEO): renumber ## 7.x / ### 7.x -> placeholders
seo_pat = re.compile(r"^(#{2,3}) (7\.\d+(?:\.\d+)?)", re.MULTILINE)


def seo_repl(m):
    return f"{m.group(1)} __SEO__{m.group(2)[2:]}"


text = seo_pat.sub(seo_repl, text)

# Old Part 6 (E2E): renumber ## 6.x and §6.x
e2e_pat = re.compile(r"^(## )6\.(\d+)", re.MULTILINE)
text = e2e_pat.sub(r"\1__E2E__5.\2", text)
text = text.replace("§6.", "§__E2E__5.")

# Restore part headers
text = text.replace(
    "# Part __P6_SEO__",
    "# Part 6 — SEO, GEO, AEO & AI search optimization",
)
text = text.replace(
    "# Part __P5_E2E__",
    "# Part 5 — End-to-end setup: Google Ad → Cloudflare Worker → GA4",
)
text = text.replace("# Part __P7_SUMMARY__", "# Part 7 — Summary")

# Restore subsection numbers
text = text.replace("__SEO__", "6.")
text = text.replace("__E2E__", "")

# Cross-references: tracking (old Part 6 -> Part 5)
subs = [
    ("use **Part 6** below", "use **Part 5** below"),
    ("**Part 6 Phase", "**Part 5 Phase"),
    ("Part 6 Phase", "Part 5 Phase"),
    ("Part 2 / Part 6", "Part 2 / Part 5"),
    ("| **GA4** | ⏳ Planned | Part 6 —", "| **GA4** | ⏳ Planned | Part 5 —"),
    (
        "| **Google Analytics 4** | Yes (Part 6) |",
        "| **Google Analytics 4** | Yes (Part 5) |",
    ),
    ("landing page (Part 6),", "landing page (Part 5),"),
    ("once Part 6 live)", "once Part 5 live)"),
    ("Parallel with Part 6:", "Parallel with Part 5:"),
    ("GA4 organic channel visible (Part 6)", "GA4 organic channel visible (Part 5)"),
    ("full pipeline in **Part 6**:", "full pipeline in **Part 5**:"),
    ("**Part 6 Phase B (GA4)**", "**Part 5 Phase B (GA4)**"),
    ("**Part 6 Phase C (Worker)**", "**Part 5 Phase C (Worker)**"),
]
for a, b in subs:
    text = text.replace(a, b)

# Cross-references: SEO (old Part 7 -> Part 6)
subs2 = [
    ("| 7 | **Part 7** —", "| 7 | **Part 6** —"),
    ("| 8 | **Part 7** —", "| 8 | **Part 6** —"),
    ("(Part 7)", "(Part 6)"),
    ("**Discoverability** — **Part 7**:", "**Discoverability** — **Part 6**:"),
    ("see Part 7 §6.11", "see Part 6 §6.11"),
    ("**Part 7** technical SEO", "**Part 6** technical SEO"),
    ("**Part 7** schema", "**Part 6** schema"),
]
for a, b in subs2:
    text = text.replace(a, b)

# Newline before Part 7 Summary
text = text.replace(
    "CWV targets\n# Part 7 — Summary",
    "CWV targets\n\n---\n\n# Part 7 — Summary",
)

toc = """## Table of contents

- [Do we understand what you want?](#do-we-understand-what-you-want)
- [Current state of this repository (baseline)](#current-state-of-this-repository-baseline)
- [Part 1 — Advertisement in the application](#part-1--advertisement-in-the-application)
  - [1.1 What "advertisement" can mean](#11-what-advertisement-can-mean-for-this-product)
  - [1.2 Where to place ads in the UI](#12-where-to-place-ads-in-the-ui-without-breaking-booking)
  - [1.3 Implementation options (Angular)](#13-implementation-options-angular)
  - [1.4 Checklist — adding advertisement](#14-checklist--adding-advertisement)
- [Part 2 — Tracking usage and traffic source](#part-2--tracking-usage-and-traffic-source)
  - [2.1 What to measure](#21-what-to-measure)
  - [2.1a Traffic sources (Google, Facebook, organic, direct, QR)](#21a-traffic-sources-google-facebook-organic-direct-qr-code)
  - [2.2 Recommended tooling](#22-recommended-tooling)
  - [2.3 Implementation steps (GA4)](#23-implementation-steps-ga4-for-this-angular-spa)
  - [2.4 How to read reports (traffic source)](#24-where-they-getting-into-app--how-to-read-reports)
  - [2.5 Privacy, cookies, and Hong Kong](#25-privacy-cookies-and-hong-kong-context)
  - [2.6 Short pointer: Worker ad-click logging](#26-short-pointer-worker-ad-click-logging)
- [Part 3 — Suggested order of work](#part-3--suggested-order-of-work)
- [Part 4 — Code touchpoints in this repo](#part-4--code-touchpoints-in-this-repo-when-you-implement)
- [**Part 5 — End-to-end setup: Google Ad → Worker → GA4**](#part-5--end-to-end-setup-google-ad--cloudflare-worker--ga4) ⭐
  - [5.1 Services & accounts to join](#51-services--accounts-to-join)
  - [5.2 Target architecture](#52-target-architecture)
  - [5.3 Phase A — Google Ads (landing URL + auto-tagging)](#53-phase-a--google-ads-landing-url--auto-tagging)
  - [5.4 Phase B — Google Analytics 4 (GA4)](#54-phase-b--google-analytics-4-ga4)
  - [5.5 Phase C — Cloudflare Worker + D1 (IP / gclid logging)](#55-phase-c--cloudflare-worker--d1-ip--gclid-logging)
  - [5.6 Phase D — Angular code to add or change](#56-phase-d--angular-code-to-add-or-change)
  - [5.7 Phase E — Deploy & connect domain](#57-phase-e--deploy--connect-domain)
  - [5.8 End-to-end verification checklist](#58-end-to-end-verification-checklist)
  - [5.9 Using both GA4 and Worker together (rules)](#59-using-both-ga4-and-worker-together-rules)
- [**Part 6 — SEO, GEO, AEO & AI search optimization**](#part-6--seo-geo-aeo--ai-search-optimization) ⭐
  - [6.1 What SEO, GEO, AEO, and AI search mean](#61-what-seo-geo-aeo-and-ai-search-mean)
  - [6.2 Current baseline in this repository](#62-current-baseline-in-this-repository)
  - [6.3 Services & accounts to join](#63-services--accounts-to-join)
  - [6.4 Foundation — technical SEO (all channels)](#64-foundation--technical-seo-all-channels)
  - [6.5 On-page SEO — every public route](#65-on-page-seo--every-public-route)
  - [6.6 Structured data (Schema.org JSON-LD)](#66-structured-data-schemaorg-json-ld)
  - [6.7 GEO — Generative Engine Optimization](#67-geo--generative-engine-optimization)
  - [6.8 AEO — Answer Engine Optimization](#68-aeo--answer-engine-optimization)
  - [6.9 Google AI Mode & other AI search surfaces](#69-google-ai-mode--other-ai-search-surfaces)
  - [6.10 Local & off-site signals (Hong Kong)](#610-local--off-site-signals-hong-kong)
  - [6.11 Angular code to add or change](#611-angular-code-to-add-or-change)
  - [6.12 Measurement & verification](#612-measurement--verification)
  - [6.13 Suggested order of work](#613-suggested-order-of-work)
  - [6.14 Master checklist](#614-master-checklist)
- [Part 7 — Summary](#part-7--summary)

"""

text = re.sub(
    r"## Table of contents\n\n.*?\n\n---\n",
    toc + "---\n",
    text,
    count=1,
    flags=re.DOTALL,
)

p.write_text(text, encoding="utf-8")
print("Done")
