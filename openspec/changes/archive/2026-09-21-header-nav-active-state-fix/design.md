## Context

Both fixes are already implemented and live on theme `148245381229`, discovered and shipped
during the same live-testing session that added the Outdoor & Werk / Fashion & Lifestyle
submenus. This document records the design after the fact so the spec delta and archive have an
accurate technical record.

## Goals / Non-Goals

**Goals:**
- Give desktop submenu active items the same visual treatment as top-level active items, reusing
  the existing span::after underline technique rather than inventing a new one.
- Guarantee exactly one top-level item is marked active per page load, with a deterministic,
  content-independent tie-break rule (no JS, no referrer/session state).

**Non-Goals:**
- Not tracking which top-level branch a visitor actually clicked through (referrer-based
  "remember the path" behavior) — that would be fragile on reload/direct-visit and isn't needed
  once Merken is excluded from the tie.
- Not touching `header-mega-menu.liquid` — `menu_type_desktop` is `dropdown` on this theme; the
  mega-menu snippet isn't rendered and is left as-is.

## Decisions

- **Reuse the top-level span::after underline for submenus, structurally.** Top-level links
  already wrap their title in a conditionally-classed `<span>` so `sections/header.liquid`'s CSS
  can target `> span::after`. Submenu links previously put the title directly in the `<a>` with a
  Dawn `list-menu__item--active` class (plain text-decoration underline). Wrapping submenu titles
  in the same conditional `<span class="header__active-menu-item">` lets one mirrored CSS block
  (`.header__submenu .header__menu-item ...`) reuse the exact color/thickness/offset/transition
  values instead of re-deriving them. Alternative considered: keep `list-menu__item--active` and
  just recolor it — rejected because Dawn's underline is a real `text-decoration`, not a
  `background-color` bar, so it can't be made to expand-on-hover the same way without the same
  span+pseudo-element structure anyway.
- **Tie-break in Liquid, not CSS or JS.** The double-active bug is a data/logic problem (which
  top-level item should claim the state), not a styling problem, so it's resolved once per render
  in `header-dropdown-menu.liquid` via a `non_merken_link_active` flag computed by looping
  `section.settings.menu.links` before the render loop. Alternative considered: a `custom
  breadcrumb_rank`-driven priority order across ALL top-level items (fully general) — rejected as
  over-engineering for the actual conflict shape: today, Merken is the only top-level branch that
  duplicates links already reachable elsewhere (every other top-level item's children are unique
  to it), so "Merken never wins a tie" fully resolves every current and foreseeable case with one
  boolean flag instead of a rank comparison.
- **Liquid syntax constraint discovered during implementation:** `{% assign %}` cannot take a
  boolean `or`/`and` expression directly (`assign x = a or b` is invalid), and `{% if %}` does not
  support parenthesized grouping (`a and (b or c)` is invalid). The tie-break logic is written as
  nested `if`/`unless` blocks assigning a boolean variable, not a single compound expression.

## Risks / Trade-offs

- [Risk] If a future top-level branch other than Merken also duplicates another branch's child
  link, the same double-active bug would resurface for that pair, since the tie-break only
  special-cases Merken. → Mitigation: the risk is called out in the new spec requirement's wording
  ("Merken is the deliberate fallback loser") so a future duplicate-link addition prompts revisiting
  this logic rather than assuming it's fully general.
- [Risk] None for rollback — both changes are additive Liquid/CSS with no data migration; reverting
  the two files fully reverts the behavior.
