## ADDED Requirements

### Requirement: Standalone wishlist page aligns with the theme content edge
At desktop widths, the standalone `/apps/wishlist` Swish page SHALL retain the app's 1600px page-width setting and use a 5rem internal inline inset so its product cards and controls align with the header logo edge. This rule SHALL NOT affect cart/drawer wishlist cross-sells or Swish's mobile spacing.

#### Scenario: Wishlist renders on a wide desktop viewport

- **WHEN** the standalone wishlist page renders wider than the configured 1600px page width
- **THEN** its outer shell remains 1600px and its first product card begins on the same 50px inner edge as the header logo

#### Scenario: Wishlist renders in another surface or below desktop

- **WHEN** a wishlist component renders in the cart/drawer or the standalone page renders below 990px
- **THEN** the new desktop standalone-page inset does not apply
