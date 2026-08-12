## Why

Product-card swatch hover is inconsistent across the site: on the collection/PLP page, hovering a card after picking a color chip shows that color's own second shot, as designed. On every other product grid — homepage featured collection, PDP related-products, and `/search` results — hover instead shows Dawn's generic, non-color-aware secondary image, ignoring the selected swatch entirely. This is a known, previously-logged regression (see `BUGS.md`, "same bug as SB once") and breaks the spec's own stated goal that "Grid swatches / filter behaviour should be always the same."

Root cause confirmed against the live theme (`original-brands-dev.myshopify.com`, theme `148245381229`): `templates/collection.json` has `show_secondary_image: false`, while `templates/index.json`, `templates/product.json` (related-products), and the live `templates/search.json` all have it `true` (the local repo's copy of `templates/search.json` had drifted to `false` and needs re-syncing separately, see Impact). `assets/ob-card-swatches.js`'s `ensureHoverImage()` currently treats "a second `<img>` already exists" as "Dawn's `show_secondary_image` is on, leave it alone" and bails out — so on those three surfaces the color-matched pair is never shown, and Dawn's default second image (always the product's global second-uploaded media, independent of the selected color) is revealed instead.

## What Changes

- `ensureHoverImage()` in `assets/ob-card-swatches.js` no longer bails out when a section-rendered secondary `<img>` is present. Instead it reuses that existing element as the hover-swap target: while the active swatch has a color-matched second shot, that element's `src`/`srcset` are retargeted to it; when the active color has no second shot of its own, the element's original (Dawn-rendered) `src`/`srcset` are restored, so single-shot colors keep today's normal fallback behavior.
- No new DOM elements, no CSS changes — the existing `.media--hover-effect > img + img` reveal rule already targets "whatever the second `<img>` in the media wrapper is," so reusing Dawn's element instead of skipping it is enough.
- Updates the one `plp-card-swatches` requirement scenario that currently documents the old (buggy) behavior as intentional.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `plp-card-swatches`: the "Hover reveals a second, color-matched image" requirement's "section's own secondary-image setting is enabled" scenario changes from "that image is left untouched" to "the color-matched second shot is shown by retargeting that element, falling back to the original image only when the active color has no second shot of its own."

## Impact

- `assets/ob-card-swatches.js` — `ensureHoverImage()` rewritten as described above; `selectSwatch()`'s call site is unaffected.
- `openspec/specs/plp-card-swatches/spec.md` — one scenario updated via delta spec.
- No Liquid, CSS, or theme-settings changes required.
- Separately (not a spec change, a data-hygiene fix noticed during root-causing this): the local repo's `templates/search.json` has `show_secondary_image: false` while the live theme has `true` — will be re-synced from the live theme so local files stop misrepresenting live settings for anyone diagnosing this class of bug again.
