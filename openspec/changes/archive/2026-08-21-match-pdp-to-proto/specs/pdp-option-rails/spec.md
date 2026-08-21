## MODIFIED Requirements

### Requirement: Color and size targets retain their compact visual hierarchy
Color chips SHALL be 4.8rem square with a 0.8rem radius and a 0.4rem inset around their image. An unselected chip SHALL carry a hairline border; the selected chip SHALL carry a full-ink border reinforced by a 1px ring. Recognized size labels SHALL retain the responsive sizing defined by `pdp-size-picker-grid`. Theme foreground, background, and duration variables SHALL drive rail chrome rather than brand-specific values.

#### Scenario: Shopper views the picker on tablet width

- **WHEN** a product has both recognized color and size options in a narrow/tablet product-information column
- **THEN** color chips are 4.8rem square, so color choices do not read smaller than size choices

#### Scenario: Shopper selects a color

- **WHEN** a shopper selects a color chip
- **THEN** that chip alone carries the full-ink border and ring, while every other chip keeps its hairline border
