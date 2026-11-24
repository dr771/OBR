## ADDED Requirements

### Requirement: Announcement messages can follow a campaign's run time
Each announcement block SHALL offer an optional campaign collection setting. A block linked to a collection SHALL be visible only inside that collection's run time as defined by its `custom.campaign_starts_at` / `custom.campaign_ends_at` metafields (unset start = started, unset end = open-ended), evaluated at render time and again against the shopper's clock in the browser. A block without a linked collection SHALL always be visible, unchanged from current behavior. The linked collection only lends its run time; it SHALL NOT need the `actie-` prefix or a badge text.

#### Scenario: Linked campaign is running
- **WHEN** a block is linked to a collection whose run time contains the current time
- **THEN** the block's message is visible

#### Scenario: Linked campaign has ended
- **WHEN** a block is linked to a collection whose end has passed, including on a page served from cache
- **THEN** the block's message is not visible

#### Scenario: Linked campaign has not started
- **WHEN** a block is linked to a collection whose start is in the future
- **THEN** the block's message is not visible until the start, without requiring a new deployment

#### Scenario: Block has no linked collection
- **WHEN** a block's campaign setting is empty
- **THEN** the block is visible at all times

### Requirement: A bar with no message in its run time renders nothing
When none of a bar's blocks is currently visible, the announcement-bar section SHALL occupy no space: no empty strip, no line separator, no slider controls.

#### Scenario: Promo bar outside every campaign
- **WHEN** every block of an announcement-bar section is linked to a campaign that is not running
- **THEN** the section takes up no height and the header sits where it would without that section

### Requirement: Visibility rules count only messages in their run time
The breakpoint-aware visibility rules and the single-message rule SHALL apply to the messages currently visible, not to the configured block count. Messages outside their run time SHALL NOT occupy a slide, a column or a slider position.

#### Scenario: Three blocks, one in its run time
- **WHEN** three blocks are configured and only one is currently visible
- **THEN** the bar shows that message alone, with no slider controls, at every breakpoint

#### Scenario: Three blocks, two in their run time on mobile
- **WHEN** two of three blocks are visible and the viewport is below the tablet breakpoint
- **THEN** the slider cycles between those two messages only
