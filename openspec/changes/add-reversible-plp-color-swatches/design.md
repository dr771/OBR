## Context

The card renderer already identifies one representative variant per color option and keeps all interaction state on the button through image and variant data attributes. `custom.filtercolors` is a storefront-readable list of metaobject references on that same variant; each entry exposes a plain-text `hexcode`. The current main spec requires image-only chips, and `settings_data.json` is protected deployment state.

## Goals / Non-Goals

**Goals:**

- Preserve one card template and one interaction implementation.
- Make the undecided visual direction reversible in the theme editor.
- Render single- and multi-family color data without a client-side pass.
- Fail back to the shipped image chip for incomplete data.

**Non-Goals:**

- Change PDP color chips or the color filter facet.
- Treat broad filter families as exact material, pattern, metallic, or shade data.
- Mutate theme settings data or add a second collection template.

## Decisions

### One global setting, not duplicate templates

Add a select setting to `settings_schema.json`, defaulting to color swatches. The card snippet branches only around the visual inside each existing button. A duplicate collection template would not cover search, recommendations, or homepage cards and would create two implementations to keep synchronized.

### Resolve style through a centralized Liquid snippet

A new `ob-variant-color-swatch-style` snippet accepts the already-matched variant and returns either one validated hex value or an equal-stop linear gradient. It validates the plain-text value as three- or six-digit hex before emitting it, satisfying the project's centralized Akeneo interpretation rule and preventing arbitrary text from entering an inline style declaration.

### Preserve the image renderer as both mode and fallback

The existing `image_tag` branch stays intact. Image mode selects it directly; color mode uses it only when the centralized lookup returns blank. Data attributes for primary and secondary product imagery remain unconditional, so JavaScript does not need to know which visual mode is active.

### Distinguish the two modes without changing control size

Both modes retain the existing 3.2rem control size, row wrapping, tooltip, focus, and selected-border behavior. Color swatches are circular, matching the legacy storefront and the existing color facet language; image chips retain their cropped-square shape.

## Risks / Trade-offs

- [Filter colors are broad families, not exact colorways] → Multi-value variants use a segmented swatch and the image mode remains one-click reversible.
- [Some textured products have only one family value] → The flat swatch intentionally communicates the current data; choose image mode if merchandising accuracy is preferred.
- [Plain-text hex fields can contain bad data] → Accept only `#RGB` and `#RRGGBB`; otherwise fall back to imagery.
- [New setting is absent from existing settings data] → Shopify uses the schema default; do not push or alter `settings_data.json`.

## Migration Plan

Deploy the schema, centralized resolver, renderer, and CSS together. The default presents color swatches immediately. Rollback requires selecting `Image chips` in Theme settings; code rollback is unnecessary. Leave the OpenSpec change unarchived until the user confirms the final direction.
