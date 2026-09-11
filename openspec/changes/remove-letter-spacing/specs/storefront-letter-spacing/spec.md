## ADDED Requirements

### Requirement: Theme text renders without positive letter-spacing
Text rendered by the theme SHALL NOT carry positive letter-spacing. The document's base tracking SHALL be `normal`, and every theme stylesheet declaration that would otherwise add tracking — including headings, buttons, badges, form labels, captions, prices, uppercase eyebrows or brand labels, and text wordmark fallbacks for brand logos — SHALL resolve to `normal`. Negative letter-spacing used to tighten large headings SHALL remain allowed.

#### Scenario: Any storefront page is sampled
- **WHEN** the computed `letter-spacing` of every visible text element on the homepage, a collection page, a product page, and `/cart` is sampled
- **THEN** no element rendered by theme CSS reports a positive value

#### Scenario: Uppercase eyebrow, brand label, or badge renders
- **WHEN** an uppercase eyebrow, brand label, or badge renders anywhere in the theme
- **THEN** its computed `letter-spacing` is `normal` (0px), with its uppercase transform, size, and weight unchanged

#### Scenario: Brand renders as a text wordmark
- **WHEN** a brand without a logo file renders its text wordmark fallback
- **THEN** the wordmark carries no positive letter-spacing

#### Scenario: Large heading declares negative tracking
- **WHEN** a heading's component CSS declares a negative letter-spacing
- **THEN** that negative value still applies

### Requirement: Star-rating glyph spacing is the only positive-tracking exception
The only theme CSS permitted to keep positive letter-spacing SHALL be the star-rating glyph row, whose width calculation depends on that spacing and which does not set readable text. New theme CSS SHALL NOT introduce positive tracking on text.

#### Scenario: Rating stars render
- **WHEN** a product rating renders its star row
- **THEN** the star glyph spacing and the row's computed width are unchanged

#### Scenario: A new component adds an eyebrow
- **WHEN** a future component styles uppercase eyebrow or label text
- **THEN** it does not declare positive letter-spacing
