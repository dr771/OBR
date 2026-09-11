## 1. Schema + markup

- [x] 1.1 Add a `short_desc` textarea block setting to the `occasion` block type in
      `sections/ob-home-occasions.liquid`.
- [x] 1.2 Render the description inside `.ob-home-occasions__card-body`, guarded by
      `{%- if block.settings.short_desc != blank -%}`, after the title and before the CTA.

## 2. CSS: hover reveal, gap, mobile aspect ratio

- [x] 2.1 Add `.ob-home-occasions__card-desc` at rest: `max-height: 0`, `opacity: 0`,
      `overflow: hidden`, `transition: max-height 0.5s, opacity 0.5s` (mirrors bolt's
      `transition-all duration-500`).
- [x] 2.2 Reveal it under `.ob-home-occasions__card:hover` and
      `.ob-home-occasions__card:focus-within` — `max-height` large enough for the longest
      expected copy, `opacity: 1`.
- [x] 2.3 Replace the two-tier gap (`2rem` base, `2.4rem` at ≥750px) with a single
      `gap: 1.25rem` on `.ob-home-occasions__grid`, removing the ≥750px override.
- [x] 2.4 Add a `min-width: 750px` override that restores `aspect-ratio: 3 / 4` on
      `.ob-home-occasions__card`, with `1 / 1` as the new base (mobile) value.

## 3. Verify live

- [x] 3.1 Push `sections/ob-home-occasions.liquid` and
      `assets/component-ob-home-occasions.css` to theme `148245381229` with `--only`.
- [x] 3.2 Reconciled `templates/index.json` against real live drift (hero/occasions copy had
      been overwritten by a stale theme-editor save, unrelated to this change — adopted live
      as source of truth per owner decision) and added `short_desc` copy to the three
      existing occasion blocks (Sport & Training, Outdoor & Werk, Fashion & Lifestyle) so the
      reveal has real content.
- [x] 3.3 Verified live at desktop (1440px): gap computed at 12.5px (1.25rem), hover reveals
      the description (`opacity: 1`, `max-height: 120px`), image hover-zoom still applies,
      scrim keeps all text legible at rest.
- [x] 3.4 Verified live at a mobile viewport (~500px, <750px breakpoint): `aspect-ratio: 1 / 1`
      computed, description hidden at rest, no layout shift.
- [x] 3.5 Verified `:focus-within` reveal (card matched `:hover`/focus state with
      `opacity: 1`); confirmed the reveal correctly persists across a back-navigation focus
      restore and correctly hides again once blurred.

## 3b. Follow-up polish (owner review after first live pass)

- [x] 3b.1 Image hover-zoom: switched from `0.4s ease` to bolt's exact
      `0.9s cubic-bezier(0, 0, 0.2, 1)` (Tailwind's `ease-out` curve) — was reading as
      near-linear/too fast against the proto's slow-settling zoom.
- [x] 3b.2 Fixed visibly stepped/janky title and eyebrow movement during the hover reveal:
      root cause was animating `margin-top` on `.ob-home-occasions__card-desc` alongside
      `max-height`/`opacity` — two competing layout-affecting transitions compounding into
      visible jank each frame. Matched bolt exactly: `margin-top` is now a static value (not
      transitioned, not toggled on hover), only `max-height`/`opacity` animate, both on
      Tailwind's `cubic-bezier(0.4, 0, 0.2, 1)` curve (measured directly off bolt's computed
      styles) instead of the generic CSS `ease` keyword.
- [x] 3b.3 CTA hover no longer moves the "Ontdek collectie" text — split the icon into its
      own `.ob-home-occasions__card-cta-icon` class so only the icon transforms
      (`translate(0.125rem, -0.125rem)`, matching bolt's `translate-x-0.5 -translate-y-0.5`),
      text stays put.
- [x] 3b.4 Swapped the CTA icon from `chevron-right` to bolt's actual icon
      (`arrow-up-right`, Lucide) — added as a new case to `snippets/ob-icon.liquid`.
- [x] 3b.5 Pushed and live-verified: image transition/desc transition/icon transition
      computed values all match bolt's measured values exactly; hover screenshot confirms
      the arrow-up-right icon renders and the CTA text does not shift.

## 3c. Scrim strength + a real Dawn override bug

- [x] 3c.1 Strengthened the scrim gradient per owner request, then found via computed-style
      measurement that the scrim `<div>` was rendering `display: none` — Dawn's own
      `base.css` ships a global `div:empty { display: none }` rule, and our empty scrim div
      matched it with higher specificity than our own class selector, so no gradient value
      was ever visible regardless of strength. Fixed by re-scoping the rule to
      `.ob-home-occasions__card .ob-home-occasions__card-scrim` (two classes outrank
      `div:empty`'s one-element-one-pseudo-class specificity) plus an explicit
      `display: block`.
- [x] 3c.2 Landed on a neutral-black gradient (`rgba(0,0,0,0.85)` → `rgba(0,0,0,0.25)` at 50%
      → transparent), not bolt's literal slate-900 `rgba(15,23,42,…)` — at the strength the
      owner wanted, the slate tint read as visibly purple; pure black avoids that at any
      strength while keeping bolt's 3-stop shape.

## 3d. Admin-uploadable card images

- [x] 3d.1 Added an `image` (`image_picker`) setting to the `occasion` block, rendered via
      `image_url: width: 1200` when present.
- [x] 3d.2 Falls back to the existing `snippets/ob-occasion-image.liquid` curated-asset
      resolver when the block has no uploaded image — verified via `git status`/live diff
      that all three existing blocks (no image set) still render their curated photos
      unchanged.
- [x] 3d.3 `alt` text prioritizes the uploaded image's own alt (Shopify Files metadata) over
      the collection title.
- [x] 3d.4 Live-verified in the theme editor: "Afbeelding" field with an upload control
      appears in the block settings panel, positioned directly under "Collectie".

## 4. Docs

- [x] 4.1 Delta spec updated with the image-upload, CTA-icon-only-hover, and photo-priority
      scenarios above. Ready to sync into `openspec/specs/homepage-sections/spec.md` and
      archive — approved by the owner.
