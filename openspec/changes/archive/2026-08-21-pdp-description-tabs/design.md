## Context

`match-pdp-to-proto` already built and pixel-matched the `.ob-pdp .product__accordion` CSS in `assets/component-ob-pdp.css` for the reference's stack of detail accordions, but left it unwired beyond Dawn's native `collapsible_tab` block — description was still a plain `product__description rte` div, and `materials_maintenance` had no PDP presentation at all. See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Wire `product.description` and `custom.materials_maintenance` into the existing accordion shell with zero new CSS.
- Match Dawn's own `collapsible_tab` block markup shape so no styling divergence is possible.

**Non-Goals:**
- The reference's other two detail accordions ("Pasvorm & maatadvies", "Bezorging & retour") — no corresponding content/metafield exists yet; out of scope until it does.
- A true tab-switcher UI — the proto's own accordion behavior (independently click-to-expand rows, not a single-active-panel switcher) is what's being matched, not a different interaction model.

## Decisions

- **Reuse Dawn's `collapsible_tab` markup shape (`summary__title` + `icon-caret` + `accordion__content`) inline in the `description` block's case branch**, rather than introducing a new block type or a `sb-product-tabs`-style snippet. SweatyBetty's `sb-product-tabs.liquid` iterates a fixed list of `tab_*` metafields as a separate render call; this project only has one additional field (`materials_maintenance`) with a real value today, so a snippet abstraction would be premature — two accordions inline in the existing `description` case is simpler and keeps the "materials tab lives under description" relationship explicit rather than implied by render order.
- **Materials & maintenance content renders as-is** (no `newline_to_br`): the Akeneo-synced value already contains `<p>` HTML for most products; wrapping would double-break the ones that already carry markup.

## Verification note

The first pass reused `match-pdp-to-proto`'s accordion CSS unmodified, on the assumption it was already pixel-matched — it was written before real content existed to click open, and a computed-style re-measurement against the proto found two real deviations once real content rendered: the comma-listed `.summary__title, summary` padding rule doubled the row's vertical padding (83.5px real height vs. the proto's 52px), and the visible heading text (`.accordion__title`, an `h2.h4`) was inheriting Dawn's global heading rule (`Fraunces`/400/0.6px letter-spacing) instead of the proto's `Inter`/600/normal, because a rule scoped to `summary`/`.summary__title` never reaches an element that declares its own `font-family`/`font-weight`/`letter-spacing`. Fixed in `assets/component-ob-pdp.css`: padding now lives only on `summary`, and a new `.ob-pdp .product__accordion .accordion__title` rule explicitly overrides the inherited heading font to `var(--font-body-family)`/600/1.4rem/2rem/normal. Re-measured post-fix: heading font, row height (52px), and inter-row gap (4px) all match the proto exactly. Captured as a portable trap in `pixel-perfect-conversion/references/shopify-dawn.md`.

## Risks / Trade-offs

- [The omitted-accordion branch (blank `materials_maintenance`) has no live product to exercise it — all current sample products carry a value] → Same class of caveat already tracked in CLAUDE.md for other >N-item PDP/PLP branches; re-verify once a product without the metafield exists.
- [Inline duplication of the accordion markup between Dawn's `collapsible_tab` case and this `description` case] → Accepted per the "premature abstraction" call above; revisit if a third accordion source is added.
