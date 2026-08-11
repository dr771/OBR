# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository. Codex also works in this repo and reads `AGENTS.md`, which points back here — CLAUDE.md is the shared source of truth for both, not Claude-specific.

## Project Overview

Shopify theme rebuild for Original Brands (originalbrands.nl) — multi-brand apparel + footwear retailer, migrating from a custom Drupal-ish CMS.

- **Store:** original-brands-dev.myshopify.com (storefront password: `original`)
- **Theme base:** Dawn (cloned fresh 2026-08-10, no upstream git history)
- **Product data source:** will be Akeneo (not yet connected — no products in the dev store yet)
- **Reference project:** `C:\Users\rezni\SHOPIFY\SweatyBetty` — same Dawn/Akeneo/OpenSpec stack, further along. Reuse its shipped patterns and lessons, not its SB-specific branding/hacks.

## Project Docs

Read these before any major decision:

- [MIXED-SHOPS-PLAYBOOK.md](MIXED-SHOPS-PLAYBOOK.md) — every scoping decision for Original Brands: reuse ledger against SB's shipped specs, live-site audit, homepage direction, Akeneo→Shopify product-model decision. Read this first, always.
- `openspec/specs/` — capability specs, seeded on-touch as work starts (empty until the first change is proposed/archived)
- `mockup/` — the pre-Shopify static homepage mockup, reference only, not the live theme

## Shopify CLI

```
shopify theme dev --store=original-brands-dev.myshopify.com --store-password=original
```

Non-interactive shells (agent sessions) need `--store-password` explicit — the CLI can't prompt for it. See project memory `shopify-cli-windows-ops` for more CLI/Windows gotchas (port conflicts, `--force` on mutating commands).

## Centralized `ob-*` snippets

Akeneo/metafield interpretation lives in these, never inline in a template (mirrors SB's `sb-*` convention; enforced by the `akeneo-option-handling` spec):

- `ob-option-meta` — option kind from the bracketed Akeneo key (`[color]` → color, `[shoe_size_eu]` → size). Never branch on a visible/translated label.
- `ob-media-color-code` — a media/image filename's Akeneo color code. **Codes can span multiple segments** (`192_953`); don't port SB's single-segment version.
- `ob-card-swatches` — PLP card swatch row (chips, tooltips, hover swap + hover-pair data).
- `ob-swatch-input` — one PDP color chip (image swatch from the variant's own photo).
- `ob-facet-color-chip` / `ob-facet-swatch-input` — color *filter* chip: flat hex from the `filtercolors` metaobject, deliberately not an image swatch.

Client behavior for the card swatches is in `assets/ob-card-swatches.js` (document-level delegation — Dawn replaces the grid wholesale on every facet change).

## Hard Rules

- **Spec-covered changes:** For any bug report or behavior-change request, run `openspec list --specs` first, before touching code — don't rely on recognizing the capability from how the request happens to be phrased. If the touched area matches a listed capability, read its spec before editing. If the change would alter a documented SHALL/MUST requirement (not just an unspecified implementation detail), route it through `/opsx:propose` → apply → archive instead of editing the code directly. Early on, `openspec/specs/` will mostly be empty — as capabilities get built (many by porting from SB's reuse ledger), seed a spec for each one rather than skipping this because "there's nothing there yet."
- **"Autopilot" workflow:** once intent is confirmed (via `/opsx:explore` + discussion), "autopilot" means running `/opsx:propose`/`/opsx:ff` → `/opsx:apply` unattended, then **stopping before `/opsx:archive`** to let the user review/correct the actual code — the archived spec should reflect the final corrected code, not a pre-review draft. Only archive after explicit approval. Only skip the pre-archive stop if the user explicitly says the autopilot run should include archive.
- **"Update the docs" (end of a task):** check whether the task changed behavior for anything in `openspec/specs/` — if so, sync that spec too (a quick `/opsx:propose` → apply → archive cycle for a real requirement change, a direct edit for wording-only fixes). Also check whether MIXED-SHOPS-PLAYBOOK.md needs a new decision recorded (architecture/scoping calls go there, not into Claude memory — it's committed and readable by Codex too, see AGENTS.md).

## Current Status (2026-08-11)

First real build landed. Akeneo sync is live with **7 test products across 4 brands** (FitFlop, Holster, Loewenweiss, Sweaty Betty) — treat this as pipeline test data, **not** the live assortment (the SB items are apparel examples, per owner).

Shipped and verified on the **Development theme `148994719853`** (`?preview_theme_id=148994719853`, storefront password `original`):
- PLP card colour swatches — img-swatch chips, tooltips, hover-persist image swap, colour-matched hover-pair second image
- PDP colour swatches (img-swatch chips)
- Colour filter (flat hex chips from `filtercolors`), plus Merk / Gender / Maat / Producttype / Prijs facets
- D1 card image tracks the first *available* variant

Six capabilities are seeded in `openspec/specs/`; the change is archived under `openspec/changes/archive/2026-08-11-port-akeneo-facets-swatches/`.

**Not yet done:** nothing is on the live/MAIN theme (still stock Dawn) — everything above is on the Development theme only. Homepage is untouched and still blocked on mockup approval + the red-vs-blue CTA decision. See "Next up" in MIXED-SHOPS-PLAYBOOK.md.

**Shopify CLI is authenticated on this machine** — use `shopify theme push --theme=148994719853 --only <files>`. Do *not* hand-encode files through Admin GraphQL `themeFilesUpsert`; that corrupted a file earlier in this project.
