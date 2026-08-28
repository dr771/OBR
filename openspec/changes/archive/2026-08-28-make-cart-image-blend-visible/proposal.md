## Why

`multiply` has no visible effect against the drawer's white page background. The product image needs a local PLP-colour backdrop while leaving the cart media cell itself unstyled.

## What Changes

- Wrap each cart image in a photo frame that supplies a `#f1f5f9` backdrop.
- Keep blend mode and radius on the image; keep the media cell free of visual treatment.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `cart-drawer-line-item-layout`: make the documented image blend treatment visibly composite against a local backdrop.

## Impact

- `snippets/cart-drawer.liquid` and `assets/component-cart-drawer.css`.
