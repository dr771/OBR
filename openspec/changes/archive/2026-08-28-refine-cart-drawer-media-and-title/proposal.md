## Why

The initial drawer alignment applied the PLP thumbnail surface to the media container and made titles too large for this compact panel. Refine both details to match the intended drawer hierarchy.

## What Changes

- Keep `mix-blend-mode: multiply` and the PLP's image radius exclusively on the image element; remove all media-container blend/backdrop styling.
- Reduce cart line-item product names to the compact 1.4rem token.
- Keep cart product-name links free from hover underlines.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `cart-drawer-line-item-layout`: refine the documented image blend scope and title size.

## Impact

- `assets/component-cart-drawer.css` only.
