## ADDED Requirements

### Requirement: PDP color rail offers only colors that can be bought
When a product has at least one available variant, the PDP color rail SHALL omit every color that has no available variant in any size, except the currently selected color, which SHALL stay visible and selected. Availability SHALL be judged per color across all sizes, never by the currently selected size. The single-value color exception SHALL count the colors that remain offered: when fewer than two remain, no color fieldset, legend or rail SHALL render. A product with no available variant SHALL keep every color. After the shopper selects another color, the page's re-rendered rail SHALL follow the same rule for the new selection.

#### Scenario: A color is sold out in every size
- **WHEN** a PDP opens on a product whose Lime color has no available variant and whose Black color has one
- **THEN** the color rail shows Black and omits Lime

#### Scenario: A color is available only in another size
- **WHEN** size L/XL is selected and the Anthracite color is available only in XS/M
- **THEN** Anthracite stays in the color rail

#### Scenario: Linked to a sold-out color
- **WHEN** a PDP opens through a link naming a variant of a color with no available variant
- **THEN** that color is visible and selected in the rail, and the other sold-out colors are omitted

#### Scenario: One color left
- **WHEN** only one color has an available variant and it is selected
- **THEN** no color fieldset, legend or rail renders, and the size rail renders normally

#### Scenario: Whole product is sold out
- **WHEN** a PDP opens on a product with no available variant
- **THEN** every color renders in the rail as before
