## Why

The responsive menu now fits reliably, but its wide-desktop position is visually weighted toward the logo and the medium-desktop navigation container does not use the full header width. The compact language code also retains more trailing space than it needs.

## What Changes

- Center the wide middle-left navigation in the available space between the logo and right-side utilities.
- Make the medium-desktop second navigation row span the full header content width while retaining a centered link group.
- Tighten the compact desktop language trigger around its ISO code and caret.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `header-navigation`: refine the documented wide and medium desktop navigation alignment.

## Impact

- `sections/header.liquid`: scoped desktop-grid and compact-language styling.
- `snippets/language-localization.liquid`: marker class for the existing opt-in compact trigger.
- No footer, drawer, customer-account, or navigation-data changes.
