## Purpose

Defines a complete and responsive Original Brands header navigation that preserves category discovery while keeping localization and account controls usable.

## ADDED Requirements

### Requirement: Middle-left header navigation has deliberate responsive rows
When the store uses the middle-left desktop header with a populated menu, every top-level menu item and its label SHALL remain on one unbroken inline navigation row at viewport widths of 1500px and above. From 990px through 1499px, the complete navigation SHALL occupy one centered second row below the logo and utility controls. Below 990px, the existing header drawer SHALL provide the menu. Individual top-level menu items or labels MUST NOT wrap into a partial additional row.

#### Scenario: Wide desktop navigation
- **WHEN** the viewport is 1500px or wider
- **THEN** every configured top-level navigation item appears in the one-row desktop navigation

#### Scenario: Medium desktop navigation
- **WHEN** the viewport is from 990px through 1499px
- **THEN** the logo and utilities occupy the first header row and every configured top-level navigation item appears together in one centered second row

#### Scenario: Tablet drawer navigation
- **WHEN** the viewport is narrower than 990px
- **THEN** the inline desktop navigation is unavailable and the existing header drawer exposes every configured top-level navigation item

### Requirement: Desktop language trigger uses a compact current-language code
When the desktop header language selector is available, its closed trigger SHALL display the current language's uppercase ISO code and expose the full current language name as its accessible label. The selector's available-language choices SHALL retain their full endonym names. Footer, announcement-bar, and mobile-drawer language selectors SHALL retain their full current-language names.

#### Scenario: Dutch desktop header
- **WHEN** Dutch is the current language and the desktop header selector is visible
- **THEN** its visible trigger reads `NL`, its accessible name identifies Nederlands, and its picker choices retain full language names

#### Scenario: Shared picker outside the desktop header
- **WHEN** the language selector renders in the footer, announcement bar, or mobile drawer
- **THEN** its visible current-language label remains the full endonym

### Requirement: Customer account icon is independently configurable
The header SHALL provide a merchant setting that controls whether its inline customer-account icon is rendered, defaulting to hidden. This setting SHALL not change customer-account availability or Dawn's signed-in-avatar choice. When the inline icon is hidden and the header drawer is active, the drawer SHALL expose the Login/account link.

#### Scenario: Default account-icon state
- **WHEN** a header uses no stored value for the new setting
- **THEN** the inline customer-account icon is absent and the wishlist heart remains visible immediately before the cart icon

#### Scenario: Merchant enables account icon
- **WHEN** the merchant enables the customer-account icon setting and customer accounts are available
- **THEN** the inline account icon renders and continues to use the configured signed-in avatar behavior

#### Scenario: Drawer preserves account access
- **WHEN** the customer-account icon setting is disabled at a viewport narrower than 990px
- **THEN** the header drawer includes the Login/account link
