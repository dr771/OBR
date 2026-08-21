# pdp-option-rails Specification

## Purpose
Defines an accessible, skin-agnostic single-row rail for recognized PDP color and size options, including understated overflow discovery and a complete rollback path.
## Requirements
### Requirement: Recognized color and size options use independent single-row rails
When the PDP option-rail variation is enabled, every recognized color option and every recognized size option SHALL render in its own horizontal single-row rail. The rail SHALL preserve the existing radio-backed option controls, selected state, availability state, option values, and Dawn variant-resolution behavior. Unrecognized generic options SHALL retain their configured presentation.

#### Scenario: Product has color and size options
- **WHEN** a PDP has recognized color and size axes
- **THEN** each axis renders in a separate one-row rail and selection continues to resolve the corresponding Shopify variant

#### Scenario: Generic option accompanies a rail-supported option
- **WHEN** a product also has an unrecognized generic option configured as a dropdown
- **THEN** that generic option remains a dropdown and does not receive rail controls

### Requirement: Overflow is discoverable without persistent visual noise
The PDP SHALL provide a thin visible scrollbar for each rail and SHALL show directional edge fades and chevrons only when the rail has undiscovered content in that direction. It SHALL hide those directional cues at the respective start or end edge, and SHALL show no chevrons or fades for a non-overflowing rail.

#### Scenario: More color choices exist off-screen
- **WHEN** a color rail overflows its container at its initial scroll position
- **THEN** its next chevron and end fade are visible, while its previous chevron and start fade are hidden

#### Scenario: Shopper reaches the final size
- **WHEN** the shopper scrolls a size rail to its end
- **THEN** its next chevron and end fade are hidden and its previous chevron remains available

#### Scenario: All choices fit
- **WHEN** every color or size choice fits within its rail container
- **THEN** no rail chevrons or fades are displayed

### Requirement: Rail controls remain accessible and motion-aware
Rail chevrons SHALL be buttons with localized accessible labels identifying their direction and option family. Activating a chevron SHALL advance or retreat the rail by a useful group of choices. After a shopper selects an option outside the currently visible region, the rail SHALL reveal that selected control. Enhanced scrolling SHALL respect reduced-motion preferences.

#### Scenario: Keyboard user activates more colors
- **WHEN** keyboard focus activates the “Meer kleuren tonen” button
- **THEN** the color rail advances and its cue states update to reflect the new scroll position

#### Scenario: Variant update selects an off-screen size
- **WHEN** a Dawn variant update checks a size radio outside the visible rail area
- **THEN** the selected size is scrolled into the visible portion of its rail

### Requirement: Color and size targets retain their compact visual hierarchy
Color chips SHALL be 4.8rem square with a 0.8rem radius and a 0.4rem inset around their image. An unselected chip SHALL carry a hairline border; the selected chip SHALL carry a full-ink border reinforced by a 1px ring. Recognized size labels SHALL retain the responsive sizing defined by `pdp-size-picker-grid`. Theme foreground, background, and duration variables SHALL drive rail chrome rather than brand-specific values.

#### Scenario: Shopper views the picker on tablet width

- **WHEN** a product has both recognized color and size options in a narrow/tablet product-information column
- **THEN** color chips are 4.8rem square, so color choices do not read smaller than size choices

#### Scenario: Shopper selects a color

- **WHEN** a shopper selects a color chip
- **THEN** that chip alone carries the full-ink border and ring, while every other chip keeps its hairline border

### Requirement: The complete rail variation can be disabled at picker scope
The single-row rail variation SHALL be controlled by one picker-scoped switch. When disabled, it SHALL load neither rail controls nor rail JavaScript and SHALL restore wrapping color swatches and the responsive multi-row size grid.

#### Scenario: Maintainer disables the variation
- **WHEN** the picker-scoped rail switch is set to false
- **THEN** color options wrap using their prior presentation, recognized sizes use the `pdp-size-picker-grid` grid, and no rail chevrons are rendered
