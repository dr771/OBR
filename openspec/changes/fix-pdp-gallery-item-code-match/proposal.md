## Why

The PDP gallery of 104 pre-live products (all Mechanix, some Holster) renders no images at all. Their Akeneo item codes contain a hyphen (`MSV-55`), which the media filename turns into an extra underscore segment (`…_MSV_55_CVRT__01.jpg`). The filename parser assumes a one-segment item code, reads the color as `55_CVRT`, and that never equals the SKU's `CVRT`, so every image is filtered out. Item codes in filenames are not even reliably the SKU's (`HST378-P36-41` → `HST378`), so the item code cannot be stripped to recover the color.

## What Changes

- PDP gallery, thumbnails and media modal treat a media item as belonging to the selected color when its filename carries the color code immediately before the shot separator (`_{code}__`, case-insensitive), instead of requiring the left-parsed filename code to equal it.
- When the selected color matches no media at all, the PDP fails open and shows all product media rather than an empty gallery (8 colors on pre-live have photos only under a different code).
- PLP card swatches are unchanged: they compare filename codes with filename codes and are already consistent.

## Capabilities

### New Capabilities

### Modified Capabilities
- `pdp-color-media-gallery`: color matching is "filename carries the selected code" rather than "parsed code equals it"; a color with zero matching media fails open to all media.

## Impact

- `snippets/ob-media-color-code.liquid` (optional `color` argument)
- `snippets/product-media-gallery.liquid`, `snippets/product-media-modal.liquid`
- No data, app or shop-setting change.
