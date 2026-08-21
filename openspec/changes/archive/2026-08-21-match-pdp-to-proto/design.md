## Context

See proposal.md — Why. Constraints that shape the approach:

- The PDP is stock Dawn apart from four already-shipped OB capabilities (`pdp-option-rails`, `pdp-size-picker-grid`, `pdp-color-swatches`, `pdp-color-media-gallery`) and the wishlist button. Those work and are live-verified; this change restyles them rather than replacing them.
- Every value in the specs was read off the proto with `getComputedStyle` at a 1440px viewport and is recorded in `.tmp-pdp/proto-metrics.json`. The proto is a Tailwind page, so its intent is legible from class names as well as computed values — both were captured.
- Dawn already ships the structural pieces the proto draws: the `thumbnail` gallery layout gives a media slider, a thumbnail rail, and a `slider-counter`; `component-accordion.css` gives collapsible panels. The work is mostly overriding Dawn's chrome, not building new mechanics.
- `templates/product.json` is merchant-editable state, and the live theme has already diverged from the repo copy (live is `thumbnail_slider`, repo says `stacked`).
- The theme's heading font is already Fraunces, but only its 400 face is loaded.

## Goals / Non-Goals

**Goals:**

- One new stylesheet owns every measured value, so a future reference change has one place to edit.
- Restyle the existing option rails and size grid in place — no rebuild of variant resolution, availability, or the Akeneo option plumbing.
- New furniture (breadcrumb, USP strip, size-guide trigger, badge) is merchant-configurable and fails open when its data is absent.
- The change is reversible at the stylesheet level without reverting Liquid.

**Non-Goals:**

- Changing the theme's `page_width` setting, colour scheme, or body font.
- Building the size-guide tables. Only the trigger and its placement ship now.
- Touching PLP, cart, or search surfaces. `component-ob-swatches.css` is shared with the PLP and is not edited here.
- Mobile-specific redesign beyond keeping the desktop work from breaking below the breakpoint.

## Decisions

**A new `assets/component-ob-pdp.css` rather than extending an existing OB stylesheet.**
`component-ob-swatches.css` is now deliberately scoped to a bare `.product-card-wrapper` so every card surface shares it (`carry-plp-card-treatment-everywhere`). Adding PDP rules there would put PDP-only values behind a selector family that the PLP also reads, which is exactly the coupling that change removed. `component-ob-option-rail.css` stays the rail's own file; PDP chip *sizing* overrides go in the new file. Alternative considered — one `custom.css` like SweatyBetty's — rejected because OB has deliberately kept per-capability stylesheets since the first port.

**Cap the PDP width in CSS on the section, not via the theme setting.**
The proto genuinely gives its PDP a narrower cap (`max-w-7xl`) than its PLP (`max-w-[1600px]`); this was verified in the proto rather than assumed. The theme's `page_width` is protected deployment state and is shared with every other template, so the cap is applied to the product section's own wrapper. Alternative — lowering `page_width` — rejected because it would silently narrow the PLP, which `plp-grid-config` already specifies at a 2.4rem inset.

**Keep the colour rail; restyle its chips.**
The proto's colour chips wrap rather than ride a rail, but the proto product has seven colours that happen to fit on one row, so it cannot show what its own design does on overflow. `pdp-option-rails` already specifies a rail with overflow cues and a documented rollback switch, and it is live-verified. Following the owner's ruling on the gallery chevrons — keep the live behaviour, take the proto's visuals — the rail stays and only chip geometry and borders change. The owner's "no `Meer kleuren`" instruction is read as removing the proto's static top-right label, not as removing the rail whose chevron carries that phrase as an accessible name.

**Relocate the thumbnail chevrons by moving Dawn's existing buttons, not by adding new ones.**
Dawn renders the thumbnail rail's prev/next buttons as siblings flanking the `ul`, and its main-gallery `.slider-buttons` row (counter plus its own pair) is hidden on desktop. The counter row is reused as the chevrons' new home and the thumbnail rail's own buttons move into it, so the `data-step` scrolling and `aria-controls` wiring survive untouched. Alternative — styling the main gallery's hidden pair into visibility instead — rejected because that pair steps the main image, which is not the behaviour the owner asked to keep.

**USP strip as a repeatable section block, not fixed section settings.**
A block gives merchants reordering and add/remove in the editor and matches how the rest of `main-product` is composed, so the strip can grow past two statements without a schema change. Icon choice is a `select` over a small curated set rather than an image picker, so the icons stay on the accent ink and at one size.

**Bestseller flag as a product metafield.**
Keeps merchandising out of the theme and out of the tags namespace, which Akeneo owns. Both badge placements read the one field so they cannot disagree. The metafield definition is shop-side configuration and therefore a `MIGRATION-TO-LIVE.md` line at the moment it is created, per the Hard Rules.

**Load Fraunces 600 with the same guarded pattern already used for the body faces.**
`font_modify` returns nil for a weight a font library does not carry, so the face is emitted only when it exists. Without it the title's declared 600 renders at 400 while `getComputedStyle` still reports 600 — a mismatch no computed-style diff can see.

**Size-guide trigger mirrors SweatyBetty's `surface: 'trigger' | 'dialog'` split.**
The trigger must sit inside the size legend while the dialog must live outside the fieldset; one snippet rendered twice with a shared derived id keeps that in one file. Reusing SB's shape means the tables can later be ported with the surrounding structure already correct.

## Risks / Trade-offs

- **`templates/product.json` has already diverged between the repo and the live theme** → Pull and diff the live template before writing to it, and push it only as a deliberate, reviewed template change. Do not assume the repo copy is current.
- **Overriding Dawn chrome invites specificity collisions that screenshots hide** → After each block lands, read back the changed properties with `getComputedStyle` rather than eyeballing, and check every side of borders and every member of a property family, not just the one being fixed.
- **Moving the thumbnail buttons in Liquid can break their slider wiring** → Keep the buttons' attributes and their `slider-component` ancestor intact; verify scrolling on the FitFlop product, which has seven images, not on the four-image reference.
- **Restyling shared option-rail chips could leak to the PLP** → PDP chip rules are scoped to the product section in the new stylesheet; verify a collection page's card chips are unchanged after the rail edit by diffing computed styles, since the two surfaces deliberately share `ob-option-rail.js`.
- **The colour-rail reading could be wrong** → It is a reading of an instruction the proto cannot settle, not a measurement. It is isolated to chip geometry, so reverting to wrapping chips is a stylesheet change plus flipping the existing `ob_single_row_options` switch, not a rebuild.
- **A badge or USP strip with no data must not leave a hole** → Both specs require the surrounding spacing to close up; verify with a product that has neither.

## Migration Plan

1. Land the stylesheet and Liquid changes; push with `--only` on the changed files.
2. Create the bestseller metafield definition in the shop and append it to `MIGRATION-TO-LIVE.md` at that moment.
3. Pull, diff, and only then push `templates/product.json` for the gallery layout and new blocks.
4. Configure the two USP statements in the theme editor and record them in `MIGRATION-TO-LIVE.md`.

Rollback: remove the `component-ob-pdp.css` link to drop every measured value at once; the Liquid additions are all render-guarded and produce nothing when their data is absent.

## Open Questions

- Which size families need measurement tables, and whether their numbers come from Akeneo or a static table per family as on SweatyBetty. Deferrable: the trigger's placement and presentation are specified independently of what it opens.
- Whether the bestseller badge should also appear on PLP cards. Out of scope here; the metafield chosen now would serve that without change.
