## 1. Implementation

- [x] 1.1 Update hero crop, CTA sizing, eyebrow, review display and compact linked cards.
- [x] 1.3 Update native homepage settings and pull the reviewed index template.
- [x] 1.4 Render real brand logos in `ob-brand-logotype.liquid` (marquee + Merken hero chips) with a grayscale/color-on-hover treatment, text fallback for the 2 brands with no sourced logo.
- [x] 1.5 Owner polish pass: tinted `#f1f5f9` marquee band, reduced vertical padding, opacity 0.55/0.6 → 0.9 (both surfaces), re-matte `ob-logo-irasuto-studios.png` to real transparency, add RH+ via a new `brand_handle` fallback block setting + permanently-inverted logo treatment.
- [x] 1.6 Second polish round: marquee band recolored to the outlet badge's own blue (was clashing as a separate tint) with a new bold hover for the badge; real Löwenweiss logo; `brightness`/`contrast` boost on `.ob-brand-logo` for the still-pale Holster/Pas de Monaco/Sneaker Lab; replaced the CSS keyframe with `assets/ob-home-marquee.js` (rAF-driven, eases speed down on hover instead of an abrupt pause).
- [x] 1.7 Outlet badge repositioned to owner-supplied `bottom`/`left`/`background` values.
- [x] 1.8 Matched hero responsive behavior to the reference proto's actual breakpoints (read from its Tailwind classes, not guessed): floating cards now gate on 750px instead of 990px, the two-column switch moved to its own 1024px query, and the `order: 1`/`order: 2` that put the photo before the copy on stacked widths was removed so copy always leads, matching the proto's plain DOM order.
- [x] 1.9 Removed the photo's `max-width: 44rem` cap so it spans full column width while stacked (mobile + tablet), matching a follow-up screenshot showing the proto's photo full-width at tablet sizes.
- [x] 1.10 Owner follow-up: 3:2 photo ratio for the 750-1023px tablet range (was square, too tall full-width); floating cards now render on mobile too (departure from the proto) at a new compact/inset size/position, growing to the full desktop size + owner-dictated overflow position only at 1024px+ so the outlet badge no longer spills past the photo's edge below that.

## 2. Verification

- [x] 2.1 Validate Liquid and OpenSpec, deploy scoped files to the active dev theme.
- [x] 2.2 Inspect desktop/mobile screenshots and geometry, outlet links and keyboard focus; fix and reverify discrepancies.
- [x] 2.4 Deploy logo assets/snippet/CSS; verify marquee and Merken chip grid on desktop + mobile, alt text and collection links, no white-box artifacts from opaque source PNGs.
- [x] 2.3 Record final behavior in shared project documentation.
