## ADDED Requirements

### Requirement: Theme text renders without positive letter-spacing
Text rendered by the theme SHALL NOT carry positive letter-spacing, except where the exceptions requirement below allows it. The document's base tracking SHALL be `normal`, and every theme stylesheet declaration that would otherwise add tracking — including headings, buttons, badges, form labels, captions, prices, brand labels, card and tile labels, and text wordmark fallbacks for brand logos — SHALL resolve to `normal`. Negative letter-spacing used to tighten large headings SHALL remain allowed.

#### Scenario: Any storefront page is sampled
- **WHEN** the computed `letter-spacing` of every visible text element on the homepage, a collection page, a product page, and `/cart` is sampled
- **THEN** the only positive values come from section eyebrows and the star-rating row

#### Scenario: Brand label or badge renders
- **WHEN** a card or PDP brand label, a card badge, or a hero/promo badge renders anywhere in the theme
- **THEN** its computed `letter-spacing` is `normal` (0px), with its uppercase transform, size, and weight unchanged

#### Scenario: Brand renders as a text wordmark
- **WHEN** a brand without a logo file renders its text wordmark fallback
- **THEN** the wordmark carries no positive letter-spacing

#### Scenario: Large heading declares negative tracking
- **WHEN** a heading's component CSS declares a negative letter-spacing
- **THEN** that negative value still applies

### Requirement: Positive tracking is limited to section eyebrows and the star-rating row
Positive letter-spacing SHALL be permitted only on:
- **Section eyebrows**: the small uppercase kicker line that introduces a section heading, such as the homepage "Uitgelichte merken", bestsellers, occasions, and newsletter eyebrows (`0.336rem`) and the `/cart` page-header and summary eyebrows (`0.24rem`).
- **The star-rating glyph row**: its width calculation depends on that spacing, and it is not readable text.

Labels that sit on a card, tile, or floating info card (such as the Merken tile category or the hero's floating-card label) are not section eyebrows and SHALL stay at `normal`. New theme CSS SHALL NOT introduce positive tracking outside these two cases.

#### Scenario: Homepage section eyebrow renders
- **WHEN** the "Uitgelichte merken" section, or another homepage or `/cart` section with an eyebrow, renders
- **THEN** its eyebrow keeps its wide uppercase tracking

#### Scenario: Rating stars render
- **WHEN** a product rating renders its star row
- **THEN** the star glyph spacing and the row's computed width are unchanged

#### Scenario: A new component adds a card label
- **WHEN** a future component styles uppercase label text that is not a section eyebrow
- **THEN** it does not declare positive letter-spacing
