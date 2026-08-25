# footer-proto-chrome Specification

## Purpose

Defines the footer's pixel-matched visual design — layout, typography, spacing, and color — sourced from the approved Bolt proto reference, and the boundary between what was proto-matched and what deliberately stays native Dawn behavior.

## Requirements

### Requirement: Footer background and container match the proto
The footer SHALL use the proto's measured background color and container width, and its column grid SHALL use the proto's measured column counts at each breakpoint.

#### Scenario: Desktop grid
- **WHEN** the footer renders at a desktop viewport (≥1024px)
- **THEN** the column grid SHALL show 5 equal-width tracks with the brand column spanning 2, matching the proto's measured track widths.

#### Scenario: Tablet grid
- **WHEN** the footer renders at a tablet viewport (768–1023px)
- **THEN** the column grid SHALL show 4 equal-width tracks with the brand column spanning 2.

#### Scenario: Mobile grid
- **WHEN** the footer renders at a mobile viewport (<768px)
- **THEN** the column grid SHALL show 2 equal-width tracks with the brand column spanning both (full width).

### Requirement: Column heading and link typography match the proto
Column headings and links SHALL use the proto's measured font size, weight, line height, letter spacing, and color, and links SHALL change color on hover to the proto's measured hover color.

#### Scenario: Link hover state
- **WHEN** a visitor hovers a footer link
- **THEN** its color SHALL change to the proto's measured hover color.

### Requirement: Social icon buttons match the proto when populated
When at least one social media link is configured, the footer's social icon buttons SHALL render as circular outline buttons matching the proto's measured size, border, and hover treatment (filled background, inverted icon color).

#### Scenario: Hovering a social icon button
- **WHEN** a visitor hovers a footer social icon button
- **THEN** its background and border SHALL fill with the proto's measured hover color and its icon SHALL invert to the proto's measured hover icon color.

### Requirement: Native Dawn bottom-bar content is not proto-matched
The footer's bottom bar SHALL keep Dawn's native country/language selectors and native automatic payment-method icons (`shop.enabled_payment_types`) rather than replicating the proto's static payment badges, since the proto's footer has no equivalent localization content to match against.

#### Scenario: Payment icons reflect real gateways
- **WHEN** a visitor views the footer's payment icons
- **THEN** they SHALL reflect the shop's actually-enabled payment methods, not a hardcoded set of badges.
