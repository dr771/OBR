## Why

The owner reviewed the approved bolt.host homepage reference again and wants three of its
"Shop per behoefte" occasion-card details carried over that the current build doesn't have:
a hover-reveal short description (adds real value over a bare title + CTA), a tighter grid
gap matching the proto exactly, and — a deliberate OB-specific departure — a square (1:1)
card on mobile instead of the proto's 3:4 ratio at every width.

## What Changes

- Add an admin-editable `short_desc` textarea block setting per occasion card, rendered
  hidden-and-inert at rest (zero height, zero opacity, no layout shift, not reachable by
  keyboard when collapsed) and revealed via a `max-height`/`opacity` transition on
  hover/focus — matching bolt's own `group-hover:max-h-32 group-hover:opacity-100` pattern.
- Confirm/document that the existing scrim gradient stays permanently visible (not a
  hover-only reveal), so the title/CTA — and now the revealed description — stay legible
  against any photo at rest, per bolt's `bg-gradient-to-t from-ink/85 via-ink/25
  to-transparent`.
- Reduce the grid gap from the current 2rem (mobile) / 2.4rem (≥750px) to bolt's measured
  1.25rem (20px, Tailwind `gap-5`) at every breakpoint, matching the proto exactly.
- **BREAKING (visual only)**: change the mobile (<750px) card aspect ratio from 3:4 to 1:1.
  This is a deliberate one-breakpoint departure from the proto (which stays 3:4 at every
  width with no responsive aspect variant) — the same class of owner-directed mobile
  departure already documented for this section's Hero requirement.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `homepage-sections`: the "Occasion grid links to the real vendor-conditioned collections"
  requirement gains three new scenarios — hover-reveal short description, permanently
  visible legibility scrim (clarifying existing behavior), proto-matched grid gap, and a
  mobile-only square aspect ratio departure.

## Impact

- `sections/ob-home-occasions.liquid` — new `short_desc` block setting, new markup node for
  the description.
- `assets/component-ob-home-occasions.css` — hover-reveal transition, gap value change,
  mobile aspect-ratio override.
- Live theme `148245381229`: the three existing occasion blocks (Sport & Training, Outdoor &
  Werk, Fashion & Lifestyle) need real `short_desc` copy filled in via the theme editor (or a
  reviewed `templates/index.json` pull/diff/push) after the code ships, or the hover state
  will reveal empty space.
