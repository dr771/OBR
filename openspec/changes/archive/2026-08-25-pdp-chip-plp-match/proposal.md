## Why

The PDP color chips currently follow a Bolt-reference bordered-box look (solid border, flat surface fill, ink-colored ring on selection), styled independently of the PLP card swatches. The owner now wants the whole PDP gallery — color chips, the main product image, and the thumbnail rail — to look identical to the PLP's card treatment: the same blended-surface background, the same borderless-at-rest treatment, the same thin hairline border, so a shopper sees one consistent surface language across collection and product pages, not just on the color picker.

## What Changes

- **BREAKING** (visual): PDP color chips drop the Bolt-measured bordered-box style (`4.8rem` chip, `0.4rem` image inset, always-visible border, ink border + box-shadow ring on selection) in favor of the PLP card-swatch treatment.
- **BREAKING** (visual): the PDP main gallery image and the thumbnail rail drop their white-surface, always-visible-hairline / ink-ring-on-selection styling for the same PLP-matched treatment.
- Chip size becomes a fixed `~5.0rem` (was `4.8rem`), matching the PLP's typical resolved desktop chip size. Stays a fixed value — the PDP rail's own width does not drive it the way the PLP's flex-basis calc does.
- A new PDP-scoped token, `--ob-pdp-photo-surface` (`#f1f5f9`), carries the same tint the PLP's `--ob-product-photo-surface` uses. It has to be a distinct value from the existing `--ob-pdp-surface` (pure white) — mixing white with white produces no visible blend at all, which is why the first pass of this change silently did nothing until the token was introduced.
- All three surfaces (chips, main image, thumbnails) switch from a flat/white fill to the same two-state color-mix formula the PLP uses: `color-mix(in srgb, var(--ob-pdp-photo-surface) 40%, #fff)` at rest, `var(--ob-pdp-photo-surface)` (full tint) on hover/active/focus-visible/current.
- All three surfaces' images gain `mix-blend-mode: multiply` so the photo blends into the surface tint exactly as it does on PLP cards.
- All three surfaces' borders go from an always-visible solid border to `0.1rem solid transparent` at rest (reserved space only) with a hairline `#66666612` border drawn only on hover/active/focus-visible/current. The chip's `0.4rem` padding/inset box is removed — the image fills the chip like the PLP chip does.
- Selected/current-state styling is now identical to hover/active (surface-lightness + hairline border only) on all three surfaces — the ink-colored border + `box-shadow` ring on the chip's `:checked` state and the thumbnail's `[aria-current]` state are both removed. A shopper identifies the selected chip or active thumbnail the same way they identify a hovered one: it is the "darker" one.
- Focus-visible keeps a real focus indicator (an inset outline ring) on the chip and thumbnail, since the hairline border alone isn't sufficient focus contrast — this one aspect intentionally does not mirror the PLP because the PLP already has this same outline rule.
- Chip radius stays `0.8rem` (close enough to PLP's `0.5rem` card-swatch radius that no separate value is introduced; avoids re-deriving a reference-driven inset radius now that there's no padding box). Main image and thumbnail radii are unchanged (`3.2rem` / `1.2rem`).
- Two Dawn-base bugs surfaced and had to be fixed for the new thumbnail treatment to actually show: Dawn's `.thumbnail:hover { opacity: 0.7 }` was dimming the whole thumbnail on hover (chips never dim), and Dawn's `.thumbnail[aria-current]` family of rules (plain, `:focus`, `:focus-visible`, and the mouse-click case `:focus:not(:focus-visible)`) draws its active indicator as a `box-shadow` ring that ties this change's selectors on specificity and wins by source order unless each pseudo-state is named explicitly and given `box-shadow: none`. The shared `component-ob-swatches.css` `:checked` chip rule has a similar latent bug — it sets `border-width: 0.2rem`, which this change's higher-specificity `border-color` override didn't reset, so the selected chip briefly rendered a visibly thicker border than every other state until `border-width: 0.1rem` was added explicitly.

## Capabilities

### Modified Capabilities
- `pdp-option-rails`: requirement 4 ("Color chips SHALL be 4.8rem square with a 0.8rem radius and a 0.4rem inset...") is replaced with the PLP-matched chip treatment described above (size, background blend, border, selected-state behavior).
- `pdp-gallery-chrome`: requirement 1 (main gallery image: "white surface... single 1px hairline border") and requirement 2 (thumbnails: "white surface... unselected hairline border; selected full-ink border reinforced by a 1px ring") are both replaced with the PLP-matched surface/border treatment described above.

## Impact

- `assets/component-ob-pdp.css` — new `--ob-pdp-photo-surface` token; replace the `.ob-pdp .ob-swatch-input__chip` rule block (size/padding/border/background), its hover/`:checked`/focus-visible rules (remove ink border + box-shadow ring, fix the inherited `border-width` bug), and add `img { mix-blend-mode: multiply }`. Same treatment applied to `.ob-pdp .product__media-wrapper .product__media`/`.media` (main image) and `.ob-pdp .thumbnail` (thumbnail rail), including explicit `box-shadow: none` overrides for Dawn's `[aria-current]` box-shadow rules across all its pseudo-state variants, and an `opacity: 1` override for Dawn's `.thumbnail:hover` dimming.
- No JS changes — `assets/ob-option-rail.js`, `assets/ob-swatch-tooltip.js`, and `assets/media-gallery.js` behavior are untouched, this is visual styling only.
- No change to `assets/component-ob-swatches.css` (the PLP's shared file) — the PDP already overrides chip geometry there via its own higher-specificity `.ob-pdp` rules, and that pattern continues.
