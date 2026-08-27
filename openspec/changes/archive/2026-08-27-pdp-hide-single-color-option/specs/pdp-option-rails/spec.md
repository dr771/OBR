## MODIFIED Requirements

### Requirement: Recognized color and size options use independent single-row rails
When the PDP option-rail variation is enabled, every recognized color option with two or more values and every recognized size option SHALL render in its own horizontal single-row rail. The rail SHALL preserve the existing radio-backed option controls, selected state, availability state, option values, and Dawn variant-resolution behavior. Unrecognized generic options SHALL retain their configured presentation. A recognized color option with exactly one value SHALL NOT render a fieldset, legend, or rail on the PDP — there is no choice to present. This exception is scoped to the PDP option-rail picker only: PLP card swatches and the cart drawer's variant line-item display SHALL continue to show a single-value color exactly as they do today, unaffected by this requirement.

#### Scenario: Product has color and size options
- **WHEN** a PDP has recognized color and size axes, and the color axis has two or more values
- **THEN** each axis renders in a separate one-row rail and selection continues to resolve the corresponding Shopify variant

#### Scenario: Generic option accompanies a rail-supported option
- **WHEN** a product also has an unrecognized generic option configured as a dropdown
- **THEN** that generic option remains a dropdown and does not receive rail controls

#### Scenario: Product has exactly one color value
- **WHEN** a PDP's recognized color option has exactly one value
- **THEN** no fieldset, legend, or rail renders for that color option on the PDP, while a recognized size option on the same product continues to render its own rail normally

#### Scenario: Single-value color still shown elsewhere
- **WHEN** a product with exactly one color value is rendered as a PLP card or in the cart drawer's line-item options
- **THEN** that surface continues to display the single color exactly as before — this requirement's PDP exception does not apply there
