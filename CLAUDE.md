# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository. Codex also works in this repo and reads `AGENTS.md`, which points back here — CLAUDE.md is the shared source of truth for both, not Claude-specific.

## Project Overview

Shopify theme rebuild for Original Brands (originalbrands.nl) — multi-brand apparel + footwear retailer, migrating from a custom Drupal-ish CMS.

- **Store:** original-brands-dev.myshopify.com (storefront password: `original`)
- **Theme base:** Dawn (cloned fresh 2026-08-10, no upstream git history)
- **Product data source:** Akeneo, synced by Nick (connected — see STATUS-LOG.md for what's in the store)
- **Reference project:** SweatyBetty — same Dawn/Akeneo/OpenSpec stack, further along. Sibling directory of this repo (`../SweatyBetty`). Reuse its shipped patterns and lessons, not its SB-specific branding/hacks.
- **Two machines:** this repo is worked on from **both** a macOS box (`~/Projects/OriginalBrands`) and a Windows box (`C:\Users\rezni\SHOPIFY\OriginalBrands`). Neither is "the old one". Prefer machine-neutral references in docs — `../SweatyBetty` resolves correctly on both, absolute paths don't. Pull before starting; the other machine may be ahead.

## Project Docs

Read these before any major decision:

- [MIXED-SHOPS-PLAYBOOK.md](MIXED-SHOPS-PLAYBOOK.md) — every scoping decision for Original Brands: reuse ledger against SB's shipped specs, live-site audit, homepage direction, Akeneo→Shopify product-model decision. Read this first, always.
- [MIGRATION-TO-LIVE.md](MIGRATION-TO-LIVE.md) — launch checklist for the dev→live **store-to-store** migration (two separate shops, per Nick's Akeneo setup).
- [SEO-REDIRECTS.md](SEO-REDIRECTS.md) — redirect map from the old Drupal site: state, decisions, tooling (`scripts/build-redirects.js`), and the to-do lists for now, at launch and after launch. [BLOG.md](BLOG.md) holds the blog URL structure and the posts to recreate.
- [NICK.md](NICK.md) — open Akeneo/sync data issues to raise with Nick. Don't re-report these as if new.
- [POST-SYNC-CHECK.md](POST-SYNC-CHECK.md) — run after every Akeneo sync. The four things that break silently (stale filter index, orphaned metaobject fields, DRAFT metaobjects, out-of-vocabulary category values), each with how to measure and fix it.
- [cats-dev.csv](cats-dev.csv) — the Akeneo **dev** category vocabulary (code;label-nl_NL). The reference the shop's category values are checked against. Akeneo live differs.
- [CI-STYLE-TOKENS.md](CI-STYLE-TOKENS.md) — reusable cross-component design tokens (ink/accent colors, button component, link conventions, dense-UI heading rules, the cart-drawer font-family gotcha). Check before re-deriving typography/color values a new component needs — extracted from PDP/footer/PLP/cart-drawer work already shipped, not a spec.
- [GOTCHAS.md](GOTCHAS.md) — traps and debugging techniques (Dawn overrides, Liquid/metaobject failures, the filter index, Wishlist King, Shopify CLI, browser). Read the relevant section before debugging; new findings go there.
- `.agents/skills/ob-collection-maintenance/SKILL.md` — procedure for the three vendor-based needs collections when the brand roster changes. Codex loads it as a skill; follow it the same way.
- `openspec/specs/` — capability specs, seeded on-touch as work starts (empty until the first change is proposed/archived)
- `mockup/` — the pre-Shopify static homepage mockup, reference only, not the live theme

## Shopify CLI

**Direct-active-theme workflow — hard rule.** This dev shop's active main Dawn theme
`148245381229` is the working surface agents must edit, push to, and verify against.
In this project, “live” means that active theme on
`original-brands-dev.myshopify.com`, even though the shop itself is the non-public dev
shop. Push each requested theme-code change directly to that theme with an explicit
`--only` list, then verify the real storefront URL in Chrome.

```
shopify theme push --store=original-brands-dev.myshopify.com --theme=148245381229 --allow-live --only <file>
```

**When any pushed file is under `templates/*.json`, use `scripts/theme-push.sh <file> [<file> ...]` instead of the raw command above.** It pulls each JSON template fresh and checks live changes against `HEAD`, allowing intentional local edits while aborting on overlapping live edits. Reconcile any live-only Admin settings into the local JSON before running it; the wrapper detects conflicts but does not merge settings automatically. This exists because `templates/*.json` is merchant-editable state that can be changed live in the Admin theme editor without ever being committed — a push built on a stale local copy silently reverts those live-only settings with a clean `git status` and no warning (it happened for real on 2026-09-03, commit `cdc6c7c`: a push meant to touch only `templates/collection.json`'s banner section also reverted its live `products_per_page`/`show_vendor`/`image_ratio` back to Dawn's defaults). For non-JSON files (Liquid/CSS/JS/assets) the raw command above is fine — they carry no live-only Admin state.

Do **not** use `shopify theme dev`, localhost, a preview theme, or a CLI Development
theme as the normal implementation/verification loop. Their settings and assets can be
out of sync with the active theme and therefore give false results. Only use one when the
owner explicitly requests a separate preview; stop it afterward, never report it as live
verification, and still make the approved change on theme `148245381229`.

**Store-identity gate for admin writes.** Before every Shopify Admin API mutation, retrieve the connected shop and proceed only when it is **Original Brands DEV** with the exact domain `original-brands-dev.myshopify.com`. This protects the shared connector from an accidental shop switch while keeping collection, navigation, metafield, and other shop-data work in the Admin API.

**Page-body writes via API — the agent clears the editor cache, not the owner.** The Admin page editor initialises from its IndexedDB `apollo-caches`, not from the server, so after a `pageUpdate` it can show the *old* body even after a hard reload — and the owner's next Save silently reverts the API change (happened 2026-09-30 on the FAQ). So, as part of every task that writes a page body via API, before reporting done: (1) re-read the body via API right before writing, in case the owner edited it in Admin; (2) after writing, on an `admin.shopify.com` tab in the owner's Chrome run `indexedDB.deleteDatabase('apollo-caches')`, reload the page's editor, and confirm it shows the new content; (3) tell the owner in one line that any *other* browser/machine where that page's editor was opened (e.g. the other machine) still needs a reload after clearing the same cache — the agent can only clear the Chrome it controls. Never ask the owner to remember this unprompted.

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
- `ob-card-swatches` — PLP card swatch row: a single-row chip rail (hover swap + hover-pair data), with `ob-option-rail-controls` for its chevrons.
- `ob-option-rail-controls` — the previous/next chevrons for any single-row rail (PDP option pickers, PLP card chips); `class_root` picks which surface's styling they take.
- `ob-swatch-input` — one PDP color chip (image swatch from the variant's own photo).
- `ob-facet-color-chip` / `ob-facet-swatch-input` — color *filter* chip: flat hex from the `filtercolors` metaobject, deliberately not an image swatch.
- `ob-plp-sort-options` — the four approved collection sort choices in fixed order, with a hidden selected fallback when Shopify's current/default sort is outside the whitelist. Search sorting deliberately stays native.

Client behavior for the card swatches is in `assets/ob-card-swatches.js` (document-level delegation — Dawn replaces the grid wholesale on every facet change). Two files are shared by the PLP and PDP rather than per-capability: `assets/ob-option-rail.js` (rail overflow cues + chevron scrolling, for any `[data-ob-option-rail]` inside a `[data-ob-option-rail-shell]`) and `assets/ob-swatch-tooltip.js` (the one fixed-position chip tooltip both surfaces need, since a rail's scroll track clips a chip-anchored CSS tooltip). Collection load-more behavior is delegated from `assets/ob-plp.js`; facet loading feedback and corrective scroll clamping remain in Dawn's `assets/facets.js` response path.

## Hard Rules

- **No automated design/AI audit tools.** Do not run any automated design/AI audit against a reference (or anything else in this project) — the user does not want that tooling's recommendations in the loop right now. For a requested visual match, measure the named element directly instead.
- **Spec-covered changes:** For any bug report or behavior-change request, run `openspec list --specs` first, before touching code — don't rely on recognizing the capability from how the request happens to be phrased. If the touched area matches a listed capability, read its spec before editing. If the change would alter a documented SHALL/MUST requirement (not just an unspecified implementation detail), route it through `/opsx:propose` → apply → archive instead of editing the code directly.
- **Specs describe behavior, never appearance.** This is the altitude rule, and it decides whether a task needs a spec at all — apply it without asking when the answer is clear, and when the owner asks "spec for this or not?", answer *from this rule*, not from how big the task feels.
  - **Spec it** when the thing has an invariant that can break *silently*: data contracts (a metafield/metaobject key, an Akeneo option-key convention), fallback and resolution chains, cross-surface guarantees, integration behavior with an app or with Dawn's own JS, anything where a wrong result looks fine on screen. These are expensive to rediscover and dangerous to undo — that is what a SHALL is for.
  - **Don't spec it** when the thing is taste: hex values, `letter-spacing`, px/rem measurements, breakpoints, spacing, hover choreography, which photo a section uses. Those change on every design pass, and a normative spec turns each of them into a ceremony. Record them in [CI-STYLE-TOKENS.md](CI-STYLE-TOKENS.md) (descriptive, not normative) and in [STATUS-LOG.md](STATUS-LOG.md), then edit the code directly.
  - **Why this exists:** on 2026-09-18 a `homepage-sections` scenario had pinned the marquee background to `#edf7fd`. Changing one background color therefore required a whole second OpenSpec change (`unify-light-surface-tint`) on top of the actual work. The same spec also *required* keeping a dead, disabled section in the theme, so deleting two unreferenced files needed a formal capability modification. The project is pre-customer-feedback and design is still moving; pixel promises rot on contact with the next review. The durable value has consistently come from the narrative in Current Status (the traps: Dawn's `div:empty`, the `isolate` z-index, the shipping-zone/market mismatch), not from measured values frozen into SHALLs.
  - **Existing specs that already pin appearance are not to be mass-rewritten** — leave them until the code they describe is touched anyway, then drop the measured value from the requirement as part of that change rather than restating it.
- **Theme settings are protected deployment state.** `.shopifyignore` excludes `config/settings_data.json`, so normal `theme push`, `theme pull`, and `theme dev` operations cannot overwrite merchant settings. Change settings in Shopify Admin. To record them in Git, pull `config/settings_data.json` from the intended theme into a temporary directory that has no `.shopifyignore`, review the diff, then copy only the reviewed live file into this repo and commit it. Never remove the ignore entry for an ordinary deployment. A deliberate settings migration to another shop/theme is a separate operation: resolve both theme IDs, pull and back up the target settings first, review the full source/target diff, and only then push the file from a temporary theme directory after explicit user approval.
- **One shared knowledge base.** Nothing about this project goes into a tool's private memory; AGENTS.md lists where each kind of fact goes. Claude's auto-memory is off for this repo (`.claude/settings.json`), and this overrides the global Auto-Memory rule in `~/.claude/CLAUDE.md`.
- **Theme check after Liquid edits.** Run `shopify theme check` before commit/push whenever a snippet, section or template changed, and grep the output for the touched files (background it for a full-theme run). Skip it for CSS/JS-only changes.
- **"Autopilot" workflow:** once intent is confirmed (via `/opsx:explore` + discussion), "autopilot" means running `/opsx:propose`/`/opsx:ff` → `/opsx:apply` unattended, then **stopping before `/opsx:archive`** to let the user review/correct the actual code — the archived spec should reflect the final corrected code, not a pre-review draft. Only archive after explicit approval. Only skip the pre-archive stop if the user explicitly says the autopilot run should include archive.
- **Shop-side dependencies go in the migration checklist, immediately.** This project ships by migrating to a *separate* live shop, so anything a feature depends on that lives in the shop rather than in this repo — an app config, a metafield/metaobject definition, a storefront-access setting, an admin toggle — must be appended to [MIGRATION-TO-LIVE.md](MIGRATION-TO-LIVE.md) *when you discover it*, not at launch. If a feature only works because of something you clicked in the admin, that's a checklist line.
- **"Update the docs" (end of a task):** check whether the task changed behavior for anything in `openspec/specs/` — if so, sync that spec too (a quick `/opsx:propose` → apply → archive cycle for a real requirement change, a direct edit for wording-only fixes). Also check whether MIXED-SHOPS-PLAYBOOK.md needs a new decision recorded (architecture/scoping calls go there, not into any tool's private memory — see AGENTS.md).

## Current Status

Chronik der gebauten Capabilities und der gefundenen Fallen: siehe [STATUS-LOG.md](STATUS-LOG.md).
Die Specs selbst liegen in `openspec/specs/`, archivierte Changes unter `openspec/changes/archive/`.

**Shop config gotcha — shipping zone vs. market mismatch (fixed 2026-08-11).** The dev shop's only shipping zone covered the US while its only configured Market is EU (BE/NL/DE/FR/LU) — no zone covered any country a real buyer could select, so *every* shippable product read as sold out (`available: false`, `/cart/add.js` 422) regardless of stock or inventory settings, store-wide. Fixed by adding a real "EU" shipping zone/rate to the default delivery profile. This is a Shopify default a fresh/copied shop can silently reintroduce — checklist item added to MIGRATION-TO-LIVE.md. API gotcha (`deliveryProfileUpdate` needs `locationGroupsToUpdate`, not `profileLocationGroups`, which silently no-ops).

**OpenSpec CLI:** `npm install -g @fission-ai/openspec` — the npm name `openspec` is an unrelated stub. See the OpenSpec CLI section above.

See "Next up" in MIXED-SHOPS-PLAYBOOK.md for what's still open.

**Theme workflow.** Shopify CLI is authenticated on this machine:
```
shopify theme push --theme=148245381229 --allow-live --only <files>   # main Dawn theme
```
Always push with `--only <changed files>`. `.shopifyignore` independently blocks `config/settings_data.json`, including when it is accidentally named in `--only`; do not remove that protection for a normal deploy. JSON templates remain merchant-editable state; use `scripts/theme-push.sh <file> [<file> ...]` whenever any pushed file is under `templates/*.json`. It checks changes against `HEAD`, permits intentional local edits when live has not changed those fields, and aborts on overlapping live edits. Reconcile live-only Admin settings into the local file before running it; the wrapper does not merge them automatically (see the Shopify CLI section above).

**Use the active main theme, not a CLI Development theme.** Development themes are both
out of workflow and unreliable here: they are ephemeral, machine-bound, and can carry
settings/assets that differ from the active theme. The active storefront is the source of
truth for every visual verification.

**Never hand-encode files through Admin GraphQL `themeFilesUpsert`** — that corrupted `card-product.liquid` earlier in this project. Use the CLI.
