## Why

The middle-left desktop header drops its navigation to a second row below 1500px, although the full-size row only needs ~1430px and a lightly compacted row fits down to ~1230px. Common laptop widths (1280–1440px) therefore get a two-row header they do not need. The owner's preferred order when space runs out: shrink the logo first, then minimally reduce menu font size and spacing — especially the spacing between utility icons — and only then wrap.

## What Changes

- Keep the one-row header from 1250px up (was 1500px).
- 1250–1439px: logo capped at 180px wide (from the configured 230px), logo/navigation/utility gap 2rem → 1.2rem.
- 1250–1379px: additionally, top-level labels 14px → 13px with 0.8rem (was 1.2rem) inline padding, and utility icon targets 4.4rem → 3.6rem wide with unchanged glyph size.
- 990–1249px: the existing two-row layout (centered logo, full-width second-row navigation), unchanged apart from its range.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `header-navigation`: move the one-row/two-row boundary to 1250px and require progressive compaction instead of an early wrap.

## Impact

- `sections/header.liquid`: desktop breakpoints and compaction rules in the inline `<style>` block only.
- The thresholds are measured against the current 8-item main menu and the 230px logo. A longer menu or wider logo needs the thresholds re-measured; below 990px the drawer is unaffected.
