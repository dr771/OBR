## Context

See proposal.md — Why. The relevant constraint is that a card chip is a photograph multiplied onto a flat surface, not a solid colour swatch: `#ProductGridContainer .product-card-wrapper .ob-card-swatch img` carries `mix-blend-mode: multiply`, and the chip's `background-color` is the backdrop that multiply resolves against. Any change to the chip's rest/active appearance therefore has two possible attachment points — the image or the surface underneath it — and they behave very differently.

The chip surface is `--ob-product-photo-surface` (`#efedec`), the same warm tile the main card image sits on. It is a variable a brand block in `component-ob-brand-media.css` can override, so any derived colour must be derived at use-site rather than hard-coded.

## Goals / Non-Goals

**Goals:**
- Make the selected chip identifiable from normal grid-scanning distance without introducing a drawn edge.
- Keep the cue derived from `--ob-product-photo-surface`, so a brand override stays coherent.
- Leave chip geometry byte-identical, so the rail's five-full-plus-a-peek sizing and `ob-option-rail.js`'s overflow measurement are unaffected.

**Non-Goals:**
- Changing the PDP chips (`ob-swatch-input`), which share the stylesheet but not the `#ProductGridContainer` scope.
- Changing the homepage/search-grid chips, which never had the blended treatment.
- Any change to the chip photography, its crop sizes, or its `srcset`.

## Decisions

**Move the cue to the chip's background, not the chip's image.** Two candidates were tried live:

1. `opacity` on the chip `<img>` at rest, full opacity on hover/active. Rejected — it dims the photograph itself, which is the content, and the effect is inconsistent across the catalogue: a dark packshot barely changes while a white one washes out.
2. `background-color` on the chip, lightened at rest. Chosen. The photograph is untouched; a resting chip reads lighter purely because multiply resolves against a lighter backdrop. Dark packshots still show a subtler delta than light ones — multiply over near-black is near-black regardless — but the cue lands on the surface, which is where a "chip state" belongs.

**Express the lightened rest surface as `color-mix(in srgb, var(--ob-product-photo-surface) 40%, #fff)`.** Derived from the variable, per the spec, so a brand override propagates. `color-mix` is already used in this file for the outgoing hairline, so no new browser-support surface is introduced.

**Move the `background-color` declaration out of the base chip rule.** The base rule previously set the full surface colour; leaving it there and overriding it below would have left two competing declarations at identical specificity, readable only by source order. The base rule now sets only the transparent border reservation, and rest/active surfaces are stated once each.

**Keep the transparent `border: 0.1rem solid transparent`.** Nothing draws it now, but removing it would shrink each chip's border box by 2px and change the rail's overflow arithmetic — a geometry change nobody asked for, in a capability whose sizing is a documented requirement.

**Attach the active surface to `--active`, `:hover`, and `:focus-visible` alike**, mirroring what the hairline rule did, plus `:focus-visible` so a keyboard user gets the same surface state and not only the outline.

**Transition `background-color` over `--duration-short`.** Without it the surface snaps between two close values, which reads as a rendering glitch rather than a state change.

## Risks / Trade-offs

- **Dark colourways show a weaker cue than light ones** → Accepted and understood: multiply over a near-black photo hides most of the backdrop. The chip's outer margin still lightens, and the active chip is never ambiguous when compared against its neighbours in the same row. Reviewed live before adoption.
- **Surface lightness is not an accessible-contrast selection indicator on its own** → `aria-pressed` already carries the state programmatically (unchanged), and `:focus-visible` still draws the foreground outline. No change to either.
- **A brand overriding `--ob-product-photo-surface` to something already near-white would flatten both states toward each other** → No brand currently does; `component-ob-brand-media.css` overrides padding, `object-fit`, and blend, not the surface value itself. Worth re-checking if a brand ever sets it.

## Migration Plan

Single CSS file, no state, no shop-side dependency. Deploy is `shopify theme push --only assets/component-ob-swatches.css`; rollback is restoring the previous rule block and pushing the same file.
