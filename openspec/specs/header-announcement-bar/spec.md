## Purpose

Defines the header's announcement/trust-message bar: optional icons per message, and how many messages are visible at once across mobile, tablet, and desktop.
## Requirements
### Requirement: Announcement messages support an optional icon
Each announcement block SHALL offer an optional icon field, selecting from the theme's shared curated icon set. A block with no icon selected SHALL render text-only, unchanged from current behavior.

#### Scenario: Block has an icon selected
- **WHEN** a merchant selects an icon for an announcement block
- **THEN** that icon renders beside the block's message text, drawn in the section's accent ink

#### Scenario: Block has no icon selected
- **WHEN** a merchant leaves an announcement block's icon unset
- **THEN** the block renders its message text alone, with no icon and no reserved icon space that would misalign the text

### Requirement: Message visibility is breakpoint-aware
The number of announcement messages visible at once SHALL depend on viewport width: one at mobile widths, two at tablet widths, and all configured messages at desktop widths.

#### Scenario: Viewing on mobile
- **WHEN** the bar has 2 or more configured messages and the viewport is below the tablet breakpoint
- **THEN** exactly one message is visible at a time, advanced by the existing prev/next controls

#### Scenario: Viewing on tablet
- **WHEN** the bar has 2 or more configured messages and the viewport is between the tablet and desktop breakpoints
- **THEN** exactly two messages are visible at a time, advanced by the existing prev/next controls

#### Scenario: Viewing on desktop
- **WHEN** the bar has 2 or more configured messages and the viewport is at or above the desktop breakpoint
- **THEN** every configured message is visible at once in a single static row

### Requirement: Desktop shows all messages without scrolling or interaction
At desktop widths, the announcement bar SHALL NOT scroll, auto-rotate, or expose prev/next controls, regardless of the section's auto-rotate setting.

#### Scenario: Desktop with three configured messages
- **WHEN** three announcement blocks are configured and the viewport is at or above the desktop breakpoint
- **THEN** all three render simultaneously, centered, with no slider controls and no motion

#### Scenario: Auto-rotate is enabled but viewport is desktop-width
- **WHEN** the section's auto-rotate setting is on and the viewport is at or above the desktop breakpoint
- **THEN** the bar still does not rotate or scroll — auto-rotate only applies below the desktop breakpoint

### Requirement: Single-message configuration is unaffected
When only one announcement block is configured, the bar SHALL render exactly as it does today: no slider, no controls, at every breakpoint.

#### Scenario: Only one block configured
- **WHEN** exactly one announcement block is configured
- **THEN** it renders as a single static message with no slider markup, at mobile, tablet, and desktop widths
</content>
</invoke>

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

