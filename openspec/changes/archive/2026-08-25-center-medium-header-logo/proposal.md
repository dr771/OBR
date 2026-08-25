## Why

At the medium desktop breakpoint the navigation deliberately moves to a second row, but the first row still keeps the logo left-aligned. That leaves an oversized unused center area and makes the header feel unbalanced.

## What Changes

- Center the logo in the complete first header row from 990px through 1499px.
- Keep the utility controls right-aligned and the full-width centered navigation in the second row.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `header-navigation`: state the visual-centering requirement for the logo in the medium desktop first row.

## Impact

- `sections/header.liquid`: medium-desktop grid tracks and logo alignment only.
- No changes to footer, drawer, language behavior, account controls, or navigation data.
