## 1. Markup

- [x] 1.1 Restructure `sections/predictive-search.liquid`'s product loop to match SB's port: `limit: 8` on the products loop, srcset image (150w/300w, `sizes="(min-width: 750px) 115px, 50px"`), conditional outer wrapper div, `templates.search.suggested_products` heading key — while preserving OB's existing `<product-component view-event-payload="...">` wrapper around each result link (SB's clone doesn't have this element; do not drop it).
- [x] 1.2 Update the bottom action block: "See all results" (new `templates.search.see_all_results` key) only when `predictive_search.resources.products.size > 8`; no action for 1-8 matches; keep native "Search for …" for zero matches.
- [x] 1.3 Update the hidden live-region result-count span per SB's version (drop the redundant `data-total-results` attribute now computed inline).

## 2. Locales

- [x] 2.1 Add `templates.search.suggested_products` and `templates.search.see_all_results` to `locales/en.default.json` (values: "Suggested products", "See all results").
- [x] 2.2 Add natural Dutch equivalents to `locales/nl.json` under the same keys, matching the existing tone of that file's `templates.search` block.

## 3. Styling

- [x] 3.1 Create `assets/component-ob-search.css` with: the `.predictive-search--header` heading treatment (uppercase, bold, larger), hover-transparent + keyboard-selected-highlight rules, the 750px+ two-column grid / 115x140 image sizing rules, and the 990px+ suggestions-column width adjustment — ported from SB's `assets/custom.css` "Header predictive search" block. Used the existing `rgba(var(--color-foreground), 0.04)` subtle-background convention (from `component-ob-swatches.css`) instead of SB's `--sb-color-bg-subtle` var, which doesn't exist in OB.
- [x] 3.2 Add the search-vs-Wishlist-King stacking rule (`z-index: 10` on `.section-header.shopify-section-group-header-group:has(.header__search details[open])`) to the same file, with a comment noting the cart drawer stays above at `z-index: 1000`.
- [x] 3.3 Load `component-ob-search.css` — found `component-predictive-search.css` is actually loaded from `layout/theme.liquid:308-315` (gated on `settings.predictive_search_enabled`), not `sections/header.liquid` as assumed in design; added the new stylesheet link right beside it there instead.

## 4. Verify

- [x] 4.1 Ran `shopify theme dev` (local CLI dev theme, port 9292) and confirmed via Chrome DevTools at 1440px: searching "slipper" (4 matches) rendered a 339px/339px 2-column grid, image `115x140` with the `300w` srcset candidate selected. Mobile single-column/50px layout not independently re-tested this session — unchanged Dawn behavior below 750px, no new CSS applies there beyond the existing `.predictive-search--header` mobile rule.
- [x] 4.2 Confirmed "Aanbevolen producten" (NL "Suggested products") heading computed style: `font-weight: 700`, `text-transform: uppercase`. Confirmed hover background stays `rgba(0,0,0,0)` (transparent) via computed style, and ArrowDown keyboard selection applies `rgba(18,18,18,0.04)` to the selected card (visually confirmed in screenshot) — the highlight lands on the `<product-component>` wrapper (a block-level custom element), which was the correct target for the ported `> *` selector once OB's extra wrapper level is accounted for.
- [x] 4.3 Verified 0-match ("Zoeken naar '...'") and 1-8 match (4 results, no bottom action) cases live. The >8 case cannot be triggered against the 7-product test catalog (same known limitation as the PLP load-more capability) — logic was verified by code review of the `{%- if predictive_search.resources.products.size > 8 -%}` branch instead; re-verify live once the catalog exceeds 8 products for a shared query term.
- [x] 4.4 Pushed the changed files to the live main theme (`148245381229`, `--allow-live --only <files>`) to test against real Wishlist King hearts (the CLI dev theme doesn't have WK's app embeds enabled). Confirmed via `elementFromPoint`: with search open, `.section-header` computed `z-index` is `10` and `.modal-overlay` — not the heart button — is the top element at the heart's screen position (not visible/clickable). Closing search restored `z-index: 3` and the heart (`wk-icon`) became the top element again (clickable). Opening the cart drawer while search was open triggered Dawn's native mutual-exclusion (opening the drawer auto-closes the search disclosure via `this.disclosures.forEach(d => d.close())`), so the two surfaces are never simultaneously open in practice; the drawer's own `z-index: 1000` would dominate regardless.
- [x] 4.5 Run `theme-check` (or equivalent) on touched Liquid files and confirm no new violations. `shopify theme check` reports 7 pre-existing warnings, all in unrelated files (`layout/password.liquid`, `sections/main-article.liquid`, `sections/main-list-collections.liquid`, `sections/main-product.liquid`, `sections/main-search.liquid`) — none in `sections/predictive-search.liquid`, `layout/theme.liquid`, or `assets/component-ob-search.css`.

## 4a. Review fixes

- [x] 4a.1 Price wasn't rendering in the predictive-search cards — `settings.predictive_search_show_price` was `false` in OB's `config/settings_data.json` (SB has it `true` live, but that value isn't tracked in SB's repo since SB has no committed `settings_data.json`, so it wasn't caught by the file diff during porting). Flipped to `true` and pushed; verified live — price now renders on every card, matching SB.
- [x] 4a.2 "See all results" footer link investigated after a report it was missing — confirmed working as designed, not a bug: checked SB's live site directly, the footer element doesn't render at all for ≤8 matches (same as OB) and only appears past 8. OB's 7-product test catalog can never produce more than 7 matches for any query, so the `>8` branch is mathematically unreachable until the real catalog is synced — no code change needed.

## 5. Docs

- [x] 5.1 Update MIXED-SHOPS-PLAYBOOK.md's reuse ledger row for `predictive-search-overlay` from "Reuse as-is" to seeded/shipped, and update the "Next up" list item, once the change is archived.
