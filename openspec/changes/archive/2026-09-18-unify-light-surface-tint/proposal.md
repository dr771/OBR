## Why

The homepage carried two near-identical light tints: `#f1f5f9` (the shared product-photo/card surface
already used by PLP, PDP, cart, footer, search, Merken and the featured-brands band) and `#edf7fd` (a
pale blue used only by the brand marquee and the hero's floating-card icon tile). Two tints one step
apart read as an inconsistency rather than a distinction — the owner flagged it directly while
reviewing section backgrounds. Consolidating on the tint that already appears everywhere else leaves
the page with exactly one light surface color.

## What Changes

- The brand marquee band and the hero floating-card icon tile move from `#edf7fd` to `#f1f5f9`.
- No other color, spacing or layout changes. The hero outlet badge keeps its solid-accent (`#0d80c4`)
  hover, which still reads as a distinct reward against the new rest tint.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `homepage-sections`: the marquee's "Tinted band" scenario names `#edf7fd` as a hard value; it
  changes to `#f1f5f9`.

## Impact

- `assets/component-ob-home-marquee.css`, `assets/component-ob-home-hero.css`.
- No shop data, no template JSON, no migration-checklist entry.
