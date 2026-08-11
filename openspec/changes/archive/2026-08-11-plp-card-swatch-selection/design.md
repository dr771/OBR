## Context

OB already delegates card-swatch events at document level so behavior survives Dawn facet grid replacement. Its chips are anchors, however, and its hover pair relies on Dawn's whole-card `:hover`, whereas SB uses buttons, retargeted card links, and geometric image-area hover state.

## Goals / Non-Goals

**Goals:**

- Match SB's non-navigating selection and selected-variant card-link behavior.
- Make the current color's primary/secondary hover pair deterministic after every selection.
- Preserve delegated events and hover-only secondary-image loading.

**Non-Goals:**

- Changing chip visuals, tooltip styling, product data parsing, or Dawn's facet rendering.
- Adding navigation or variant selection when JavaScript is unavailable; the normal card link remains the fallback.

## Decisions

### Use native buttons and retarget existing card links

Each chip becomes `button type="button"` with `aria-pressed` and a variant ID data attribute. The delegated selector updates all heading links within that card with `URL.searchParams.set`, which replaces a pre-existing `variant` parameter while retaining Shopify's `_pos/_fid/_ss` tracking. This matches SB's interaction and preserves the correct semantic distinction: the chip performs an in-page state change; the card link performs navigation. Preventing default on anchors was rejected because it would retain misleading link semantics and an unwanted no-JS navigation path; append-only URL construction was rejected after live facet refresh exposed duplicate variant parameters.

### Mirror SB's geometric image-hover state

A delegated `mousemove` compares pointer coordinates with `.card__media` bounds and mirrors the result as an OB-specific class on the card wrapper. CSS neutralizes Dawn's whole-card second-image reveal and enables it only for that class. Pure `.card__media:hover` was rejected because Dawn's stretched heading-link pseudo-element owns hit testing over the image.

### Keep lazy materialization, gated by hover capability

The selected color's second image remains absent until a fine-pointer, hover-capable device enters a card. Selection updates an existing pair but does not cause touch-only clients to create or fetch one. The section's own server-rendered secondary image remains untouched.

### Keep instant first/second transitions

Once a pair exists, both images have opacity transitions disabled. This prevents the newly selected first shot or its hover pair from fading through the previous color.

## Risks / Trade-offs

- [Repeated mousemove geometry checks] → Limit work to a card under the pointer and return immediately when its hover state is unchanged.
- [A card may contain duplicate Dawn heading links] → Retarget all `.card__heading a` elements within the wrapper, matching SB.
- [Hybrid devices have both touch and mouse] → Gate pair creation with `(hover: hover) and (pointer: fine)` so mouse-capable hybrids receive desktop behavior without charging touch-only devices.

## Migration Plan

Deploy only the modified Liquid, JavaScript, and CSS files to main theme `148245381229`. Verify click non-navigation, selected link URL, first/second image identity before and after color selection, desktop image-area boundaries, touch/mobile loading behavior, and console output. Roll back with an inverse targeted theme push.
