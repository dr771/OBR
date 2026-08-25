## Why

The PDP gallery's rail chevrons currently render whenever a product has more than one thumbnail, even when every thumbnail already fits in the visible rail with nothing to scroll to. Dawn's `SliderComponent` marks both buttons `disabled` in that case but never hides them, so a product like the Loewenweiss Hygge Bicolor Slipper (4 images, exactly filling the desktop 4-up rail) shows two dead-looking circular buttons under the gallery for no reason.

## What Changes

- Hide the gallery chevron row's chevrons whenever the thumbnail rail has no scrollable overflow in either direction (both `prev` and `next` are simultaneously disabled), instead of only when there is a single thumbnail.
- Drive this off Dawn's own overflow detection (the `disabled` attribute `SliderComponent` already maintains) rather than a hardcoded thumbnail-count breakpoint, since the number of visibly-fitting thumbnails differs between mobile (3-up) and desktop (4-up) — the same total image count can overflow on one breakpoint and not the other.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `pdp-gallery-chrome`: the "Gallery navigation lives in a counter row beneath the thumbnails" requirement's chevron-visibility rule generalizes from "hidden only for a single image" to "hidden whenever the rail has no overflow to scroll to in either direction."

## Impact

- `snippets/product-media-gallery.liquid` — no markup change expected; the chevrons already carry the `disabled` attribute state via Dawn's `SliderComponent`.
- `assets/component-ob-pdp.css` — the existing single-image `:not(:has(...))` selector that hides `.ob-pdp__gallery-nav` needs a companion rule (or replacement) keyed off both chevrons being `disabled`, scoped to the chevrons rather than the whole nav row so the counter can still show "1 van 4".
- No JS changes anticipated — Dawn's `SliderComponent.update()` already sets `disabled` on both buttons synchronously when nothing is scrollable.
