## ADDED Requirements

### Requirement: PDP content follows the theme page width
The product section SHALL use the theme's configured page width as its maximum width. At desktop widths its breadcrumb, main media frame, thumbnail rail, gallery counter, information controls, and related-products content SHALL use a 5rem inset aligned with the header logo. Below the desktop breakpoint the section SHALL retain a 2.4rem inset.

#### Scenario: PDP renders on a wide desktop viewport

- **WHEN** the PDP renders at a viewport wider than the configured theme page width
- **THEN** its shell is centred at that configured width and the complete gallery/content chain begins 50px inside the shell on the header logo edge

#### Scenario: PDP columns follow the admin Media width setting

- **WHEN** the PDP renders at the desktop breakpoint or wider
- **THEN** Media Small produces a 40/60 gallery/information split, Medium produces 50/50, and Large produces 60/40
- **AND** the main frame, thumbnail rail, gallery counter, and related-products heading retain one shared leading edge with no horizontal overflow

#### Scenario: PDP image follows the admin Fit setting

- **WHEN** the merchant selects Original or Fill in the Product information section
- **THEN** the main image SHALL use Dawn's corresponding contain or cover behavior without a custom PDP `object-fit` override

#### Scenario: PDP renders below the desktop breakpoint

- **WHEN** the PDP renders below the desktop breakpoint
- **THEN** its content fills the available width less a 24px inset at each edge with no horizontal overflow

## REMOVED Requirements

### Requirement: PDP content is capped independently of the theme page width

**Reason**: The owner reviewed the wider PDP and superseded the earlier Bolt-derived 1280px independent cap.

**Migration**: The PDP now consumes the shared theme page-width value and uses the header's desktop content inset.
