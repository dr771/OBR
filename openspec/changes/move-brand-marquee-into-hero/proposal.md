## Why

The client wants its brands visible on the first mobile screen. The marquee is a separate section under the hero, so on a 390×664 phone it starts at 1032px, well below the fold. It has to land between the trust block and the hero image on mobile, without a second instance to maintain.

## What Changes

- The brand marquee becomes part of the `OB Homepage hero` section: its brand blocks move there and it renders once, inside the hero's markup.
- Below 750px it renders between the hero copy (after the trust/rating block) and the hero image, full width.
- From 750px up it stays a full-width band directly under the hero, looking as it does today.
- **BREAKING (theme editor):** the separate `OB Brand marquee` section (`sections/ob-home-brand-marquee.liquid`) is removed. Brands are edited on the hero section. Its padding settings go away.
- Marquee behavior is unchanged: seamless loop, hover/focus ease, reduced-motion fallback, logos and fallbacks, and `.ob-home-marquee` as the Trusted Shops badge reveal anchor.

## Capabilities

### New Capabilities

### Modified Capabilities
- `homepage-sections`: the brand marquee's position and ownership change: it belongs to the hero section and sits before the hero image below 750px.

## Impact

- `sections/ob-home-hero.liquid`, `assets/component-ob-home-hero.css`, `assets/component-ob-home-marquee.css`, `templates/index.json`
- `sections/ob-home-brand-marquee.liquid` removed, locally and from both shops' themes
- Mobile first screen shows no hero photo at 664px high (accepted by the owner). Screens around 553px visible height still won't show the marquee (accepted).
- `assets/ob-scroll-top.js` is untouched, but its reveal point moves earlier on mobile because the marquee sits higher.
