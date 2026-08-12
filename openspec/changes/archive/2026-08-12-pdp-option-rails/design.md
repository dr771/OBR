## Context

The PDP already emits accessible radio-backed controls for colors and recognized sizes. The rail must add discovery cues without replacing those controls, and it must work with Dawn's dynamic section rendering. Native browser scrollbars alone are not enough because macOS may suppress them until active interaction.

## Goals / Non-Goals

**Goals:**

- Keep each applicable option family in one compact horizontal row.
- Make overflow discoverable but visually secondary.
- Preserve native controls, no-JavaScript selection, and skin-agnostic color tokens.
- Make a complete rollback a single Liquid assignment.

**Non-Goals:**

- Change color-image sourcing, size ordering, availability logic, or Shopify picker settings.
- Add pagination dots, a carousel dependency, or a bespoke slider library.
- Apply rail treatment to generic product options.

## Decisions

### Use one reusable rail shell and control snippet

Both color and size rails use the same shell, state classes, control markup, and JavaScript. Family modifiers tune only geometry: color has 5.4rem image chips; size has 5.6rem square narrow/tablet boxes and retains its desktop equal-width rhythm. This prevents divergent overflow behavior between the two picker families.

### Use layered, state-aware overflow cues

The rail always exposes a thin styled scrollbar when the browser permits it. JavaScript measures real overflow and toggles shell state classes. Edge fades and the relevant chevron appear only while undiscovered content exists in that direction; on short rows neither cue is shown. Controls sit over the rail boundary rather than consuming choice width, and their accessible labels name the action.

### Enhance scrolling without replacing native behavior

The rail is ordinary overflow-x scrolling first. The script adds grouped chevron scrolling, selected-item reveal, ResizeObserver updates, and MutationObserver setup for Dawn-rendered content. It respects reduced motion and leaves all radio behavior to Dawn. Without JavaScript, touch/pointer scrolling and the scrollbar remain available.

### Keep rollback at picker scope

`ob_single_row_options` in `snippets/product-variant-picker.liquid` loads all rail markup/assets together. When false, it restores the prior wrapping color swatches and the `pdp-size-picker-grid` responsive multi-row grid; it loads no rail controls or JavaScript.

## Risks / Trade-offs

- [Small chevrons can be missed] → They are reinforced by the visible scrollbar and edge fade only where more content exists.
- [Affordances can obscure an edge chip] → Buttons are boundary-centered overlays with fade beneath rather than a persistent column, and vanish at their respective ends.
- [Measured overflow can change after variant updates] → Resize and mutation observers recalculate state.

## Migration Plan

Deploy the Liquid, snippet, CSS, and JavaScript together. To revert only this variation, set `ob_single_row_options` to `false` and deploy the picker snippet; no content, setting, or data migration is required.
