## REMOVED Requirements

### Requirement: Native Dawn bottom-bar content is not proto-matched
**Reason**: Split into two separate concerns that no longer share one requirement — the bottom bar's localization selectors stay native (unchanged behavior, restated below), while payment icons moved out of the bottom bar entirely into the brand column with proto-matched styling (see the new payment-badge requirements below).
**Migration**: No consumer depends on the old requirement text. The bottom-bar localization behavior it described is preserved verbatim in "Native Dawn bottom-bar localization is not proto-matched" below; the payment-icon behavior it described is replaced by the two payment-badge requirements below.

#### Scenario: Payment icons reflect real gateways
- **WHEN** a visitor views the footer's payment icons
- **THEN** they SHALL reflect the shop's actually-enabled payment methods, not a hardcoded set of badges.

## ADDED Requirements

### Requirement: Native Dawn bottom-bar localization is not proto-matched
The footer's bottom bar SHALL keep Dawn's native country/language selectors rather than replicating the proto's localization content, since the proto's footer has no equivalent localization content to match against.

#### Scenario: Localization selectors stay native
- **WHEN** a visitor views the footer's bottom bar
- **THEN** the country/language selectors SHALL render as Dawn's native controls, not a proto-derived replacement.

### Requirement: Payment badges are proto-matched and positioned in the brand column
The footer's brand column SHALL render payment method badges directly below the tagline, in the same position `social-icons` would occupy, styled to match the Bolt proto's payment badge chrome (white background, `1px solid rgb(203,213,225)` border, `0.6rem` border-radius, `10px/600` text, `rgb(51,65,85)` text color, `0.6rem` gap between badges), capped at 5 badges, with no visible text label — an accessible label SHALL be present only as visually-hidden text.

#### Scenario: Badge row renders in the brand column
- **WHEN** a visitor views the footer's brand column
- **THEN** the payment badge row SHALL appear directly below the tagline, left-aligned, with no more than 5 badges and no visible "payment methods" label.

### Requirement: Payment badge set reflects real enabled gateways when configured
The payment badge row's content SHALL be sourced from `shop.enabled_payment_types` whenever the shop has at least one real payment gateway enabled, mapping each type to short display text (for example `visa` → VISA, `master` → MC, `ideal` → iDEAL, `paypal` → PayPal), rather than a hardcoded set. Only while no real gateway is configured MAY a temporary hardcoded preview set stand in so the row has content to review.

#### Scenario: Real gateway types take over from the preview set
- **WHEN** `shop.enabled_payment_types` is non-empty
- **THEN** the payment badge row SHALL render exactly those enabled types, mapped to display text, and the hardcoded preview set SHALL NOT be used.

#### Scenario: No real gateway configured yet
- **WHEN** `shop.enabled_payment_types` is empty
- **THEN** the payment badge row MAY render a hardcoded preview set of payment type badges instead of rendering nothing.
