## Context

White JPEG packshots only change appearance under `mix-blend-mode: multiply` when a non-white backdrop exists beneath them. Putting that surface directly on the `.cart-item__media` cell created an oversized column and was rejected. 

## Decision

Wrap each image in a content-sized `.cart-item__image-frame`. The frame provides the PLP `#f1f5f9` background behind the image only. The image continues to own `mix-blend-mode: multiply` and the 1.6rem radius; the media cell receives no visual treatment.

## Non-Goals

- No change to cart navigation, alt text, lazy loading, or image dimensions.
