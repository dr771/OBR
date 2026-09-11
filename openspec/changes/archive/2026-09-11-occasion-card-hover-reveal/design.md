## Context

`sections/ob-home-occasions.liquid` + `assets/component-ob-home-occasions.css` already render
the "Shop per behoefte" grid with a photo, a permanent scrim, a number-eyebrow, a title, and a
CTA per card — ported from bolt.host but missing three details the owner just called out on a
second reference pass: the hover-reveal description, the exact proto gap, and (an OB-only
addition) a square mobile card. This is a small, single-section visual/content change, not a
new architecture — this doc exists only because the schema pipeline requires it before tasks.

## Goals / Non-Goals

**Goals:**
- Hover/focus reveal of a short description per card, collapsed to zero height/opacity at
  rest so it never affects layout or tab order while hidden.
- Keep the scrim permanently visible (already true today) so title/CTA/description are all
  legible against any photo without needing hover to establish contrast.
- Match bolt's measured 20px (1.25rem) gap at every breakpoint.
- Square (1:1) cards below 750px; unchanged 3:4 from 750px up.

**Non-Goals:**
- Not changing the image hover-zoom, scrim colour stops, or CTA chevron behavior — those
  already match bolt and are untouched.
- Not adding new merchant content beyond the one new `short_desc` field — number label,
  title, and collection link stay exactly as they are today.
- Not filling in the three live blocks' `short_desc` copy as part of the spec — that's a
  content step in the theme editor after the code ships (called out in the proposal's
  Impact section).

## Decisions

- **`max-height` + `opacity` transition, not `display`/`visibility` toggling.** Matches
  bolt's own technique (`max-h-0 opacity-0` → `group-hover:max-h-32 group-hover:opacity-100`,
  `transition-all duration-500`) exactly, animates smoothly, and — because the collapsed
  height is `0`, not `none`/`hidden` — never affects the card's own layout height (the card's
  height is driven by `aspect-ratio`, not content, so this is belt-and-suspenders rather than
  load-bearing).
- **Reveal on `:hover` and `:focus-within`, not JS.** The existing image-zoom and CTA
  translate already key off `:hover`/`:focus-visible` in plain CSS; the description follows
  the same no-JS pattern for consistency and because a link card needs no click-to-reveal
  step — hover/keyboard-focus is sufficient here (unlike the PLP's swatch tooltip, which
  needed JS because its scroll-clipped rail has no reliable hover surface).
- **`short_desc` is optional and the reveal block only renders when set**, so a merchant who
  hasn't filled it in yet doesn't get an empty gap-holding node at hover (no dead reveal
  space) — mirrors how `number_label` is already guarded with `{%- if -%}`.
- **Mobile aspect ratio is a plain breakpoint override on the existing `aspect-ratio: 3/4`
  rule**, scoped `max-width: 749.98px` to sit just below the section's existing 750px
  breakpoint — no new class, no JS, consistent with how the section already flips its grid
  from 1 column to 3 at that same breakpoint.
- **Gap becomes a single `1.25rem` value with no breakpoint override**, replacing the current
  two-tier `2rem` / `2.4rem` — bolt uses one `gap-5` for the whole grid regardless of column
  count, so matching it exactly means deleting the breakpoint override rather than adding a
  third tier.

## Risks / Trade-offs

- [Empty `short_desc` on the three live blocks until a merchant/admin fills them in] →
  Mitigated by the `{%- if -%}` guard (no visible empty space) and flagged explicitly in the
  proposal's Impact section as a required follow-up content step, not silently left undone.
- [Mobile card getting shorter (1:1 vs 3:4) could crop curated occasion photography
  differently than at desktop] → `object-fit: cover` already handles arbitrary container
  ratios; this is the same technique already relied on for every other responsive image in
  the theme (PLP/PDP cards), so no new cropping risk class is introduced.
