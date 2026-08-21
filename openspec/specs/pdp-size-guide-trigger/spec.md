# pdp-size-guide-trigger Specification

## Purpose
Defines the size-guide entry point beside the PDP size label, so the affordance ships and is positioned correctly ahead of the measurement tables that will eventually fill it.
## Requirements
### Requirement: Recognized size options carry a size-guide trigger
A recognized size option's label row SHALL carry a size-guide trigger at its end. The trigger SHALL be a button, not a bare link, and SHALL be rendered only for recognized size options.

#### Scenario: Footwear product renders its size picker

- **WHEN** a product has a recognized size option
- **THEN** a size-guide trigger sits at the end of that option's label row, opposite its `Label: value` text

#### Scenario: Product has only a colour option

- **WHEN** a product has no recognized size option
- **THEN** no size-guide trigger is rendered anywhere in the information column

#### Scenario: Product has an unrecognized generic option

- **WHEN** a product has a generic option that is not a recognized size
- **THEN** that option's label row does not receive a size-guide trigger

### Requirement: Trigger presentation follows the approved reference
The trigger SHALL render its localized label at 1.2rem on a 1.6rem line at medium weight in muted ink, preceded by a 1.4rem ruler glyph at 0.6rem separation, underlined at a 4px offset. Hover and keyboard focus SHALL each darken it to full ink with a visible focus indicator.

#### Scenario: Trigger renders beside the size label

- **WHEN** a recognized size option renders
- **THEN** the trigger's glyph and label share one centre line and match the reference's size, weight, colour and underline offset

#### Scenario: Keyboard user reaches the trigger

- **WHEN** keyboard focus lands on the trigger
- **THEN** a visible focus indicator appears without removing the underline

### Requirement: Trigger degrades safely until measurement tables exist
The trigger SHALL always render for a recognized size option, so its placement and treatment are final ahead of the data. Until size tables are supplied it SHALL open a panel stating that the guide is not yet available, and SHALL never open a blank panel.

#### Scenario: No size table is configured for the product's size family

- **WHEN** a shopper activates the trigger for a size family with no configured table
- **THEN** a panel opens carrying the size-guide heading, a dismiss control, and a message that the guide is coming — never an empty panel

#### Scenario: Size table is later supplied

- **WHEN** a measurement table becomes available for a size family
- **THEN** the trigger opens that table for products in that family, without its position or presentation changing
