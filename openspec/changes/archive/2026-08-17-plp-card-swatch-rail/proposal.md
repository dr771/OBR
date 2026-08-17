## Why

The PDP already presents its recognized colour options as a single-row rail with a thin scroll track, edge fades and directional chevrons (`pdp-option-rails`). The PLP card colour chips still use the original wrapping row of 3.2rem chips, so a 12-colour product turns the card into a three-line block of tiny thumbnails that pushes the title and price down and makes every card in the grid a different height. The owner wants the PDP's rail treatment on the card, with the chip size tuned so a card always shows five full chips plus a sliver of a sixth — the peek being the affordance that says "there are more colours" — and a 5px corner radius on the chips.

## What Changes

- The PLP card swatch row becomes a **horizontal single-row rail**: chips no longer wrap, the row scrolls inline, and overflow is signalled by an edge fade plus previous/next chevron buttons that appear only when there is content to reach in that direction — the same cue model the PDP rail uses.
- Card chips are **sized from the card width** rather than fixed at 3.2rem: five full chips plus a partial sixth fit the rail exactly at any card width (≈50px chips on the current 301px desktop card), so the peek is a deliberate, always-consistent overflow hint.
- Card chips get a **0.5rem corner radius**, replacing the current 0.2rem image-chip radius and the 50% circle of the (currently unused) flat-colour chip mode, so both modes read as the same component.
- The card chip **tooltip moves from the CSS `::before` pattern to the shared JS-positioned tooltip** the PDP already uses. A horizontally-scrolling track computes `overflow-y` to `hidden`, which would clip a chip-anchored CSS tooltip — the exact reason the PDP tooltip was moved to `position: fixed` in the first place.
- The rail scroll/cue JavaScript is **generalized out of the PDP-only asset into one shared rail module** used by both surfaces, keyed on a `data-ob-option-rail-shell` attribute rather than the PDP's shell class name. Reveal-the-selected-control is reimplemented as a horizontal-only scroll (`scrollBy` on the rail) instead of `scrollIntoView`, which on a grid of 18 cards would drag the *page* to whichever card is being initialised.
- Deliberate deviation from the PDP: card rails **hide the scroll track**. Eighteen visible scrollbars in a product grid is visual noise the single PDP rail never has; the partial sixth chip, the fade and the chevrons carry the same information.

## Capabilities

### New Capabilities

None — this is a presentation change to an existing card component.

### Modified Capabilities

- `plp-card-swatches`: the swatch row's presentation requirement changes from a wrapping row of fixed-size chips to a single-row rail with sized chips, a partial sixth chip, edge fades and one-chip-at-a-time accent chevrons (absent on touch), and a 0.5rem chip radius; the active/hover state changes from a contrasting ring to dropping the chip's multiply; chip imagery gains a source-density requirement; the chip-tooltip requirement changes from a wrap-jitter-proof CSS tooltip to the shared fixed-position tooltip, because the rail's clipping makes the CSS one impossible and wrapping no longer happens.
- `plp-brand-card-treatment`: a brand's inner-padding correction becomes proportional rather than an absolute length, and applies to the card's colour chips as well as the main tile, so a chip is a small copy of the tile rather than a differently-framed crop.

## Impact

- `snippets/ob-card-swatches.liquid` — rail wrapper + shell attributes around the existing chip loop, chevron controls.
- `snippets/ob-option-rail-controls.liquid` — accepts a class root so the PLP can style its own buttons.
- `snippets/product-variant-picker.liquid` — PDP shells gain the shell attribute; loads the renamed shared rail asset.
- `snippets/card-product.liquid` — loads the shared rail asset and the shared tooltip asset alongside the existing card-swatch JS.
- `assets/ob-option-rail.js` (renamed from `assets/ob-pdp-option-rail.js`) — shared rail behaviour, generic shell lookup, horizontal-only reveal.
- `assets/ob-swatch-tooltip.js` — selector widened to card chips.
- `assets/component-ob-swatches.css` — card rail chrome, chip sizing, radius; removal of the card chip's CSS tooltip.
- No change to chip selection semantics, image swapping, hover-pair behaviour, variant-link retargeting, or PDP rail behaviour. No shop-side/admin dependency.
