## MODIFIED Requirements

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
