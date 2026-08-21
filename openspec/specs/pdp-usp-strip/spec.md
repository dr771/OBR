# pdp-usp-strip Specification

## Purpose
Defines the editor-configurable trust strip in the PDP information column, which restates the shop's delivery and service promises at the moment of decision without hard-coding claims into the theme.
## Requirements
### Requirement: PDP renders a configurable USP strip below the buy controls
The PDP SHALL render a strip of short trust statements directly below the add-to-cart row, bounded above and below by 1px hairline rules with 2rem of vertical padding. Each statement SHALL pair an icon with its text. The strip SHALL be omitted entirely when no statement is configured.

#### Scenario: Two statements are configured

- **WHEN** the strip has two configured statements
- **THEN** both render between the hairline rules, two per row at desktop widths and one per row below them

#### Scenario: No statements are configured

- **WHEN** every statement is left empty
- **THEN** neither the strip nor its hairline rules are rendered, and the surrounding spacing closes up

### Requirement: Statement text and icon are set in the theme editor
Each statement's text and its icon SHALL be editable in the theme editor without code changes, and the text SHALL be translatable. The theme SHALL NOT hard-code a claim that cannot be changed by a merchant.

#### Scenario: Merchant changes a delivery threshold

- **WHEN** a merchant edits a statement's text in the theme editor
- **THEN** the new text renders on the PDP without a theme deployment

#### Scenario: Merchant selects a different icon

- **WHEN** a merchant picks another icon for a statement
- **THEN** that icon renders at 2rem in the accent ink beside its text

### Requirement: Statement presentation follows the approved reference
Statement text SHALL render at 1.4rem on a 2rem line in the secondary ink, with 1.2rem between an icon and its text and 1.2rem between statements. Icons SHALL be 2rem square, drawn in the accent ink, and hidden from assistive technology so the text alone is announced.

#### Scenario: Strip renders on desktop

- **WHEN** the strip renders at desktop width
- **THEN** its statements sit two per row with the reference's colours, sizes and gaps, and each icon is vertically centred against its text

#### Scenario: Screen reader reaches the strip

- **WHEN** a screen reader encounters a statement
- **THEN** only its text is announced, without a decorative icon being read
