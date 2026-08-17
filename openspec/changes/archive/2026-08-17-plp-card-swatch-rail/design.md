## Context

See proposal.md — Why. Two existing pieces meet here:

- The PDP rail (`pdp-option-rails`): `snippets/product-variant-picker.liquid` wraps the chip row in `.product-form__option-rail-shell` > `.product-form__option-rail[data-ob-option-rail]`, renders `snippets/ob-option-rail-controls.liquid` for the chevrons, styles it in `assets/component-ob-option-rail.css`, and drives cue state from `assets/ob-pdp-option-rail.js`, which toggles `is-overflowing` / `is-at-start` / `is-at-end` on the shell.
- The card row (`plp-card-swatches`): `snippets/ob-card-swatches.liquid` emits `.ob-card-swatches` with one `.ob-card-swatch` button per colour; `assets/ob-card-swatches.js` handles selection, image swap and link retargeting entirely through document-level delegation, because Dawn replaces `#ProductGridContainer` wholesale on every facet change.

Measured on the live dev grid: desktop collection card = 301px, chip = 32px, gap = 6px, row wraps.

## Goals / Non-Goals

**Goals:**

- One rail implementation shared by PDP and PLP, so the two can't drift.
- Card chip geometry that is a pure function of the rail width, with the visible count and peek fraction expressed as CSS custom properties.
- Zero change to card selection semantics: hover/focus/click still selects in place, swaps the image, retargets the link, and materialises the colour-matched second shot.

**Non-Goals:**

- Changing the PDP rail's own look, sizing or cue behaviour.
- Touching how the chip's image, variant or second shot is resolved in Liquid.
- Any responsive rework of the grid itself (`match-desktop-plp-spacing` owns that).

## Decisions

### Share the rail JS, duplicate the rail CSS

`assets/ob-pdp-option-rail.js` becomes `assets/ob-option-rail.js`, with the one PDP-specific line — `rail.closest('.product-form__option-rail-shell')` — replaced by `rail.closest('[data-ob-option-rail-shell]')`. Both PDP shells and the new card shell carry that attribute. `scrollRail`'s item-width probe gains `.ob-card-swatch` alongside `.ob-swatch-input-wrapper, label`, and `revealSelected` falls back from the checked radio's label to `.ob-card-swatch--active`.

CSS is *not* shared. `component-ob-option-rail.css` stays PDP-only and the card rail's chrome lives in `component-ob-swatches.css`, which `card-product.liquid` already loads. Two ~30-line blocks of fade/button CSS is a smaller cost than making the PDP's shipped, live-verified rail chrome depend on a selector rewrite, and it matches the repo's per-capability stylesheet convention. Alternative considered: one generic `[data-ob-option-rail-shell]` stylesheet for both — rejected, it puts a regression risk on an archived, live-verified capability for a purely cosmetic saving.

### Reveal by `scrollBy`, not `scrollIntoView`

The current PDP implementation calls `selected.scrollIntoView({block: 'nearest', inline: 'nearest'})`. On a PDP that is harmless; on a grid it is not — a card below the fold whose rail initialises would drag the page vertically to that card. The shared module instead measures the selected chip against the rail's own box and issues a horizontal-only `rail.scrollBy({left: delta})`, doing nothing when the chip is already inside. This satisfies the PDP's existing "reveal the selected control" requirement identically while being safe on 18 cards at once.

### Chip size from the rail width

The card sets, on `.ob-card-swatches`:

```
--ob-card-chip-gap: 0.6rem;
--ob-card-chip-visible: 5;   /* fully visible chips */
--ob-card-chip-span: 5.4;    /* visible + peek fraction */
```

and each chip takes `flex: 0 0 calc((100% - var(--ob-card-chip-visible) * var(--ob-card-chip-gap)) / var(--ob-card-chip-span))` with `aspect-ratio: 1`. Five full chips leave five fully visible gaps (the gap before the peeking sixth is on-screen too), which is why the subtraction uses the *visible* count and the division uses the *span*. At 301px this yields ≈50px chips with a ≈20px peek — close to the PDP's 5.4rem chip, and self-correcting on narrower cards. Alternative considered: a fixed larger chip size with `overflow-x` — rejected, it produces an arbitrary peek that changes with card width and can land on a chip boundary, killing the affordance.

The existing shared rule `.ob-card-swatch, .ob-swatch-input__chip { width/height: 3.2rem }` keeps applying to the PDP chip; the card chip overrides width/height to `auto` and takes its size from the flex basis.

### Tooltip moves to the shared node

`overflow-x: auto` forces `overflow-y` to a non-visible value, so the card chip's `::before`/`::after` tooltip would be clipped by the rail — the same problem `ob-swatch-tooltip.js` was written to solve for the PDP. The card chips join it: its `mouseover`/`mouseout`/`focusin`/`focusout` selectors widen from `.ob-swatch-input__label[data-ob-swatch-name]` to also match `.ob-card-swatch[data-ob-swatch-name]` (the attribute is already emitted), `card-product.liquid` loads the script, and the card chip's tooltip pseudo-elements are deleted. The focus path needs a small change: the PDP tooltip finds its label from the focused *radio*, while a card chip is itself the focusable element, so the handler resolves either shape.

### Controls snippet takes a class root

`ob-option-rail-controls.liquid` gains an optional `class_root` (default `product-form__option-rail-button`), so the card can render `ob-card-swatches__button--previous/--next` and style them independently without loading the PDP stylesheet. The chevron markup, `type="button"`, data attributes and accessible-label parameters stay identical.

### No scroll track on card rails

Deliberate deviation from the PDP, called out in the proposal: `scrollbar-width: none` + hidden `::-webkit-scrollbar` on the card rail. Eighteen persistent thin scrollbars (they are persistent on Windows, overlay-only on macOS — this repo is worked from both) would read as grid noise, and the peeking sixth chip plus fade and chevrons already carry the "there is more" signal. Reversible in one declaration if the owner disagrees on review.

## Risks / Trade-offs

- **Chip size jumps 32px → ≈50px, changing card rhythm below the image** → intended by the request (it is what makes five-plus-a-peek fill the card), but it is the one change most likely to need a taste adjustment; the visible count and peek are single-token edits.
- **Chevrons overlay the first/last chip on a 301px card**, where the PDP can park them outside the rail → card buttons are smaller (2.8rem) and sit over the fade, where the chip beneath is already faded; they only appear when that side actually overflows.
- **Card chevrons live inside the card, above Dawn's stretched heading link** → they are `type="button"` inside the existing `.ob-card-swatches` stacking context (`position: relative; z-index: 2`), the same escape hatch the chips already rely on, and the shared rail JS never navigates.
- **Renaming the PDP rail asset touches an archived, live-verified capability** → behaviour-preserving: same file contents apart from the generic shell lookup and the reveal change, both re-verified on the PDP before the PLP is signed off.
- **CSS `calc()` dividing by a custom property** → the divisor is a plain `<number>` token (`5.4`), which is the supported form; no `calc()`-inside-divisor nesting is used.
- **`aspect-ratio` with a flex basis** → widely supported; the chip is a leaf button with a single `<img>` child at `width/height: 100%`, so there is no intrinsic-size fight.

## Migration Plan

Theme-only change, pushed with `--only` on the touched files to the main Dawn theme. Rollback is a `git revert` plus the same push. No shop-side setting, metafield or app configuration is involved, so nothing is added to MIGRATION-TO-LIVE.md.
