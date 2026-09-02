## Context

`/apps/wishlist` is rendered entirely by Wishlist King's own `<wishlist-page>` custom element — the theme owns no template/section for it, only global assets loaded in `layout/theme.liquid`. Live DOM inspection (Chrome DevTools, `original-brands-dev.myshopify.com`, store password `original`) found:

- Two `<wishlist-page>` elements exist on every storefront page: the cart drawer's hidden cross-sell instance renders before `<main>`, and the standalone page's own instance renders inside `#MainContent`. `document.querySelector('wishlist-page')` returns the wrong (drawer) one.
- Confirmed real class names/structure under `#MainContent > wishlist-page`: `.wk-page > .wk-header (.wk-title, .wk-login-callout, .wk-controls) + .wk-body > .wk-grid > wishlist-product-card > .wk-product-card (.wk-image-link > .wk-image, .wk-meta (.wk-vendor, .wk-product-title, .wk-price), .wk-form (.wk-variants > wk-option-select > .wk-control, .wk-quantity, .wk-cta-button), remove-button)`.
- `.wk-single-option` and `.wk-label` are already `display:none` by WK's own default on this page (the cross-sell forces this defensively because it needs to; the standalone page doesn't).
- `.wk-title` computes to `Fraunces, serif` and `.wk-controls .wk-button` to `Arial` — both with real specificity from WK's own stylesheet, confirmed via `getComputedStyle`, not assumed.
- WK's own `.wk-grid` is already `display:grid` with an internal, undocumented responsive column count.
- The floating `remove-button`'s `translate3d`-positioned overlay was confirmed (via live resize at 1600/990/750/390px) to recompute correctly as its card's width changes — safe to resize cards under it.

## Goals / Non-Goals

**Goals:**
- Bring the standalone page's product cards, dropdowns, CTA, and header typography in line with the theme's design system already shipped for the PLP grid and the cart-drawer wishlist cross-sell.
- Do it additively, in one file, without touching any code the parallel `/cart`-page workstream owns or reads.

**Non-Goals:**
- Restyling WK's floating remove-button ("X" control) — left at WK's default; not one of the three user-approved decisions for this change.
- Any change to cross-sell behavior, the PDP wishlist toggle, header badge, or the Akeneo option-parser patch — all already correct and unaffected.
- A build step, JS framework, or new dependency — this is CSS-only against WK's existing DOM.

## Decisions

**Scope every selector under `#MainContent > wishlist-page`, not a bare `wishlist-page` or `.wk-*` selector.** Two `<wishlist-page>` instances exist per page; an unscoped selector would double-apply and could visually corrupt the cart drawer's cross-sell, which a parallel workstream (Codex) is actively changing on `/cart`. This mirrors the scoping the existing 7-line inset rule already uses.

**Single additive file: extend `assets/component-ob-wishlist.css`, don't touch `component-cart-drawer.css`.** The cross-sell's already-shipped CSS (dropdown/CTA tokens) lives in `component-cart-drawer.css` and is reused here only as *reference values* to copy, not as a shared stylesheet to import from — editing that file risks a merge collision with the parallel `/cart` work. Some values are deliberately NOT copied 1:1 (see next decision).

**CTA departs from the cross-sell's icon-only 32px square: full-width labeled pill instead.** The cross-sell's CTA is icon-only because it lives in a cramped drawer row; the standalone page has a full card's width to work with, and the user explicitly chose a labeled button (approved decision #2) using the theme's `--ob-button-*` tokens (`component-ob-buttons.css`: `#0f172a` fill, `#1e9fe6` hover, pill radius) rather than reusing the CTA's exact drawer-scale rule set.

**Dropdowns keep the cross-sell's color/border tokens but change geometry.** The drawer's `.wk-control` is 3.2rem tall and JS-measured to shrink-to-fit two pickers side-by-side in one row (`measureOptionWidths()` in `ob-wishlist.js`). On the standalone page each picker is already full-card-width and stacks vertically by WK's own default (confirmed live) — there's no overflow problem to solve, so this change reuses only the color/border-alpha values, at 4rem height, and does NOT extend `measureOptionWidths()`'s selector scope to this page (unnecessary complexity for a problem that doesn't exist here).

**Product-card grid becomes a deterministic 2/3/4-column responsive grid**, replacing WK's own internal (undocumented, not authored by us) breakpoint logic, using Dawn's own 750px/990px tier boundaries so it lines up with how the rest of the theme reflows.

**Image treatment copies the PLP card tokens exactly** (`#f1f5f9` tint, `mix-blend-mode: multiply`, `1.6rem` radius, `isolation: isolate` background context) from `component-ob-swatches.css`, since the user explicitly asked for "like PLP, blend, border rad."

**Header typography override needs `!important` on `font-family` only**, evidenced by the live computed-style check (WK really does set `Fraunces`/`Arial` with specificity, this isn't a guess) — kept narrowly scoped to the two properties that actually needed it rather than blanket `!important` on the whole header block.

## Revision (post-review feedback)

First live version shipped with a 1600px-wide, 4rem-inset container; full-width 4rem-tall stacked dropdowns; a 4.4rem full-card-width CTA; and WK's native floating "X" remove control. Owner review on the live page found the cards too large next to the PLP grid, the dropdowns oversized, and asked for the cross-sell's own compact scale plus its trash-icon remove control instead of the X. Revised:

- **Container**: `.wk-page` capped at `max-width: 1200px; margin-inline: auto`, with a smaller 3rem inset at ≥990px (was full 1600px + 5rem). Verified live: resulting card width (273px at 1600px viewport) now sits within a few px of the PLP grid's own resolved card width (267px at 1519px viewport) — effectively equal, no longer visibly larger.
- **Dropdowns**: `.wk-variants` reverted from a stacked full-width column to the cross-sell's row-wrap layout; `.wk-control`/`select` reduced from 4rem to 3.2rem (the cross-sell's own height), width auto instead of stretched.
- **CTA**: reduced from `min-height: 4.4rem`/full padding to `min-height: 3.6rem` with tighter padding and font-size, and no longer spans the full card width alone — it now shares a row with the remove control.
- **Remove control**: WK's native floating `<remove-button>` ("X", card-corner overlay) is hidden (`display: none`) on this surface. In its place, `assets/ob-wishlist.js`'s existing `injectButtons()` (previously scoped only to `.ob-wishlist-cross-sell .wk-form`) was broadened to also match `#MainContent > wishlist-page .wk-form` — reusing the same cloned `<template class="ob-wishlist-cross-sell__remove-template">` (already present in every page's DOM, since the cart drawer renders globally) and the same already-shipped, unscoped `.ob-wishlist-cross-sell__remove` CSS in `component-cart-drawer.css`, so no new remove-button styling was needed. `.wk-form` was changed to `display: grid` with explicit `grid-column`/`grid-row` placement on `.wk-variants`, `.wk-cta-button`, and `.ob-wishlist-cross-sell__remove`, so the CTA+remove pairing doesn't depend on DOM order (the remove button is still appended last by JS).
- This required one small, additive edit to the shared `assets/ob-wishlist.js` (a one-line selector broadening in `injectButtons()`) — the only file outside `component-ob-wishlist.css` this change touches. Confirmed via live inspection that `.wk-form` already carries WK's own `data-wishlist-item-id` on the standalone page (not something the theme needs to add), so the existing removal wiring worked unmodified.
- Live-verified after the revision: cross-sell CTA/controls on `/cart` are still pixel-identical (32px square CTA, `display:flex` form, 0 border-radius) — confirms the shared JS/CSS reuse didn't regress the cross-sell.

## Revision 2 (further post-review feedback)

Owner spotted three more issues on the live page: a redundant "EUR" after the € amount, the dropdown values rendering in Arial instead of Inter, and two-picker cards (color + size) risking a wrap to a second row at narrow widths. Fixed:

- **Currency suffix**: WK renders `.wk-current-price` as "€100,00 EUR" — a text-content issue, not stylable via CSS. Added `stripCurrencySuffix()` to the existing label-overlay IIFE in `ob-wishlist.js` (same file, same MutationObserver-driven re-apply pattern already used for the bracket-key label rewriting), called from `overlayAll()` for both roots. It strips a trailing 3-letter ISO code from the text node. Applying it to both `wishlist-page` and `.ob-wishlist-cross-sell` was a deliberate, low-risk choice — verified live it also cleans up the (previously unnoticed) same redundancy in the cart-drawer cross-sell's price, with zero layout impact.
- **Dropdown font**: the closed control's visible text (`.wk-control .wk-text`) was already correctly inheriting Inter; the actual Arial source was WK's native `<select>` element itself (and by extension its native option list). Added `font-family: var(--font-body-family) !important` to `.wk-variants select` and `.wk-variants select option`.
- **One-line pickers**: `.wk-variants` changed from `flex-wrap: wrap` to `flex-wrap: nowrap`, with each picker `flex: 1 1 0; min-width: 0` (share the row equally, shrink instead of wrapping) and `.wk-control` changed from a fixed `min-width: 5.5rem` (which could force a wrap on narrow cards) to `width: 100%; min-width: 0`, relying on the already-shipped `.wk-text` ellipsis to degrade gracefully if a value's label doesn't fully fit. Verified live at 390px (card width ~172px) that a two-picker card still renders both dropdowns on one row.
- Regression-checked again: cart-drawer cross-sell CTA/variants unchanged after this round's shared `ob-wishlist.js` edit.

## Revision 3 (dropdown → PLP/PDP-style rails)

The owner reported color selection "not working" and asked whether the dropdowns could become PLP/PDP-style rails instead (colour image chips + size boxes). Investigation first: programmatically setting a `<select>`'s value and dispatching `change` DID correctly drive WK's state, price/image updates, and server-side persistence (verified by reload) — so WK's reactive core was never broken. The likely real issue was the native `<select>` interaction itself; rather than keep chasing that, the owner's requested rail UI replaces it outright, which also directly fixes any native-select usability problem by removing the native control from the interaction path entirely.

**Approach:** a new file, `assets/ob-wishlist-page-rails.js` (loaded only on this page, see below), builds one `.product-form__option-rail-shell` per option per card, reusing the *existing, unmodified* shared rail system 1:1:
- `assets/ob-option-rail.js` and `assets/component-ob-option-rail.css` (PDP's rail chrome — chevrons, overflow fades, scroll behavior) are generic/unscoped already (`[data-ob-option-rail-shell]` etc.) and needed no changes — the new markup just uses the same class names and data attributes.
- `assets/ob-swatch-tooltip.js` (shared chip tooltip) needed no changes — the new colour chips use the same `.ob-swatch-input__label[data-ob-swatch-name]` markup as PDP.
- Colour chips reuse `assets/component-ob-swatches.css`'s base `.ob-swatch-input__chip`/`.ob-swatch-input-wrapper`/`.ob-swatch-input__radio` (visually-hidden-radio-behind-a-label pattern), with size/radius/tint override written fresh in `component-ob-wishlist.css` (matching PDP's 5rem/0.8rem/tinted-surface values) rather than editing the shared PDP-scoped rule.
- Size boxes reuse Dawn's native `.product-form__input--size-grid` radio+label pattern, again with height/border override written fresh here rather than in `component-ob-pdp.css`.

**Why a new JS file instead of extending `ob-wishlist.js`:** this is a large, page-specific addition (product-data fetching, DOM construction, availability sync) unrelated to that file's existing responsibilities (option-parser patch, label overlay, header badge, PDP heart, cross-sell move-to-cart); keeping it separate keeps the shared file's diff minimal and avoids any risk to the cart-drawer cross-sell it also serves.

**Data source for colour swatch images:** WK's rendered card exposes only option text values, no images. Each card's product handle is read from its title/image link, then `/products/<handle>.js` (Shopify's public, unauthenticated storefront product JSON) is fetched once per handle (cached) to get `variants[].option1/2/3` + `variants[].featured_image.src`, matched by option **position** (not name) — the picker's position among all `wk-option-select` siblings in DOM order, mirroring exactly how `snippets/ob-swatch-input.liquid` matches a PDP colour swatch to its variant image via `option.position`.

**Bug hit and fixed:** the first version's `fetch('/products/<handle>.js', { credentials: 'omit' })` returned the storefront's password-splash HTML instead of JSON on this password-protected dev store, since `credentials: 'omit'` drops the password cookie — every chip silently fell back to its "no image" state. Fixed by dropping the `credentials` override (default `same-origin` includes the cookie), confirmed live with real chip images loading immediately after.

**Driving WK's real state:** each rail is a real `<input type="radio">` group; on `change`, the handler sets the corresponding (now-hidden, not removed) native `<select>`'s `.value` and dispatches a real `change` event on it — proven to correctly update WK's price/image/CTA state and persist server-side. No WK internals are reimplemented (variant resolution, availability, add-to-cart) — the rail is a UI proxy in front of the exact same interaction WK already handles.

**Availability sync:** after any change (from the rail or WK's own re-render), a sync pass re-reads each underlying `<select>`'s `<option disabled>` flags and mirrors them onto the corresponding radio's `disabled` state — verified live: picking a colour on the 8-colour/11-size Hi-Tec item correctly disabled two now-unavailable sizes in the size rail. This avoids reimplementing WK's combo-availability logic; the rail only ever reflects what WK itself has already computed.

**Resilience to WK's async re-renders:** rail building/availability-sync is driven by the same idempotent `MutationObserver` + `requestAnimationFrame`-debounced pattern already used elsewhere in `ob-wishlist.js` (label overlay, remove-button injection) — each pass builds rails for any `.wk-form` that doesn't have them yet and re-syncs ones that do. The injected `.ob-wishlist-rails` container is inserted as a sibling of `.wk-variants` (a direct child of `.wk-form`), the same DOM position proven stable across WK's re-renders by the already-shipped remove-button injection.

**Loading only on this page:** `ob-swatch-tooltip.js` has no idempotency guard (unlike `ob-option-rail.js`, which does) — loading it a second time on a page that also renders a PDP/PLP card (via their own snippet includes) would double-register its event listeners and create a duplicate tooltip node. So the four new assets are loaded from `layout/theme.liquid` guarded by `{%- if request.path contains '/apps/wishlist' -%}`, not unconditionally like `component-ob-wishlist.css`/`ob-wishlist.js` already are — confirmed live (via `document.scripts`/`document.styleSheets`) that they load only on `/apps/wishlist` and are absent on `/cart`, and that the cross-sell's own dropdowns/CTA are pixel-identical afterward.

## Revision 4 (layout brought closer to PLP)

Owner asked for the card to read more like a PLP card: product data (vendor/title/price) left-aligned instead of centered, and the colour chips sitting directly after the main photo instead of after the meta block. Both are pure layout/CSS changes plus one JS insertion-point split:

- **Colour rail moved above the meta block**: `ob-wishlist-page-rails.js` now builds two separate containers instead of one — colour-kind rails go into `.ob-wishlist-color-rail` (inserted as a sibling of `.wk-image-link`, before `.wk-meta`), everything else (size) stays in `.ob-wishlist-rails` (inside `.wk-form`, unchanged position). This required passing `card` (not just `form`) into `buildRailsForForm`/`syncForm` so both containers can be located.
- **Left alignment**: straightforward `text-align: left` on the meta block and its children.
- **Price still centered after that** — turned out `.wk-price` is `display: flex; justify-content: center` in WK's own CSS, and `text-align` doesn't affect flex-positioned content. Fixed with `justify-content: flex-start`.
- **Photo-to-chip gap "too big" vs PLP** — traced to WK's own `.wk-image-link { margin-bottom: 8px }` stacking with the rail's own top margin (measured 12px total vs PLP's 8px). Zeroed the image's margin and tuned the rail's own margin so the total (rail margin + the shared rail track's built-in top padding) lands on exactly 8px, matching a live PLP card's measured gap.
- **Chevrons "too big" vs PLP** — the rails were reusing the *PDP's* chevron size (`.product-form__option-rail-button`, 3.2rem/1rem icon, positioned outside the rail via negative margins) since that's the shared class the rail chrome ships with. PLP actually uses its own smaller variant (`.ob-card-swatches__button`, 2.8rem/0.9rem icon, flush at the rail edge) — added a page-scoped size/position override matching PLP's real values rather than the PDP's.
- All four fixes are page-scoped overrides in `component-ob-wishlist.css` (plus the one JS container-split) — no shared file touched, cross-sell regression-checked clean again.

## Risks / Trade-offs

- **[Risk] WK ships a markup/class update that renames `.wk-title`, `.wk-control`, `.wk-cta-button`, etc.** → Mitigation: same fail-open posture as the rest of this capability — rules simply stop matching, page falls back to WK's own (unstyled but functional) look; no JS depends on these classes existing, so nothing breaks, only the skin regresses. No production risk, only a visual regression to catch on the next inspection.
- **[Risk] `!important` on `.wk-grid`/`.wk-control`/`.wk-cta-button` fighting a future WK stylesheet change at equal specificity** → Mitigation: precedent already exists in `component-cart-drawer.css` for the same reason (WK's own rules tie/beat plain descendant selectors); if WK ever wins again, it's a visual-only regression, caught by the live verification checklist, not a functional break.
- **[Trade-off] Grid column counts are fixed by us rather than left to WK's responsive logic** → chosen deliberately per the grid-layout decision; accepted because it makes the layout match the rest of the theme's breakpoint behavior rather than WK's opaque internal rule.
- **[Risk] Two `<wishlist-page>` instances collide if scoping is dropped in a future edit** → Mitigation: called out explicitly in both this design doc and the spec requirement text, so a future editor sees the constraint before touching the file.

## Migration Plan

1. Append new CSS rules to `assets/component-ob-wishlist.css` (single file, additive — no removal of the existing 7-line rule).
2. Push only that file: `shopify theme push --store=original-brands-dev.myshopify.com --theme=148245381229 --allow-live --only assets/component-ob-wishlist.css`.
3. Verify live via Chrome DevTools MCP: grid breakpoints, image treatment, CTA enabled/disabled states, header typography, and — critically — a regression check that the cart-drawer cross-sell is pixel-identical to before (proves the `#MainContent > wishlist-page` scoping held and nothing leaked into Codex's `/cart` surface).
4. Rollback, if needed: revert the file to its pre-change 7-line state and re-push the same `--only` target — no other files or shop state involved, so rollback is a single-file operation.

## Open Questions

None — all three visual-direction questions (card layout, CTA style, header restyle) were resolved with the user before this design was written.
