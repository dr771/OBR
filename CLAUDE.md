# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository. Codex also works in this repo and reads `AGENTS.md`, which points back here — CLAUDE.md is the shared source of truth for both, not Claude-specific.

## Project Overview

Shopify theme rebuild for Original Brands (originalbrands.nl) — multi-brand apparel + footwear retailer, migrating from a custom Drupal-ish CMS.

- **Store:** original-brands-dev.myshopify.com (storefront password: `original`)
- **Theme base:** Dawn (cloned fresh 2026-08-10, no upstream git history)
- **Product data source:** Akeneo, synced by Nick (connected — see Current Status for what's in the store)
- **Reference project:** SweatyBetty — same Dawn/Akeneo/OpenSpec stack, further along. Sibling directory of this repo (`../SweatyBetty`). Reuse its shipped patterns and lessons, not its SB-specific branding/hacks.
- **Two machines:** this repo is worked on from **both** a macOS box (`~/Projects/OriginalBrands`) and a Windows box (`C:\Users\rezni\SHOPIFY\OriginalBrands`). Neither is "the old one". Prefer machine-neutral references in docs — `../SweatyBetty` resolves correctly on both, absolute paths don't. Pull before starting; the other machine may be ahead.

## Project Docs

Read these before any major decision:

- [MIXED-SHOPS-PLAYBOOK.md](MIXED-SHOPS-PLAYBOOK.md) — every scoping decision for Original Brands: reuse ledger against SB's shipped specs, live-site audit, homepage direction, Akeneo→Shopify product-model decision. Read this first, always.
- [MIGRATION-TO-LIVE.md](MIGRATION-TO-LIVE.md) — launch checklist for the dev→live **store-to-store** migration (two separate shops, per Nick's Akeneo setup).
- [NICK.md](NICK.md) — open Akeneo/sync data issues to raise with Nick. Don't re-report these as if new.
- `openspec/specs/` — capability specs, seeded on-touch as work starts (empty until the first change is proposed/archived)
- `mockup/` — the pre-Shopify static homepage mockup, reference only, not the live theme

## Shopify CLI

```
shopify theme dev --store=original-brands-dev.myshopify.com --store-password=original
```

Non-interactive shells (agent sessions) need `--store-password` explicit — the CLI can't prompt for it. See project memory `shopify-cli-windows-ops` for more CLI/Windows gotchas (port conflicts, `--force` on mutating commands).

## OpenSpec CLI

The Hard Rules below assume `openspec` is on PATH. The npm package is **`@fission-ai/openspec`** — *not* `openspec` (that name is an unrelated 2019 stub at v0.0.0, and `openspec-cli` / `@openspec/cli` don't exist). On a fresh machine:

```
npm install -g @fission-ai/openspec
openspec list --specs          # sanity check, run from the repo root
```

## Centralized `ob-*` snippets

Akeneo/metafield interpretation lives in these, never inline in a template (mirrors SB's `sb-*` convention; enforced by the `akeneo-option-handling` spec):

- `ob-option-meta` — option kind from the bracketed Akeneo key (`[color]` → color, `[shoe_size_eu]` → size). Never branch on a visible/translated label.
- `ob-variant-color-code` — a selected variant SKU's Akeneo color code, normalized for media matching (`192-953` in SKU → `192_953` in filenames).
- `ob-media-color-code` — a media/image filename's Akeneo color code. **Codes can span multiple segments** (`192_953`); don't port SB's single-segment version.
- `ob-card-swatches` — PLP card swatch row (chips, tooltips, hover swap + hover-pair data).
- `ob-swatch-input` — one PDP color chip (image swatch from the variant's own photo).
- `ob-facet-color-chip` / `ob-facet-swatch-input` — color *filter* chip: flat hex from the `filtercolors` metaobject, deliberately not an image swatch.
- `ob-plp-sort-options` — the four approved collection sort choices in fixed order, with a hidden selected fallback when Shopify's current/default sort is outside the whitelist. Search sorting deliberately stays native.

Client behavior for the card swatches is in `assets/ob-card-swatches.js` (document-level delegation — Dawn replaces the grid wholesale on every facet change). Collection load-more behavior is delegated from `assets/ob-plp.js`; facet loading feedback and corrective scroll clamping remain in Dawn's `assets/facets.js` response path.

## Hard Rules

- **Spec-covered changes:** For any bug report or behavior-change request, run `openspec list --specs` first, before touching code — don't rely on recognizing the capability from how the request happens to be phrased. If the touched area matches a listed capability, read its spec before editing. If the change would alter a documented SHALL/MUST requirement (not just an unspecified implementation detail), route it through `/opsx:propose` → apply → archive instead of editing the code directly. Early on, `openspec/specs/` will mostly be empty — as capabilities get built (many by porting from SB's reuse ledger), seed a spec for each one rather than skipping this because "there's nothing there yet."
- **"Autopilot" workflow:** once intent is confirmed (via `/opsx:explore` + discussion), "autopilot" means running `/opsx:propose`/`/opsx:ff` → `/opsx:apply` unattended, then **stopping before `/opsx:archive`** to let the user review/correct the actual code — the archived spec should reflect the final corrected code, not a pre-review draft. Only archive after explicit approval. Only skip the pre-archive stop if the user explicitly says the autopilot run should include archive.
- **Shop-side dependencies go in the migration checklist, immediately.** This project ships by migrating to a *separate* live shop, so anything a feature depends on that lives in the shop rather than in this repo — an app config, a metafield/metaobject definition, a storefront-access setting, an admin toggle — must be appended to [MIGRATION-TO-LIVE.md](MIGRATION-TO-LIVE.md) *when you discover it*, not at launch. If a feature only works because of something you clicked in the admin, that's a checklist line.
- **"Update the docs" (end of a task):** check whether the task changed behavior for anything in `openspec/specs/` — if so, sync that spec too (a quick `/opsx:propose` → apply → archive cycle for a real requirement change, a direct edit for wording-only fixes). Also check whether MIXED-SHOPS-PLAYBOOK.md needs a new decision recorded (architecture/scoping calls go there, not into Claude memory — it's committed and readable by Codex too, see AGENTS.md).

## Current Status (2026-08-11)

First real build landed. Akeneo sync is live with **7 test products across 4 brands** (FitFlop, Holster, Loewenweiss, Sweaty Betty) — treat this as pipeline test data, **not** the live assortment (the SB items are apparel examples, per owner).

Shipped and verified on this shop's **main Dawn theme `148245381229`** (storefront password `original`), and also present on the Development theme used during the build. Note: this whole *shop* is the dev environment and never goes public under the real domain — see "Next up" item 4 — so pushing here is not a release and needs no special care.
- PLP card colour swatches — non-navigating pressed-state buttons select in place, retarget the card's PDP link, persist the selected first image, and reveal that color's matched second shot only over the image area (`plp-card-swatch-selection`)
- PDP colour swatches (img-swatch chips)
- Colour filter (flat hex chips from `filtercolors`) presented as a five-column 2.8rem chip grid with hover/focus labels on desktop and a single horizontal chip row in the mobile filter bar; touch does not retain the tooltip.
- D1 card image tracks the first *available* variant
- **Size facet as a 4-column box grid** (`plp-size-facet-grid`), and the collection page switched to the **vertical** filter layout — it had been `horizontal`, under which Dawn does no show-more truncation at all
- **PDP size picker ordering** (`pdp-size-picker-order`) — EU shoe sizes render numerically, tops/bottoms render in semantic letter order, and raw Akeneo headings are replaced with `Maat`
- **PDP per-color media galleries** (`pdp-color-media-gallery`) — main gallery, mobile counter, and expanded modal show only the selected color's photography; verified with both single-segment and normalized multi-segment codes
- **PLP grid UX bundle** — 18-item pages with native “Toon meer” append behavior, immediate geometry-stable skeleton feedback, corrective-only scroll clamping, and four collection sort choices; search sorting stays native. Because the test assortment has only 7 products, load-more success/failure/reset was verified against a synthetic real section response and must be retested naturally once a collection exceeds 18 products.
- **PLP filter experience bundle** (`plp-filter-panel-chrome`, `plp-mobile-filter-bar`) — desktop vertical facets are open-by-default “Shop op …” accordions with compact value-only pills/reset links and a repeatable sticky summon control; mobile collection/search pages replace Dawn's drawer with a persistent Type/Maat/Kleur bar above the grid. The three rows filter instantly through Dawn AJAX, while active parameters for omitted filters are preserved and remain pill-removable.

Fifteen capabilities are seeded in `openspec/specs/`. Archived changes are under `openspec/changes/archive/2026-08-11-port-akeneo-facets-swatches/`, `.../2026-08-11-plp-size-facet-grid/`, `.../2026-08-11-pdp-size-picker-order/`, `.../2026-08-11-pdp-color-media-gallery/`, `.../2026-08-11-plp-card-swatch-selection/`, `.../2026-08-11-port-plp-grid-ux-bundle/`, `.../2026-08-11-plp-color-filter-grid/`, and `.../2026-08-11-port-plp-filter-experience/`.

**OpenSpec CLI:** `npm install -g @fission-ai/openspec` — the npm name `openspec` is an unrelated stub. See the OpenSpec CLI section above.

**Not yet done:** homepage is untouched, still blocked on mockup approval + the red-vs-blue CTA decision. See "Next up" in MIXED-SHOPS-PLAYBOOK.md.

**Theme workflow.** Shopify CLI is authenticated on this machine:
```
shopify theme push --theme=148245381229 --allow-live --only <files>   # main Dawn theme
```
Always push with `--only <changed files>` — a bare push would overwrite the theme's `settings_data.json`/templates from the local clone.

**Prefer the main theme over a CLI Development theme** — not for safety (nothing here is public) but because Development themes are ephemeral: Shopify removes them after ~7 days idle, and they're tied to the machine that created them (the existing one is named after the *Windows* box).

**Never hand-encode files through Admin GraphQL `themeFilesUpsert`** — that corrupted `card-product.liquid` earlier in this project. Use the CLI.
