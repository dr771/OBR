## ADDED Requirements

### Requirement: Mobile PDP purchase controls stay available while scrolling
Below the PDP mobile breakpoint, the existing product-form add-to-cart and wishlist controls SHALL remain visible in a fixed bottom panel with safe-area spacing. The controls SHALL use the native product form and the existing Wishlist King toggle, so variant availability, loading state, cart updates, and wishlist state follow the inline controls without a separate purchase path. Content SHALL remain reachable above the panel. On wider viewports, the controls SHALL remain in the information column.

#### Scenario: Shopper scrolls the mobile PDP
- **WHEN** a shopper scrolls past the product information on a narrow viewport
- **THEN** the add-to-cart and wishlist controls remain visible at the bottom, and the final page content can be scrolled above them

#### Scenario: Variant becomes unavailable
- **WHEN** a shopper selects an unavailable size
- **THEN** the fixed add-to-cart control shows the native disabled state and cannot add that variant

#### Scenario: Overlay opens
- **WHEN** the cart drawer or mobile menu is open
- **THEN** the purchase panel does not cover the overlay
