# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository. Codex also works in this repo and reads `AGENTS.md`, which points back here — CLAUDE.md is the shared source of truth for both, not Claude-specific.

## Project Overview

Shopify theme for Original Brands (www.originalbrands.nl), a multi-brand apparel + footwear retailer. Migrated from a custom Drupal CMS; **live on Shopify since 2026-11-24**.

- **Live shop:** `original-brands-live.myshopify.com`, shop ID `109574717777`, permanent domain `original-brands-mtr6tuym.myshopify.com` (the one the CLI needs), storefront www.originalbrands.nl with real customers and orders. Owned by the client (Nick), Basic plan; Dr770.com works in it as collaborator. All theme and shop-data work happens here.
- **Test shop (DEV):** `original-brands-dev.myshopify.com` (storefront password: `original`). Staging for theme code, experiments and Akeneo-dev comparisons. Reached through the CLI, not the connector.
- **Theme base:** Dawn (cloned fresh 2026-08-10, no upstream git history)
- **OB team requests** come in through the Asana project "Original Brands" (`app.asana.com/1/1119997236281324/project/1216851099755483`); Cindy Joris (OB team) files most of them. Claude reads them through the claude.ai Asana connector (authorized 2026-11-24, as the owner's account): `get_tasks` with project `1216851099755483`, `get_task` (includes comments), and `get_attachments`. Screenshot attachments come with signed `download_url`s that `curl` fetches without auth. Codex doesn't have the connector, so it reads the task in the owner's open Asana tab in Chrome.
- **Product data source:** Akeneo live, synced by Nick's connector. Run POST-SYNC-CHECK.md after every sync.
- **Reference project:** SweatyBetty — same Dawn/Akeneo/OpenSpec stack, further along. Sibling directory of this repo (`../SweatyBetty`). Reuse its shipped patterns and lessons, not its SB-specific branding/hacks.
- **Two machines:** this repo is worked on from **both** a macOS box (`~/Projects/OriginalBrands`) and a Windows box (`C:\Users\rezni\SHOPIFY\OriginalBrands`). Neither is "the old one". Prefer machine-neutral references in docs — `../SweatyBetty` resolves correctly on both, absolute paths don't. Pull before starting; the other machine may be ahead.

## Project Docs

Read these before any major decision:

- [MIXED-SHOPS-PLAYBOOK.md](MIXED-SHOPS-PLAYBOOK.md) — the architecture and scoping decisions that still hold (data model, colour/size, listings, collections/navigation, campaigns, design direction, wishlist), each with its why. Read this first, always.
- [SHOP-SETUP.md](SHOP-SETUP.md) — everything the theme needs from the shop (definitions, Search & Discovery, theme settings, menus, shipping, apps), plus the open to-dos after launch and with Nick.
- [COLLECTIONS.md](COLLECTIONS.md) — live collection rules, breadcrumb ranks, main menu and the vendor baseline.
- [POST-SYNC-CHECK.md](POST-SYNC-CHECK.md) — run after every Akeneo sync. The five things that break silently (stale filter index, orphaned metaobject labels, `publishable` back on, new vendors, untracked inventory), each with how to measure and fix it.
- [SEO-REDIRECTS.md](SEO-REDIRECTS.md) — the legacy redirect map (rules, Shopify's redirect behaviour, `scripts/build-redirects.js`) and the blog structure.
- [DISCOUNTS.md](DISCOUNTS.md) — EN cheat sheet on the three discount kinds, the 5-step campaign setup, free shipping and the traps, for explaining it to marketing. [PROMOBAR.md](PROMOBAR.md) — how the team runs the promo and trust bars. [PLP-SORTING.md](PLP-SORTING.md) — the four sort choices and curating "Uitgelicht".
- [CI-STYLE-TOKENS.md](CI-STYLE-TOKENS.md) — reusable cross-component design tokens (ink/accent colors, button component, link conventions, dense-UI heading rules, the cart-drawer font-family gotcha). Check before re-deriving typography/color values a new component needs; descriptive, not a spec.
- [GOTCHAS.md](GOTCHAS.md) — traps and debugging techniques (Dawn overrides, Liquid/metaobject failures, the filter index, the wishlist, Shopify CLI, browser). Read the relevant section before debugging; new findings go there.
- **Everything written for Nick or the OB team is in English** (owner decisions 2026-11-06 for Nick, 2026-11-24 for the team): Asana messages, SHOP-SETUP.md entries, paste-ready texts. Shop copy shown to customers stays Dutch.
- [cats-dev.csv](cats-dev.csv) — the Akeneo **dev** category vocabulary (code;label-nl_NL), for DEV only; the live vocabulary is in COLLECTIONS.md.
- `content/collections/` — the collection bottom-description copy and the old site's texts it was written from.
- `.agents/skills/ob-collection-maintenance/SKILL.md` — procedure for the three vendor-based needs collections when the brand roster changes. Codex loads it as a skill; follow it the same way.
- `openspec/specs/` — capability specs (behavior contracts); archived changes in `openspec/changes/archive/`.
- `mockup/` — the pre-Shopify static homepage mockup, reference only, not the live theme

## Shopify CLI

**Direct-active-theme workflow — hard rule.** The live shop's active Dawn theme
`209721262417` is the working surface agents must edit, push to, and verify against;
it is the production storefront at www.originalbrands.nl. Push each requested theme-code
change to that theme (after DEV, below) with an explicit `--only` list, then verify the
real storefront URL in Chrome. Horizon
`209707532625` is a draft kept as rollback; never push to it.

```
scripts/theme-push.sh <file> [<file> ...]          # live theme 209721262417
scripts/theme-push.sh --dev <file> [<file> ...]    # DEV theme 148245381229
```

**Deploy route for theme code: DEV first, then live (owner decision 2026-10-30).** DEV (`--store=original-brands-dev.myshopify.com --theme=148245381229`, or `scripts/theme-push.sh --dev`) is the staging shop for features and bug fixes:
1. Reproduce on DEV, edit, push the changed files to DEV, verify on DEV's storefront (mobile and desktop as relevant).
2. Commit and push to git: the commit is what goes live, so DEV and live always receive the same files.
3. Push exactly those files to the live theme `209721262417`, then verify there: on the storefront where the page can show it, otherwise by pulling the file back and comparing it with the commit.

Only code travels this way. `config/settings_data.json`, theme-editor edits in `templates/*.json`, apps, products and menus are per shop and are never synced from DEV. Bugs that depend on live data are reproduced on the live shop directly. DEV's catalog is Akeneo **dev**, so it is not proof for data-dependent behavior.

**Every theme push goes through `scripts/theme-push.sh`, for every file type.** The OB team edits the frontend in the Admin since 2026-11 (theme editor → `templates/*.json` and `sections/*.json`, "Edit default theme content" → `locales/*.json`, code editor → any file). A raw push of a stale local copy silently reverts those edits with a clean `git status` (happened 2026-09-03, commit `cdc6c7c`, and was caught on 2026-11-05 for the Merken subheading and the header group). A Claude hook (`.claude/settings.json` → `scripts/hooks/guard-theme-push.js`) blocks the raw `shopify theme push`; Codex has no hook and must follow this rule by hand. What the wrapper does:
- The live theme only takes committed files.
- It pulls every named file fresh in one call; a failed pull aborts.
- `scripts/check-theme-drift.py` compares each file with the shop's ledger `assets/ob-theme-push-ledger.json`, which holds a hash of every file as the wrapper last pushed it. Each shop has its own ledger, and both machines read the same one. An unchanged hash means no Admin edit.
- An Admin edit to a JSON file is merged three-way into the local file. The script stops with exit 3: review `git diff`, commit, re-run. The same setting changed on both sides, or an edited Liquid/CSS/JS file, aborts with a diff.
- After the push it pulls the files again and updates the ledger.
- Files with no ledger entry yet (pushed before 2026-11-05) fall back to Git history. A shop copy equal to a committed version is safe. Otherwise an Admin edit and a shop that is simply behind look the same, so the script lists every difference and needs `--confirm <file>` once. Read the list before confirming: anything in it that you didn't change is a team edit, so merge it into the file first.

Do **not** use `shopify theme dev`, localhost, a preview theme, or a CLI Development
theme as the normal implementation/verification loop. Their settings and assets can be
out of sync with the active theme and therefore give false results. Only use one when the
owner explicitly requests a separate preview; stop it afterward, never report it as live
verification, and still make the approved change on theme `209721262417`.

**Storefront testing on the live shop is unrestricted (owner decision 2026-11-07).** Click through real flows on the storefront in the owner's Chrome: add to cart, fill and empty the wishlist, change options. The owner's carts, wishlists and other browser state there are throwaway test data; no need to back them up, restore them, or avoid them. This covers storefront clicks only, not Admin writes or orders.

**Store-identity gate for admin writes.** Before every Shopify Admin API mutation, read the shop and proceed only when it is **Original Brands** with the exact domain `original-brands-live.myshopify.com` and shop ID `109574717777`. The claude.ai Shopify connector is pointed at this shop (owner decision 2026-10-30). The CLI (`shopify store execute --store original-brands-mtr6tuym.myshopify.com`) works too, and must use the permanent domain because the CLI rejects the primary one.

**DEV writes are the exception.** Admin writes to DEV (`original-brands-dev.myshopify.com`, shop ID `72440086637`) only happen when the owner asks for an experiment there, and only through the CLI with `--store original-brands-dev.myshopify.com`, so the shop is explicit in the command. Never switch the shared connector to DEV for that. A write that lands on the other shop than the task intends is a stop condition.

**Limits on live-shop writes.** It is production: no product/catalog deletion, no theme publishing, no domain/DNS change without the owner's explicit go-ahead. Akeneo-managed schema (product/variant metafield definitions, `filtercolors`/`activities` metaobjects) is created by Nick's Akeneo connector, not by us. Owner-only settings (business entity, payments, billing, plan) are Nick's.

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
- `ob-offered-colors` — the colors a surface offers: those with an available variant in any size, plus the current one; blank (all) for a fully sold-out product. Used by the card rail, the PDP picker and the wishlist item. Never Dawn's `value.available` for this (it depends on the selected size).
- `ob-option-rail-controls` — the previous/next chevrons for any single-row rail (PDP option pickers, PLP card chips); `class_root` picks which surface's styling they take.
- `ob-swatch-input` — one PDP color chip (image swatch from the variant's own photo).
- `ob-facet-color-chip` / `ob-facet-swatch-input` — color *filter* chip: flat hex from the `filtercolors` metaobject, deliberately not an image swatch.
- `ob-plp-sort-options` — the four approved collection sort choices in fixed order, with a hidden selected fallback when Shopify's current/default sort is outside the whitelist. Search sorting deliberately stays native.

Client behavior for the card swatches is in `assets/ob-card-swatches.js` (document-level delegation — Dawn replaces the grid wholesale on every facet change). Two files are shared by the PLP and PDP rather than per-capability: `assets/ob-option-rail.js` (rail overflow cues + chevron scrolling, for any `[data-ob-option-rail]` inside a `[data-ob-option-rail-shell]`) and `assets/ob-swatch-tooltip.js` (the one fixed-position chip tooltip both surfaces need, since a rail's scroll track clips a chip-anchored CSS tooltip). Collection load-more behavior is delegated from `assets/ob-plp.js`; facet loading feedback and corrective scroll clamping remain in Dawn's `assets/facets.js` response path.

Wishlist (theme-native since 2026-11-06, Wishlist King uninstalled): `assets/ob-wishlist-store.js` (the list in `localStorage` `ob-wishlist`, API `window.obWishlist`, header badge, card hearts, PDP button) and `assets/ob-wishlist-items.js` (favorites page `/pages/favorieten` and cart cross-sell rows, each rendered by `snippets/ob-wishlist-item.liquid` through the Section Rendering API). `obWishlistStartVariant` lives in `ob-size-memory.js`. `/apps/wishlist` redirects to the favorites page. Wishlist actions are published as analytics events (`obWishlistTrack`; team browsers opt out with `?ob_notrack=1`), and cart lines from the wishlist carry the hidden property `_wishlist`. Why: MIXED-SHOPS-PLAYBOOK.md, Wishlist.

Size choice lives in `assets/ob-size-memory.js` (every page, loaded before `ob-wishlist.js`): storefront size order (JS twin of `ob-option-value-order`), the shopper's remembered size per size key (localStorage `ob-size-memory`, real picks only), and the PDP start size. **PDP start-size priority:** (1) a variant linked from the cart or a wishlist stays; (2) a size the referring listing was filtered to; (3) the remembered size (same key, letter sizes also across keys); (4) the middle available size, never Dawn's first variant in Akeneo order. Wishlist entries (card heart, sizeless entries) use the same start size via `obWishlistStartVariant`, without step 1–2. Requirement: `wishlist-integration` "Wishlist entries start on a whole variant"; traps in GOTCHAS.md (Size preselects).

## Hard Rules

- **No automated design/AI audit tools.** Do not run any automated design/AI audit against a reference (or anything else in this project) — the user does not want that tooling's recommendations in the loop right now. For a requested visual match, measure the named element directly instead.
- **Spec-covered changes:** For any bug report or behavior-change request, run `openspec list --specs` first, before touching code — don't rely on recognizing the capability from how the request happens to be phrased. If the touched area matches a listed capability, read its spec before editing. If the change would alter a documented SHALL/MUST requirement (not just an unspecified implementation detail), route it through `/opsx:propose` → apply → archive instead of editing the code directly.
- **Specs describe behavior, never appearance.** This is the altitude rule, and it decides whether a task needs a spec at all — apply it without asking when the answer is clear, and when the owner asks "spec for this or not?", answer *from this rule*, not from how big the task feels.
  - **Spec it** when the thing has an invariant that can break *silently*: data contracts (a metafield/metaobject key, an Akeneo option-key convention), fallback and resolution chains, cross-surface guarantees, integration behavior with an app or with Dawn's own JS, anything where a wrong result looks fine on screen. These are expensive to rediscover and dangerous to undo — that is what a SHALL is for.
  - **Don't spec it** when the thing is taste: hex values, `letter-spacing`, px/rem measurements, breakpoints, spacing, hover choreography, which photo a section uses. Those change on every design pass, and a normative spec turns each of them into a ceremony. Record reusable ones in [CI-STYLE-TOKENS.md](CI-STYLE-TOKENS.md) (descriptive, not normative), then edit the code directly.
  - **Why this exists:** on 2026-09-18 a `homepage-sections` scenario had pinned the marquee background to `#edf7fd`. Changing one background color therefore required a whole second OpenSpec change (`unify-light-surface-tint`) on top of the actual work. The same spec also *required* keeping a dead, disabled section in the theme, so deleting two unreferenced files needed a formal capability modification. The project is pre-customer-feedback and design is still moving; pixel promises rot on contact with the next review. The durable value has consistently come from recorded traps (GOTCHAS.md: Dawn's `div:empty`, the `isolate` z-index, the shipping-zone/market mismatch), not from measured values frozen into SHALLs.
  - **Existing specs that already pin appearance are not to be mass-rewritten** — leave them until the code they describe is touched anyway, then drop the measured value from the requirement as part of that change rather than restating it.
- **Theme settings are protected deployment state.** `.shopifyignore` excludes `config/settings_data.json`, so normal `theme push`, `theme pull`, and `theme dev` operations cannot overwrite merchant settings. Change settings in Shopify Admin. To record them in Git, pull `config/settings_data.json` from the intended theme into a temporary directory that has no `.shopifyignore`, review the diff, then copy only the reviewed live file into this repo and commit it. Never remove the ignore entry for an ordinary deployment. A deliberate settings migration to another shop/theme is a separate operation: resolve both theme IDs, pull and back up the target settings first, review the full source/target diff, and only then push the file from a temporary theme directory after explicit user approval.
- **One shared knowledge base.** Nothing about this project goes into a tool's private memory; AGENTS.md lists where each kind of fact goes. Claude's auto-memory is off for this repo (`.claude/settings.json`), and this overrides the global Auto-Memory rule in `~/.claude/CLAUDE.md`.
- **Theme check after Liquid edits.** Run `shopify theme check` before commit/push whenever a snippet, section or template changed, and grep the output for the touched files (background it for a full-theme run). Skip it for CSS/JS-only changes.
- **"Autopilot" workflow:** once intent is confirmed (via `/opsx:explore` + discussion), "autopilot" means running `/opsx:propose`/`/opsx:ff` → `/opsx:apply` unattended, then **stopping before `/opsx:archive`** to let the user review/correct the actual code — the archived spec should reflect the final corrected code, not a pre-review draft. Only archive after explicit approval. Only skip the pre-archive stop if the user explicitly says the autopilot run should include archive.
- **Shop-side dependencies go in SHOP-SETUP.md, immediately.** Anything a feature depends on that lives in the shop rather than in this repo — an app config, a metafield/metaobject definition, a storefront-access setting, an admin toggle — goes into [SHOP-SETUP.md](SHOP-SETUP.md) *when you set it up*. DEV and the live shop are separate shops: nothing configured in one exists in the other. If a feature only works because of something you clicked in the admin, that's a line there.
- **"Update the docs" (end of a task):** check whether the task changed behavior for anything in `openspec/specs/` — if so, sync that spec too (a quick `/opsx:propose` → apply → archive cycle for a real requirement change, a direct edit for wording-only fixes). Also check whether MIXED-SHOPS-PLAYBOOK.md needs a new decision recorded (architecture/scoping calls go there, not into any tool's private memory — see AGENTS.md).

## Current Status

**Live since 2026-11-24:** DNS switched to Shopify, storefront password off, 3,180 legacy redirects in place. What is still open after launch and with Nick: [SHOP-SETUP.md](SHOP-SETUP.md). Specs in `openspec/specs/`, archived changes in `openspec/changes/archive/`; no change is in flight.

**Use the active main theme, not a CLI Development theme.** Development themes are both
out of workflow and unreliable here: they are ephemeral, machine-bound, and can carry
settings/assets that differ from the active theme. The active storefront is the source of
truth for every visual verification.

**Never hand-encode files through Admin GraphQL `themeFilesUpsert`** — that corrupted `card-product.liquid` earlier in this project. Use the CLI.
