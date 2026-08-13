## Context

The native `filter` Liquid object already reports `operator: OR` for `custom.filtercolors`, and the existing facet forms submit repeated `filter.v.m.custom.filtercolors` parameters. That operator determines result-set logic, not whether the UI uses exclusive or non-exclusive controls. The same color facet is rendered in three surfaces: desktop facets, the custom mobile bar, and Dawn's fallback mobile drawer.

## Goals / Non-Goals

**Goals:**

- Give the merchant an immediate, global choice between one and several active colors.
- Use control semantics that truthfully communicate the allowed selection count.
- Preserve Shopify's native GET parameters and Dawn AJAX replacement behavior.
- Recover deterministically when a single-mode page receives an old multi-color URL.

**Non-Goals:**

- Change Search & Discovery's configured OR/AND operator.
- Change selection cardinality for Type, Maat, Brand, Gender, or other facets.
- Introduce separate collection templates or duplicate filter implementations.

## Decisions

### Separate selection cardinality from query logic

Name the theme setting `Color filter selection` with values `One color` and `Multiple colors`; default to One color. Do not label it OR/AND, because those terms already belong to Search & Discovery and answer a different question. In multiple mode, the native filter operator remains authoritative.

### Use checkboxes for multiple and radios for single

Render the existing visually hidden controls as checkboxes in multiple mode and as a shared-name radio group in single mode. Native semantics give pointer, keyboard, and assistive-technology users the correct exclusivity model without recreating selection behavior in ARIA. Existing labels, swatch visuals, focus styles, counts, and disabled handling remain shared.

Alternative rejected: keep checkboxes and uncheck siblings only with JavaScript. That looks exclusive visually but continues to announce independent toggles and fails open to multi-select if JavaScript is unavailable.

### Reuse native facet submission

Radio `change` events flow through the same Dawn facet event path as checkboxes. Selecting a different value causes form serialization to include only the checked radio from that color group; no custom filtering API or query format is introduced. Reset/removal remains the way to return to no color, matching standard radio behavior.

### Normalize legacy multi-value URLs as progressive enhancement

Server rendering cannot change the incoming request URL before Shopify computes results. In single mode, a small document-level initializer inspects repeated color parameters before the facet becomes interactive, retains the first URL value, removes the rest with `URLSearchParams`, and requests the canonical native facet URL. It must work after full navigation and Dawn section replacement and must avoid a redirect loop.

Without JavaScript, native radios still prevent shoppers from adding another concurrent value; an incoming legacy multi-value URL may retain Shopify's OR result until the shopper changes or clears the color. This is the graceful fallback rather than replacing native controls with a JavaScript-only widget.

## Risks / Trade-offs

- [Single mode cannot deselect a radio by clicking it again] → Keep the existing reset link and active-filter removal pill as explicit clear paths.
- [A legacy multi-value URL briefly represents multiple colors before normalization] → Normalize at initialization and preserve only the first URL value deterministically.
- [Desktop and mobile forms duplicate the same filter controls] → Radio exclusivity is scoped per form; Dawn serializes the active form, while the server-rendered response synchronizes every surface.
- [Merchant expects the setting to change OR into AND] → Setting labels and help text explicitly describe one-vs-several active choices and state that Search & Discovery still owns result logic.

## Migration Plan

Deploy the schema, all three render paths, and URL normalization together. Shops without a saved setting enter One color mode via the schema default. Rollback to the previous behavior requires selecting Multiple colors in Theme settings; no Search & Discovery or Akeneo change is required. Add the final live-shop setting choice to the migration checklist because it persists in protected `settings_data.json`.
