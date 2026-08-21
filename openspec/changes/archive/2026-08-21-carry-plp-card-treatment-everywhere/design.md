## Context

`assets/component-ob-swatches.css` has two layers: shared chip/rail rules scoped to `.ob-card-swatches`/`.ob-card-swatch` (already global — used by any card), and the finished visual treatment (lines ~383-560) scoped to `#ProductGridContainer .product-card-wrapper` — the surface tint, multiply blend, borderless/blended chips, surface-lightness selection cue, meta typography, and the Wishlist King floating-heart restyle. `#ProductGridContainer` only exists in `main-collection-product-grid.liquid` and `main-search.liquid`.

Confirmed during investigation (see proposal.md's Impact section for file list):
- `snippets/card-product.liquid` renders identical `card-wrapper product-card-wrapper` markup, including the `ob-brand ob-brand--<handle>` classes, regardless of caller (`sections/featured-collection.liquid:120,156`, `sections/related-products.liquid:41`, `sections/collage.liquid:96` all call the same snippet the same way).
- `assets/ob-card-swatches.js` and `assets/ob-option-rail.js` are already unscoped: delegation is `document.addEventListener(...)` or keyed on `[data-ob-option-rail-shell]`/`[data-ob-option-rail]` attributes, not on `#ProductGridContainer`. The one comment mentioning `#ProductGridContainer` in `ob-card-swatches.js` explains *why* delegation is document-level (Dawn replaces the grid wholesale on facet changes), it does not restrict delegation to that container.
- `assets/component-ob-brand-media.css` is already class-scoped (`.ob-brand ...`), not ID-scoped — no code change expected there, only live verification on the new surfaces.

So the only real gap is the CSS selector prefix in `component-ob-swatches.css`.

## Goals / Non-Goals

**Goals:**
- Every `card-product.liquid` render gets the identical finished visual treatment, regardless of section.
- Zero visual/behavioral change to the collection page or search results.

**Non-Goals:**
- Redesigning the card treatment itself (already settled and live-verified as of 2026-08-21).
- Touching facet loading-feedback, scroll-clamp, or grid-replacement behavior (`assets/facets.js`, `assets/ob-plp.js`) — those are unrelated capabilities that happen to also live under `#ProductGridContainer` in the DOM but are not part of this CSS block.
- Changing which sections exist or how they're configured in the theme editor.

## Decisions

**Replace `#ProductGridContainer .product-card-wrapper` with `.product-card-wrapper` (unscoped), rather than duplicating the block per surface.** The alternative — adding `#ProductGridContainer, .some-other-scope .product-card-wrapper` compound selectors, or a new opt-in class each section must add — would work but keeps a scope list that has to be remembered and extended for every future surface (e.g. a new merchandising section). Since the goal is literally "every surface, no exceptions," the unscoped selector is simpler and self-maintaining. If a future surface legitimately needs the *old* look, that becomes an explicit opt-out modifier class at that time, not a default-off allowlist.

**Do not touch the Wishlist King floating-heart rules' selector logic beyond the same prefix swap.** They're visually part of "the card," so they should follow the same scope-lift; no separate decision needed.

**Verify rather than rewrite the JS.** Investigation (Context above) shows the rail/swatch JS is already surface-agnostic. Task list treats JS as a verification/testing step, not an implementation step — if a real gap surfaces during testing (e.g. related-products' section-rendering API bypasses the JS's mutation observer/init path), fix it then rather than pre-emptively rewriting working code.

## Risks / Trade-offs

- **[Materialized during implementation] Dropping the `#ProductGridContainer` id silently dropped a specificity win, not just a scope.** The id gave the old selector `(1,2,0)` specificity, which beat Dawn's own `.card .card__inner .card__media { border-radius: ... }` `(0,3,0)` outright regardless of load order. The naive fix — swap the id prefix for `.product-card-wrapper` — only reaches `(0,2,0)`, so Dawn's rule won everywhere, including the collection grid itself: card photo corners rendered square (0px) instead of 1.6rem on both the new surfaces *and* the previously-working PLP grid. Caught via computed-style checks (`getComputedStyle(...).borderRadius`), not by eye — the loss is subtle at a glance. Fixed by bumping the wrapper selector to the compound `.card-wrapper.product-card-wrapper` everywhere (both classes are genuinely on the same element, so this is free, accurate specificity, not a hack) and, for the one rule that still needed more, matching Dawn's real ancestor chain with `.card-wrapper.product-card-wrapper .card__inner .card__media`. → Mitigation for future scope-lifts of this kind: after removing an id-scoped selector, diff computed styles (not just screenshots) against the pre-change state for every property the block sets, since specificity losses don't always produce a visually obvious diff.

- **[Risk] Removing the `#ProductGridContainer` prefix could pick up other, unrelated `.product-card-wrapper` renders this project doesn't know about yet** (e.g. a quick-add modal or upsell block using the same snippet in a context where the old look was actually relied on) → Mitigation: grep all `{% render 'card-product'` call sites before editing (already done for this design: featured-collection, related-products, collage, main-collection-product-grid, main-search — five sites, all of which should get the new treatment) and visually check each live surface after the change, not just the three named ones.
- **[Risk] Related-products loads asynchronously on the PDP; if its DOM insertion doesn't go through the same init path as a full page load, rails/tooltips could fail to initialize** → Mitigation: explicit test step for related-products specifically, since it's the one surface here with non-trivial rendering timing (the other two, featured-collection and collage, are server-rendered on page load like the PLP grid already is).
- **[Risk] Wishlist King's floating heart is currently only visually tuned for the collection grid's card size/aspect** → Mitigation: spot-check its position/size on featured-collection and related-products cards, which may render at different card widths than the PLP grid.

## Migration Plan

CSS-only change, pushed via `shopify theme push --only assets/component-ob-swatches.css`. No data migration, no rollback complexity beyond reverting the one file. Verify live on all five render sites before considering the change complete.
