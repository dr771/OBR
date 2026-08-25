## Context

The active header is configured as Dawn's `middle-left` layout: logo, inline navigation, and utility controls share one grid row. Its eight current labels exceed that row at approximately 1530px. The shared language snippet also renders in footer and mobile contexts, so compact header copy must be opt-in.

## Goals / Non-Goals

**Goals:**

- Retain all eight navigation destinations without accidental partial wrapping.
- Reclaim header space without reducing the discoverability of product-category links.
- Preserve customer-account access below the desktop navigation breakpoint.

**Non-Goals:**

- Redesign the top-center, top-left, or middle-center header layouts.
- Change footer, announcement-bar, or mobile language-picker copy.
- Change Shopify customer-account availability.

## Decisions

### Content breakpoint uses an intentional grid row

For the configured middle-left header, the inline menu is single-line from 1500px upward. From 990px through 1499px, the logo and utilities form the first row and the complete, centered navigation forms the second row. Dawn's existing drawer owns widths below 990px. This preserves all destinations and makes the existing height at medium desktop widths deliberate instead of an orphaned final link.

### The compact locale label is opt-in

`language-localization` receives a `compact_label` render argument. Only the desktop-header caller sets it, rendering the current language's uppercase ISO code while retaining the native full language name in the picker choices and as the button's accessible label. Other callers retain the existing full endonym by default.

### Account visibility is independent from avatar selection

A new header checkbox defaults to off and gates the inline account icon. Dawn's `enable_customer_avatar` continues to choose the signed-in presentation only when the icon is enabled. When the icon is hidden, the drawer exposes the Login/account link at all drawer widths below 990px so customer accounts stay reachable.

### Wishlist heart is cart-adjacent

The existing heart markup is left in its current DOM position immediately before cart. The wishlist spec changes from a fixed “between account and cart” relationship to “immediately before cart, after account when present.”

## Risks / Trade-offs

- [A merchant re-enables the account icon] → the 1500px one-row breakpoint still accommodates the compact language code and account control; smaller desktop widths use the second row.
- [A future locale uses a longer ISO tag] → only the compact trigger changes; the full picker choices and all other surfaces remain readable.
- [The shared snippet changes] → its default branch remains byte-for-byte equivalent in output for footer, announcement bar, and mobile drawer callers.

## Migration Plan

Deploy the Liquid and scoped header CSS together. The new setting defaults to hidden without altering protected `settings_data.json`. Re-enabling the icon is a reversible theme-editor change; reverting the theme files restores Dawn's previous layout.
