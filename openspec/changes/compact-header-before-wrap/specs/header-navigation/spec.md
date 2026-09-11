## MODIFIED Requirements

### Requirement: Middle-left header navigation has deliberate responsive rows
When the store uses the middle-left desktop header with a populated menu, every top-level menu item and its label SHALL remain on one unbroken inline navigation row at viewport widths of 1250px and above. That one-row navigation SHALL be centered in the horizontal space between the logo and right-side utility controls. As the one-row header narrows, it SHALL compact progressively rather than wrap: from 1250px through 1439px the logo SHALL render no wider than 180px and the gap between logo, navigation, and utility controls SHALL tighten; from 1250px through 1379px the top-level labels SHALL additionally use a slightly smaller font size and inline padding, and the utility icon targets SHALL narrow without shrinking their icon glyphs. At 1440px and above the header SHALL use its configured logo width and standard spacing. From 990px through 1249px, the logo SHALL be visually centered in the complete first header row, the utility controls SHALL remain right-aligned, and the complete navigation container SHALL span the full header content width on a second row with its top-level link group centered inside that row. Below 990px, the existing header drawer SHALL provide the menu. Individual top-level menu items or labels MUST NOT wrap into a partial additional row.

#### Scenario: Wide desktop navigation
- **WHEN** the viewport is 1440px or wider
- **THEN** every configured top-level navigation item appears in the one-row desktop navigation centered between the full-size logo and utility controls

#### Scenario: Compact one-row desktop navigation
- **WHEN** the viewport is from 1250px through 1439px
- **THEN** the logo renders no wider than 180px and every configured top-level navigation item still appears in one row without overflow
- **AND** from 1250px through 1379px the navigation labels and utility icon spacing are additionally reduced while icon glyphs keep their size

#### Scenario: Medium desktop navigation
- **WHEN** the viewport is from 990px through 1249px
- **THEN** the logo is centered across the first header row, utilities stay right-aligned, and every configured top-level navigation item appears together in a full-width second-row navigation container with centered links

#### Scenario: Tablet drawer navigation
- **WHEN** the viewport is narrower than 990px
- **THEN** the inline desktop navigation is unavailable and the existing header drawer exposes every configured top-level navigation item
