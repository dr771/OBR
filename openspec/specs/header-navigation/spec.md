# header-navigation Specification

## Purpose
Defines a complete and responsive Original Brands header navigation that preserves category discovery while keeping localization and account controls usable.
## Requirements
### Requirement: Middle-left header navigation has deliberate responsive rows
When the store uses the middle-left desktop header with a populated menu, every top-level menu item and its label SHALL remain on one unbroken inline navigation row at viewport widths of 1500px and above. That wide navigation SHALL be centered in the horizontal space between the logo and right-side utility controls. From 990px through 1499px, the logo SHALL be visually centered in the complete first header row, the utility controls SHALL remain right-aligned, and the complete navigation container SHALL span the full header content width on a second row with its top-level link group centered inside that row. Below 990px, the existing header drawer SHALL provide the menu. Individual top-level menu items or labels MUST NOT wrap into a partial additional row.

#### Scenario: Wide desktop navigation
- **WHEN** the viewport is 1500px or wider
- **THEN** every configured top-level navigation item appears in the one-row desktop navigation centered between the logo and utility controls

#### Scenario: Medium desktop navigation
- **WHEN** the viewport is from 990px through 1499px
- **THEN** the logo is centered across the first header row, utilities stay right-aligned, and every configured top-level navigation item appears together in a full-width second-row navigation container with centered links

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

### Requirement: Desktop main navigation communicates hover and current-page state
At viewport widths of 990px and above, each top-level desktop navigation label SHALL darken on hover and reveal a 2px primary-blue underline that animates from zero to the label width over 300ms. The current page's top-level menu label, including a parent with an active child page, SHALL retain that same full-width primary-blue underline without relying on default text decoration. Keyboard focus SHALL receive the same visual underline while retaining the theme's existing focus treatment. Drawer and submenu navigation SHALL retain their existing behavior.

#### Scenario: Hovering a desktop top-level link
- **WHEN** a visitor hovers a top-level desktop navigation link
- **THEN** its label darkens and a 2px primary-blue underline expands from its leading edge to its label width over 300ms

#### Scenario: Current desktop navigation item
- **WHEN** the current page belongs to a top-level desktop navigation item
- **THEN** that item's label displays the same full-width primary-blue underline without default text decoration

#### Scenario: Keyboard focus
- **WHEN** keyboard focus reaches a top-level desktop navigation item
- **THEN** the item retains the existing focus treatment and displays the same underline cue

#### Scenario: Mobile and submenu navigation
- **WHEN** the navigation renders in the drawer or a desktop submenu
- **THEN** this desktop main-menu state styling does not change its existing behavior
