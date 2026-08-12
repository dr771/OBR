## 1. Fix the hover-swap logic

- [x] 1.1 Rewrite `ensureHoverImage()` in `assets/ob-card-swatches.js`: when a second `<img>` other than `.ob-card-img2` already exists (Dawn's own `show_secondary_image` render), reuse it as the swap target instead of bailing out — capture its original `src`/`srcset` once via `data-ob-orig-src`/`data-ob-orig-srcset`, retarget to the active swatch's `data-ob-swap2-src`/`-srcset` when present, and restore the captured original when the active swatch has no second shot.
- [x] 1.2 Confirm the existing "no Dawn secondary image" path (create/update/remove `.ob-card-img2`) is untouched and still gated by `allowCreate`/`hoverMediaQuery` exactly as before.

## 2. Verify live

- [x] 2.1 Push `assets/ob-card-swatches.js` to theme `148245381229` with `shopify theme push --theme=148245381229 --allow-live --only assets/ob-card-swatches.js`.
- [x] 2.2 In a browser, select a non-default color chip on a multi-shot-color product on the homepage (`show_secondary_image: true`), hover the card image, and confirm the selected color's own second shot appears (not the product's generic default second image). Verified via CDP/DOM inspection: Dawn's reused `<img>` retargets to the color-matched second shot (`X03_339__07` for "Black Glitter"), not the product's global default second image (`X03_323...`).
- [x] 2.3 Repeat on `/search?q=...` results — confirmed identically. PDP "You may also like" could not be live-verified: this dev store's 7-product catalog returns zero recommendations for every tested product (Shopify's recommendation engine needs more catalog/order history), so `product-recommendations` never renders any cards to test against. The code path is identical to the homepage/search case already confirmed (same `card-product.liquid` render, same `show_secondary_image: true` in `templates/product.json`), so this is a data-availability gap, not an unverified code path.
- [x] 2.4 Repeat on the collection/PLP page to confirm no regression there — confirmed unchanged: `show_secondary_image: false` there, so the original `.ob-card-img2` creation path runs untouched (verified `img2Class` is still `ob-card-img2 motion-reduce`, opacity reaches 1, correct color-matched src).
- [x] 2.5 Select a color with only one shot on a `show_secondary_image: true` grid and confirm the section's original default second image still shows on hover (fallback path). Verified on `/search`: "Copper" (no second shot) correctly restored Dawn's original captured `src`/`srcset` rather than leaving a stale color's image.

## 3. Docs

- [x] 3.1 Remove the resolved entry from `BUGS.md`.
- [x] 3.2 Re-sync `templates/search.json` (and re-check `templates/index.json`, `templates/product.json`, `templates/collection.json`) from the live theme so the local repo's `show_secondary_image` values match what's actually live, per the drift found while root-causing this bug.
