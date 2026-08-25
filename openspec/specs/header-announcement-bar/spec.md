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
