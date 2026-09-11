## Why

Text across the storefront reads slightly "spaced out" in some places and not in others. The cause is Dawn's inherited `body { letter-spacing: 0.06rem }` plus a family of Dawn classes that add more (buttons, badges, labels, captions, `caption-with-letter-spacing`), which only the components we rebuilt ever overrode. On top of that, our own uppercase eyebrows and brand labels carry deliberate wide tracking (0.12–0.34rem). The owner wants positive tracking gone everywhere — including eyebrows and badges — so the whole storefront sets text at the font's native spacing.

## What Changes

- Dawn's inherited body tracking (`0.06rem`, `layout/theme.liquid`) becomes `normal`.
- Every positive `letter-spacing` declaration in the theme's CSS becomes `normal`: Dawn's headings, buttons, badges, form labels, captions, `caption-with-letter-spacing*`, subtitles, price, variant picker, volume pricing, customer/gift-card/password templates, and all `ob-*` uppercase eyebrows, brand labels, card badges, the predictive-search heading, and the cart price.
- **BREAKING (visual):** the measured reference tracking on the PLP card brand label (1.8px), the PDP brand line (2.75px), and the cart-drawer price (0.2px) is dropped in favour of zero tracking.
- Negative tracking (large-heading tightening such as `-0.01em`/`-0.48px`) is unchanged — it tightens, it does not space out.
- The per-brand text wordmarks (`.ob-lt-*`, `.ob-logotype small`) lose their tracking too — the homepage "Uitgelichte merken" grid renders them visibly.
- Unchanged by design: the star-rating glyph spacing in `component-rating.css` (it drives the star row's width calculation, not text tracking).
- Restored after live review (owner): section eyebrows keep their tracking. These are the homepage "Uitgelichte merken", bestsellers, occasions, and newsletter kickers (`0.336rem`) and the `/cart` header and summary kickers (`0.24rem`). Card, tile, and floating-card labels stay at `normal`.

## Capabilities

### New Capabilities
- `storefront-letter-spacing`: storefront-wide rule that theme UI text renders with no positive letter-spacing, and which exceptions are allowed.

### Modified Capabilities
- `plp-card-meta`: brand label tracking changes from 1.8px to zero.
- `pdp-layout-chrome`: brand line tracking changes from 2.75px to zero.
- `cart-drawer-line-item-layout`: line price tracking changes from 0.2px to zero.

## Impact

- `layout/theme.liquid` (inline body style).
- `assets/base.css` and the Dawn component stylesheets carrying positive tracking (cart, card, facets, localization, price, pickup, variant picker, volume pricing, customer, gift card, password, main product, quick order list, quantity popover, article card).
- `assets/component-ob-*.css` files with eyebrows/labels/badges (home hero/promo/occasions/brands/bestsellers/newsletter, swatches, search, pdp, merken, wishlist, cart page).
- No markup, schema, or JSON template changes; no shop-side dependency.
- Third-party app CSS (Wishlist King, Trusted Shops) is outside the theme and not covered.
