## Context

`snippets/product-media-gallery.liquid` renders `.ob-pdp__gallery-nav` (counter + `.ob-pdp__gallery-chevrons`) beneath the thumbnail rail. Dawn's `SliderComponent` (`assets/global.js`) already computes overflow client-side: its `update()` method sets `disabled` on `prevButton` when the first thumbnail is visible and `scrollLeft === 0`, and on `nextButton` when the last thumbnail is visible — both run synchronously from the constructor via `initPages()`, so both `disabled` attributes are correct before first paint whenever the browser can lay out the rail. `assets/component-ob-pdp.css` currently hides the whole `.ob-pdp__gallery-nav` row via `.ob-pdp .thumbnail-slider:not(:has(.thumbnail-list__item + .thumbnail-list__item)) .ob-pdp__gallery-nav`, which only matches the single-thumbnail case (no sibling `.thumbnail-list__item`).

## Goals / Non-Goals

**Goals:**
- Hide only the chevrons (not the counter) when the rail has no overflow in either direction, at any thumbnail count, at any breakpoint.
- Reuse Dawn's existing overflow computation instead of adding new JS or a hardcoded count breakpoint.

**Non-Goals:**
- Not touching the single-image case's existing full-row hide (a single image still has nothing to count either, so hiding the whole row there is correct and stays as-is).
- Not changing `ob-pdp-gallery.js`'s counter text logic.

## Decisions

**Hide chevrons via a CSS rule keyed on both `disabled` attributes, not a thumbnail-count threshold.** A pure count-based rule (e.g. "hide when media_count <= 4") can't be correct across breakpoints: the rail shows 4-up on desktop but 3-up on mobile (`snippets/product-media-gallery.liquid`'s `sizes` capture), so the same product can overflow on one and not the other. Dawn's `SliderComponent.update()` already recomputes `disabled` per breakpoint via a `ResizeObserver` on the slider, so keying off `disabled` gets breakpoint-correctness for free.

Rule: `.ob-pdp__gallery-chevrons:has(.slider-button--prev[disabled]):has(.slider-button--next[disabled]) { display: none; }`, added to `assets/component-ob-pdp.css` near the existing single-image rule. Only the chevrons wrapper is hidden, not `.ob-pdp__gallery-nav`, so the counter keeps rendering.

**Rely on `SliderComponent`'s existing synchronous `initPages()` call, no new JS.** Both `disabled` attributes are set in the constructor before the element's first paint (custom element upgrade runs during initial parse/hydration, ahead of the browser's first rendered frame), so there is no flash-of-visible-chevrons to guard against — consistent with how the existing single-image CSS rule already relies on no JS at all.

## Risks / Trade-offs

- [Risk] If a `ResizeObserver`-driven `disabled` update ever lags a layout change (e.g. extremely fast viewport resize), chevrons could transiently mismatch actual overflow. → Accepted: this is Dawn's existing behavior for the *disabled* state today (used for dimming), we're only adding a `display: none` consequence to a state Dawn already maintains reactively.
- [Risk] `:has()` selector support — already used elsewhere in `component-ob-pdp.css` (the single-image rule), so no new browser-support surface is introduced.
