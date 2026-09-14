## Why

The homepage "Uitgelichte merken" grid still shows hand-styled text wordmarks, while the brand marquee directly under the hero and the Merken chips now show each brand's real logo at an optically normalized size. The owner approved that logo treatment and wants it in the featured-brands grid too, as its own component, with the text grid kept around as a fallback rather than deleted.

## What Changes

- New section `sections/ob-home-brand-logos.liquid` + `assets/component-ob-home-brand-logos.css`: the same bordered 6 + 5 card grid (eyebrow, heading, subheading, brand name + one-line description), but each card shows the brand's real logo via `snippets/ob-brand-logotype.liquid`, sized by that logo's `--ob-logo-scale` multiplier, grayscale at rest and full color on card hover/focus — the marquee's treatment.
- `templates/index.json`: the new section takes the old grid's slot in the homepage order with the identical 11 blocks and copy.
- The old text-wordmark section (`sections/ob-home-brands.liquid`) is **archived, not removed**: its file stays in the theme and its instance stays in `templates/index.json` with `"disabled": true`, so it can be switched back on from the theme editor in one click.
- The per-logo optical-size normalization (shipped earlier today for the marquee and Merken chips, but never written down) is recorded as a requirement.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `homepage-sections`: the featured-brands grid requirement changes from text wordmarks to real logos in a dedicated section, with the text grid kept as a disabled fallback; adds a requirement that brand logos on the homepage are optically size-normalized per logo.

## Impact

- New: `sections/ob-home-brand-logos.liquid`, `assets/component-ob-home-brand-logos.css`.
- Modified: `templates/index.json` (merchant-editable — pushed via `scripts/theme-push.sh`), `sections/ob-home-brands.liquid` (comment only, marking it archived).
- Reused unchanged: `snippets/ob-brand-logotype.liquid` (logo assets + `--ob-logo-scale`), `component-ob-merken.css` (only for Sneaker Lab's text-fallback `.ob-lt-*` classes).
- No shop-side dependency; nothing for MIGRATION-TO-LIVE.md.
