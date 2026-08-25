## Why

The header announcement bar currently renders plain text only, and Dawn's stock behavior forces every configuration with 2+ messages into a one-at-a-time carousel at every breakpoint, including desktop — where there is ample width to show all messages at once without motion or interaction. The approved Bolt reference (`https://original-brands.bolt.host/`) shows a 3-message trust bar (shipping / returns / brand-authenticity) with an icon per message, all three visible simultaneously on desktop with no scrolling. Bringing the announcement bar to that reference requires an icon field per message plus a breakpoint-aware layout the stock section doesn't have.

## What Changes

- Add an optional icon field to each announcement block, selecting from the theme's existing curated Lucide icon set (`snippets/ob-icon.liquid`, already used by the PDP USP strip) rather than a raw image upload — guarantees icons stay pixel-consistent with the rest of the theme.
- Extend `snippets/ob-icon.liquid` with a `refresh-cw` icon (path captured from the proto), joining its existing `truck` and `shield-check` entries so all three reference icons are available.
- Change the multi-message layout so message count-per-view is breakpoint-aware instead of fixed at one everywhere:
  - Mobile (<750px): 1 message visible, Dawn's existing slideshow-component scroller unchanged.
  - Tablet (750–989px): 2 messages visible at a time, reusing the theme's existing `grid--2-col-tablet` + `slider--tablet` slider idiom (already used in `sections/featured-blog.liquid` and `sections/multicolumn.liquid`) instead of one-at-a-time sliding.
  - Desktop (≥990px): all configured messages render simultaneously in a static centered row — no scrolling, no prev/next buttons, no autoplay. **BREAKING** for any merchant currently relying on desktop autoplay/cycling with 2+ blocks — the desktop carousel is replaced outright, matching the approved reference.
- Single-message configurations are unaffected (Dawn already renders those without a slider).

## Capabilities

### New Capabilities
- `header-announcement-bar`: the header's icon-optional, breakpoint-aware announcement/trust-message bar — block icon selection, and the mobile-1/tablet-2/desktop-all-static visibility rule.

### Modified Capabilities
(none — `pdp-usp-strip`'s requirements are unchanged; `ob-icon.liquid` gains an additional icon case, which is an implementation detail, not a change to that spec's documented behavior)

## Impact

- `sections/announcement-bar.liquid`: block schema (icon field), markup (per-breakpoint layout), and its CSS/JS wiring.
- `snippets/ob-icon.liquid`: add `refresh-cw` case.
- New CSS (scoped to the announcement bar) for the tablet 2-up slider and the desktop static row.
- No JS changes expected beyond what Dawn's existing slider button/slideshow-component logic already does generically (scroll-by-slide-width); needs live verification that button clicks still land correctly with 2 slides visible on tablet.
- Owner action item (not part of this change's code): the proto's exact bar background (#0F172A) and text (#F1F5F9) colors don't match any existing `color_scheme` swatch — recommend adding a matching color scheme in Admin → Theme editor → Colors, then selecting it on the announcement-bar section. Implementation uses the existing `color_scheme` setting mechanism regardless, so no code change is needed once that scheme exists.
