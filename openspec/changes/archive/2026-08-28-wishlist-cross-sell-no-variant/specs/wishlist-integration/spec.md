## MODIFIED Requirements

### Requirement: Wishlist page shows display labels instead of raw Akeneo keys
The theme SHALL overlay WK-rendered option labels and CTA texts that contain raw Akeneo option keys with display labels, using the same color/size kind detection `ob-option-meta` already provides: keys detected as `color` render "Kleur", keys detected as `size` render "Maat", otherwise the key stripped of brackets with underscores humanized and capitalized. Standalone option labels SHALL be capitalized; keys interpolated inside CTA sentences (e.g. `Selecteer [color]`) SHALL be replaced lowercase. The overlay MUST re-apply after WK's async re-renders.

The overlay MUST handle the key in both its bracketed and its bracketless form, since Translate & Adapt may strip the Akeneo brackets before the storefront renders them (`options[shoe_size_eu]` rather than `options[[shoe_size_eu]]`). For the bracketless form the key SHALL be read from the option control's own `name` attribute and substituted only inside that control's label, its placeholder option, its displayed value, and its form's CTA label — never by scanning arbitrary card text, which would corrupt product titles that happen to contain a key word.

In the compact cart drawer / `/cart` cross-sell, a picker whose placeholder is showing SHALL display the bare label ("Kleur", "Maat") rather than WK's full "Selecteer …" sentence, so that two unresolved pickers side by side in a drawer-width row both remain legible instead of ellipsizing. The CTA SHALL keep the full sentence.

#### Scenario: Option group labels
- **WHEN** the wishlist page renders a product card with option groups `[color]` and `[shoe_size_eu]`
- **THEN** the visible group labels read "Kleur" and "Maat"

#### Scenario: CTA interpolation
- **WHEN** no color is selected yet and WK renders the CTA "Selecteer [color]"
- **THEN** the visible CTA reads "Selecteer kleur"

#### Scenario: Bracketless key from Translate & Adapt
- **WHEN** WK renders an option control whose `name` is `options[shoe_size_eu]` (brackets already stripped) and prints `shoe_size_eu` in its label, placeholder and CTA
- **THEN** none of those texts show the raw key, and the product title on the same card is left untouched

#### Scenario: Unresolved compact picker
- **WHEN** a cross-sell card in the cart drawer has neither its color nor its size chosen
- **THEN** the two pickers read "Kleur" and "Maat" in full, while the disabled CTA's accessible label still reads the full "Selecteer kleur" sentence

### Requirement: Cart drawer and cart page wishlist cross-sell
The cart drawer (filled and empty-cart states) and the `/cart` page SHALL render a wishlist cross-sell section: a localized title/heading above WK's wishlist-page element configured compact (product title, price, dropdown option pickers, add-to-cart CTA, move-to-cart). Cards SHALL render as horizontal mini rows (thumbnail, title/price, inline option dropdowns, compact CTA) visually matching OB's shipped `cart-drawer-line-item-layout` cart drawer, not a generic style. The section MUST hide itself entirely when the wishlist is empty or WK hasn't booted. The `/cart` page section SHALL be a standalone custom section wired into `templates/cart.json` (no edit to Dawn's `main-cart-items`). Adding an item from a cross-sell card MUST result in the full cart drawer refreshing and opening (never a single-row patch), showing the new line item and updated totals, with the item removed from the wishlist (move-to-cart).

The compact row SHALL hold this layout in the **no-variant** state an item saved from a PLP card arrives in, where WK renders a disabled CTA and placeholder pickers:

- The CTA SHALL keep its compact square footprint in both its enabled and its disabled state, overriding WK's own full-width disabled sizing.
- The card MUST NOT widen past the drawer's content width; option controls SHALL shrink and ellipsize instead, and a single-value option picker SHALL be hidden rather than consume row width.
- Each option control's resting width SHALL be measured from the text it can actually display, using a measurement that accounts for the rendered font including letter-spacing.

Theme cart code MUST NOT apply its own form-control validation to WK's option controls: invalidating one of them makes WK's add-to-cart form fail interactive validation, which suppresses the `submit` event the move-to-cart intercept depends on and silently disables adding from the cross-sell.

The label overlay and the measured widths MUST survive the cart drawer replacing its own contents wholesale on a cart mutation.

#### Scenario: Drawer cross-sell visible
- **WHEN** the cart drawer opens while the wishlist holds items
- **THEN** the cross-sell section renders at the bottom of the drawer body with compact wishlist cards styled like the rest of the OB cart drawer

#### Scenario: Empty wishlist
- **WHEN** the wishlist holds no items (or WK hasn't booted)
- **THEN** no cross-sell section (including title/heading) is visible in the drawer or on `/cart`

#### Scenario: Move to cart from drawer
- **WHEN** the shopper resolves a variant in a cross-sell card and clicks its add-to-cart CTA
- **THEN** the item is added to the Shopify cart, removed from the wishlist, and the full cart drawer refreshes and opens showing the new line item and updated totals

#### Scenario: Item saved from a PLP card
- **WHEN** the drawer's cross-sell renders an item that was saved from a PLP card and therefore has no variant chosen
- **THEN** its pickers and its disabled CTA sit on one row inside the drawer's width with no horizontal overflow, and choosing every option enables the CTA and resolves a variant id

#### Scenario: Move to cart after a previous cart mutation
- **WHEN** the shopper adds one cross-sell item, and the drawer re-renders, and then works with a second cross-sell card
- **THEN** that card still shows display labels and correctly sized pickers, and its own move-to-cart still adds in-drawer without a page navigation
