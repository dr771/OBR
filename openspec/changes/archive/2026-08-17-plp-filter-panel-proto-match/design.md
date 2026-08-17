## Context

The desktop vertical filter panel (`snippets/facets.liquid`, `filter_type: 'vertical'` branch, shared by `templates/collection.json` and `templates/search.json`) currently diverges from the approved Bolt reference (`https://original-brands.bolt.host/#collection/outdoor-werk`, desktop) in five concrete ways, confirmed by reading both the live code and the proto's computed styles directly (per the `pixel-perfect-conversion` skill — no automated design-audit tooling was run, per this project's Hard Rule against it):

1. No "FILTER" heading renders in vertical mode — `plp-filter-panel-chrome`'s existing spec explicitly forbids one ("Desktop headings use centralized 'Shop by' copy" requirement: "The redundant top-level 'Filter:' heading SHALL NOT render").
2. The active-filter pill row renders at the top of the sidebar (`.active-facets.active-facets-desktop`, `snippets/facets.liquid` lines ~75-118), not in the main column under the sort bar like the proto.
3. Each accordion's chevron sits at the left edge (existing spec: "Facet carets are left-aligned filled triangles").
4. Per-facet "Opnieuw instellen" reset links and the price facet's "De hoogste prijs is €X,00" caption are visible (existing spec explicitly requires the reset link to show).
5. Accordion section vertical rhythm hasn't been checked against the proto.

Proto values were extracted via `getComputedStyle`/`getBoundingClientRect` on the live Bolt page (not estimated from the screenshot):
- FILTER heading wrapper: `flex items-center gap-2`, icon 16×16 (`lucide sliders-horizontal` — functionally identical to the theme's existing `assets/icon-filter.svg`, which is already a two-slider icon), label `text-xs font-semibold uppercase tracking-[0.18em]` (12px/600/2.16px tracking), color `rgb(30,159,230)`, `margin-bottom: 12px`.
- Active-filter pill (e.g. "FitFlop"): `rounded-full border border-ink/15 bg-white`, padding `6px 8px 6px 12px`, gap `6px`, `text-xs font-medium` (12px/500), color `rgb(15,23,42)` (full ink).
- "ACTIEF" kicker: `text-xs font-semibold uppercase tracking-[0.16em] text-ink/40` (12px/600/1.92px tracking, 40%-ink — stays muted, unlike the pill values).
- Active-filter row wrapper: `flex flex-wrap items-center gap-2`, `margin-bottom: 24px`.
- "Wis alles": `text-xs font-medium text-ink/50 underline` (12px/500, 50%-ink).
- Accordion header (`<summary>`, e.g. "Merk"): `flex items-center justify-between`, `text-sm font-semibold` (14px/600), chevron 16×16 at the row's right edge, `rgba(15,23,42,.5)`.
- Accordion section (`<details>`): `border-b border-ink/10 py-5` — 20px top+bottom padding, 1px 10%-ink bottom border, no additional margin between sections (confirmed: adjacent-section gap measures ~4px, which is just the border rendering).
- Sidebar column width: 230px — already matches OB's shipped `match-desktop-plp-spacing` value, no change needed there.

## Goals / Non-Goals

**Goals:**
- Desktop vertical filter panel chrome (heading, active-filter row placement/styling, chevron position, section rhythm, reset-link/max-price visibility) matches the proto's measured values.
- Existing scroll-based summon/relocate behavior (`plp-filter-panel-chrome`'s "desktop summon control" requirements) keeps working unmodified.
- Reset links and the max-price caption stay in the DOM (hidden via CSS only) so they can be re-enabled without re-adding markup.

**Non-Goals:**
- No changes to the product grid or card components.
- No changes to the checked/active-state color of in-panel controls (checkboxes, color-swatch selection rings) — they keep their current blue.
- No Klassiek/Inline density toggle or 3/4 grid-icon switcher — the proto has them, OB doesn't and isn't gaining them.
- No changes to the mobile filter bar (`plp-mobile-filter-bar`) — this proto view is desktop-only.
- Not adding a new brand blue token elsewhere in the theme — only the FILTER heading adopts the existing CTA blue for this change.

## Decisions

**Use the theme's existing `assets/icon-filter.svg` for the FILTER heading, not a new asset.** It already renders as a two-slider icon, which is what the proto's `lucide sliders-horizontal` icon is. Confirmed by reading the SVG source — no visual gap to close.

**Use the project's confirmed CTA blue (`#38B6FF`, settled 2026-08-16 per MIXED-SHOPS-PLAYBOOK.md) for the FILTER heading instead of the proto's raw `rgb(30,159,230)`.** The two colors are close but not identical; per `pixel-perfect-conversion`'s token-mapping guidance, an existing project-wide brand token wins over a proto's one-off raw value when they're clearly meant to be "the same blue." Alternative considered: match the proto's exact RGB — rejected because it would introduce a second, near-duplicate blue token store-wide for no visual benefit.

**FILTER heading becomes a panel-wide collapse/expand toggle (new behavior beyond the proto), implemented as a small script alongside the existing facet JS**, likely `assets/ob-filter-panel-toggle.js` per the `ob-*` convention (mirrors `ob-option-rail.js`, `ob-card-swatches.js`). Toggles a single wrapper around the accordion list; starts expanded (preserves the existing "facets render expanded by default" requirement). Kept independent from the already-shipped scroll-based summon/relocate control — that control activates on scroll position, this one is a manual click; they don't need to coordinate state, only avoid layout thrash if both are active at once (relocate logic reads the panel's current bounds each time, so a manually-collapsed panel is just a shorter panel from its point of view).

**Relocating the active-filter row requires moving markup across a template/section boundary, not just a CSS reposition.** The row is currently rendered inside `<aside id="main-collection-filters">` (via `snippets/facets.liquid`), while the target position — directly under the sort bar, above the product grid — is in the main content column rendered by `sections/main-collection-product-grid.liquid` (and equivalently `sections/main-search.liquid`). Two implementation options considered:
  - **(Chosen) Move the render call**: stop rendering the active-filters block from inside the vertical branch of `facets.liquid`'s sidebar, and instead render it (as a small partial, e.g. `render 'active-facets-desktop'`) from the section file, positioned between the narrowed sort bar and `#ProductGridContainer`. Keeps `facet-remove` custom-element wiring (used for AJAX filter removal) working since it's declared per-instance regardless of DOM position.
  - **(Rejected) CSS-only reposition** (e.g. `position: absolute` moved visually out of the sidebar): rejected — fragile across breakpoints/scroll, and the sidebar's own `<aside>` sizing/summon-control math (which measures the aside's bounding box) would have to explicitly exclude the relocated content anyway, so the complexity is comparable to just moving the render call, without the fragility.

**Narrowing the sort/product-count bar to the grid column's width** means it can no longer sit before the `.facets-vertical` flex wrapper (its current position spans full page width by being outside that wrapper entirely). It moves inside the wrapper, in the grid column, above `#ProductGridContainer` — sitting logically right next to where the active-filter row now renders. Both changes are contiguous edits to the same section file region.

**Reset link and max-price caption: hide via a CSS class, not a Liquid conditional.** Keeping the Liquid `{% if %}` render path untouched and adding a `.facets__reset` / `.facets__price-max` hiding rule (or a shared `.ob-hidden` utility, checking for an existing one first) is a one-line, trivially-reversible change versus editing the render condition, matching the explicit "keep it available if we use it ever" instruction.

## Risks / Trade-offs

- **[Risk] Moving the active-filter row out of `<aside>` could break the existing scroll-based summon/relocate JS, which measures the sidebar's bounding box to decide when to show the sticky summon button.** → Mitigation: the summon control's spec only concerns the accordion form itself ("summon control ... SHALL NOT render on mobile or on a non-vertical desktop filter layout"); verify its bounding-box math after the move and adjust the measured element if it was implicitly including the pill row before.
- **[Risk] The new panel-wide collapse toggle overlapping conceptually with the existing per-facet disclosures and the scroll-relocate control could confuse the accessibility tree (multiple nested toggle states).** → Mitigation: keep the collapse toggle's `aria-expanded` on the heading button, independent from each facet's own native `<details>`/`<summary>` semantics; test keyboard/tab order after implementation.
- **[Risk] Search results page (`main-search.liquid`) shares this exact code path — a bug here doubles.** → Mitigation: verify both `/collections/all` and `/search?q=...` after implementation, not just the collection page.

## Migration Plan

Implementation-only theme change (no data migration). Deploy via `shopify theme push --theme=148245381229 --allow-live --only <changed files>` per project convention, verify live on both collection and search pages at desktop width, then stop for owner review before archiving the spec (per the project's default autopilot workflow — review/correct code first, archive only after approval).

## Open Questions

None outstanding — placement, toggle behavior, and hide-vs-remove treatment were confirmed with the owner before this design was written.
