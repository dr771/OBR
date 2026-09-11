## Why
The homepage hero has a portrait crop, collapsed secondary CTA, overly loose badges and demo review figures. Separately, the homepage marquee and Merken hero chip grid show hand-styled text wordmarks for every brand even though real logo files exist for 9 of the 11.

## What Changes
- Square photo on desktop/mobile and equal-height CTAs.
- Count-free eyebrow with a blue dot and owner-supplied review figures.
- Compact delivery and linked outlet cards.
- `ob-brand-logotype.liquid` (shared by the homepage marquee and the Merken hero chip grid) now renders each brand's real logo file for 11 of the 12 brands (RH+ and Löwenweiss added), held to a uniform grayscale-at-rest/color-on-hover treatment so mixed logo colors don't outweigh each other; Sneaker Lab (no usable source logo) keeps the existing styled-text wordmark.
- Marquee gets a tinted band (was transparent/white, reading as backgroundless) and less vertical padding (28px → 16px default, was too tall for the logo row); RH+ renders via a new collection-optional `brand_handle` block setting since its collection isn't synced yet, linking to `/collections/rh-plus` regardless.
- Second polish round: the marquee's tint was swapped from the generic PDP/PLP surface color to the hero outlet badge's own blue (the two were sitting close enough to clash as separate tints), with a new bold hover for the badge now that its old hover color is the marquee's resting color; a real Löwenweiss logo replaces its text fallback; Holster/Pas de Monaco/Sneaker Lab got a further contrast boost since grayscale alone still left them looking pale next to the near-black logos; and the CSS keyframe animation was replaced with a small JS file so hovering the marquee eases its speed down instead of snapping to a full stop.
- Owner-supplied outlet badge reposition (`bottom`/`left`/`background`).
- Hero responsive behavior matched to the reference proto's own breakpoints: floating cards now gate on 750px (was 990px) and the two-column switch moved to 1024px (was 990px) as its own query - two breakpoints instead of one, mirroring bolt.host's actual `md:`/`lg:` Tailwind classes. Copy now leads the photo at every width (the proto uses plain DOM order, no CSS reordering), replacing this section's original photo-first stacking on narrow/tablet widths.

## Capabilities
### New Capabilities
None.
### Modified Capabilities
- `homepage-sections`: Square hero, editable accurate rating and compact linked badges; brand marquee renders real logos with a text-wordmark fallback.
- `merken-brands-directory`: Hero chip grid renders real logos with a text-wordmark fallback, same rule as the marquee.

## Impact
Homepage hero Liquid/CSS, native hero settings, `sections/ob-home-brand-marquee.liquid`, `snippets/ob-brand-logotype.liquid`, `assets/component-ob-home-hero.css`, `assets/component-ob-home-marquee.css`, `assets/component-ob-merken.css`, a new `assets/ob-home-marquee.js`, `templates/index.json` (RH+ block, reduced marquee padding), and 11 new `assets/ob-logo-*` logo files (sources recorded in `logo-sources.json`).
