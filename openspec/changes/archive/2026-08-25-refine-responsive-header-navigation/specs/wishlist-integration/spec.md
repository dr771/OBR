## MODIFIED Requirements

### Requirement: Header wishlist heart with count badge
The header SHALL render a heart icon link to `/apps/wishlist` in the icon row immediately before the cart icon, on all viewports, styled like Dawn's `header__icon` controls, with a localized accessible label. When the optional account icon is rendered, the heart SHALL follow it and remain before cart. The link SHALL carry `wk-skip` so WK does not inject its own component into it. A count badge (visually consistent with Dawn's cart bubble) SHALL show the wishlist item count, driven by WK's reactive wishlist state (including optimistic updates), hidden entirely at count 0 and before WK boots.

#### Scenario: Badge reflects wishlist count
- **WHEN** WK has booted and the wishlist contains 3 items
- **THEN** the header heart shows a badge with "3", and adding/removing an item updates the badge without a page reload

#### Scenario: WK not yet loaded
- **WHEN** the page is in the pre-boot window of the WK lazy-init (or WK fails to load)
- **THEN** the heart link still renders and navigates to `/apps/wishlist`, with no badge shown

#### Scenario: Optional account icon is absent
- **WHEN** the customer-account icon is disabled
- **THEN** the heart remains immediately before the cart icon without an empty account-control gap
