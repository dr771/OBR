# pdp-layout-chrome Specification

## Purpose
Defines the PDP section shell and information-column presentation — content width, two-column split, type scale, block separation, add-to-cart row, and the collapsible detail stack — so a shopper crossing from a collection grid into a product page stays inside one design system.
## Requirements
### Requirement: PDP content is capped independently of the theme page width
The product section SHALL constrain its content to a 128rem maximum width with a 2.4rem inset at each page edge, independent of the theme's configured page width. The theme's page-width setting SHALL NOT be modified to achieve this.

#### Scenario: PDP renders on a wide desktop viewport

- **WHEN** the PDP renders at a viewport wider than 128rem
- **THEN** its content is centred at 128rem with 2.4rem of inset, while collection pages keep their own wider inset behaviour

#### Scenario: PDP renders below the cap

- **WHEN** the PDP renders at a viewport narrower than 128rem
- **THEN** its content fills the available width less the 2.4rem inset at each edge

### Requirement: Desktop PDP uses an asymmetric two-column split
At desktop widths the product section SHALL place media and product information in two columns proportioned `1.12` to `0.88`, separated by a 5.6rem gutter, with the information column never narrower than 40rem. Below the desktop breakpoint the columns SHALL stack with media first.

#### Scenario: Product renders at desktop width

- **WHEN** the PDP renders at a 1440px viewport
- **THEN** the media column is wider than the information column, 56px separates them, and the information column is at least 400px wide

#### Scenario: Product renders on mobile

- **WHEN** the PDP renders at a 390px viewport
- **THEN** media and information stack in a single column with media first and no horizontal page overflow

### Requirement: Information-column typography follows the approved reference
The brand line, product title, and price SHALL render at the approved reference's measured scale: the brand line uppercase at 1.1rem with 2.75px tracking and semibold weight in the muted ink, the title at 4.8rem on a 4.8rem line in the heading family at semibold weight with -0.48px tracking, and the price at 2rem on a 2.8rem line at semibold weight.

#### Scenario: Product information renders

- **WHEN** a product with a vendor renders its title and price
- **THEN** the brand line sits above the title, and brand, title, and price each match the reference's size, weight, line height, tracking, and colour

#### Scenario: Heading weight has a loaded face

- **WHEN** the title declares a semibold weight in the heading family
- **THEN** a matching semibold face is loaded, so the title does not silently fall back to a lighter rendered weight

### Requirement: Option blocks are separated by hairline rules
Each recognized option block SHALL be preceded by a 1px hairline rule with 2.8rem of separation above it and 2.4rem of padding below it, and SHALL open with a label row pairing the option name with its currently selected value in muted ink.

#### Scenario: Product has colour and size options

- **WHEN** a PDP renders both a recognized colour and a recognized size option
- **THEN** each block is preceded by its own hairline rule and opens with a `Label: value` row naming the current selection

#### Scenario: Shopper changes a selection

- **WHEN** a shopper selects a different value for an option
- **THEN** that block's label row updates to name the newly selected value

### Requirement: Add-to-cart row uses the approved primary treatment
The add-to-cart control SHALL be 5.6rem tall with a fully rounded radius, the primary ink background, and semibold 1.4rem label text. It SHALL share its row with the wishlist control, which retains its existing position after the button and SHALL be a 5.6rem circle with a hairline border, matching the button's height and radius language. No quantity control SHALL be rendered in this row.

#### Scenario: Shopper views the buy row

- **WHEN** the PDP renders its buy controls
- **THEN** the add-to-cart button fills the remaining row width at 56px tall with a pill radius, the wishlist control sits after it as a 56px circle sharing the button's centre line, and no quantity stepper is present

#### Scenario: Wishlist app is unavailable

- **WHEN** the wishlist integration is absent or has not booted
- **THEN** the add-to-cart button still occupies the row correctly without a gap where the wishlist control would sit

### Requirement: Configured collapsible detail panels use the reference treatment
Where collapsible detail panels are configured for a product, they SHALL render as a stack, each closed by a 1px hairline bottom rule, with triggers at 1.4rem semibold on 1.6rem vertical padding and bodies at 1.4rem on a 2.275rem line in muted ink, and each trigger SHALL carry a chevron that reflects its panel's state. A product with no collapsible panels configured SHALL render its description as plain body copy without an empty panel or a stray rule.

Note: the reference shows four named panels (`Productdetails`, `Materiaal & onderhoud`, `Pasvorm & maatadvies`, `Bezorging & retour`). Their copy is merchant content that does not exist yet, so this change ships the treatment and leaves the panels unconfigured rather than inventing product claims.

#### Scenario: Product has collapsible panels configured

- **WHEN** a product's PDP renders one or more configured collapsible panels
- **THEN** each carries the reference's rule, trigger type and chevron, and toggling one updates its chevron

#### Scenario: Product has no collapsible panels configured

- **WHEN** a product has only a description and no collapsible panels
- **THEN** the description renders as plain body copy and no empty panel or orphaned hairline rule appears

#### Scenario: Keyboard user operates a panel

- **WHEN** a keyboard user focuses and activates a panel trigger
- **THEN** the panel toggles, the trigger exposes its expanded state to assistive technology, and focus remains on the trigger
