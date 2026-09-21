## Why

The two-level main navigation shipped 2026-09-21 introduced two gaps in `header-navigation`'s
current/active-state coverage. First, the desktop dropdown submenus never got an active-state
treatment of their own — the spec explicitly said submenu navigation "does not change its
existing behavior," which was true only because no submenu treatment existed yet. Second, and
more seriously, a real bug shipped alongside the new Outdoor & Werk / Fashion & Lifestyle
submenus: any brand collection reachable from two top-level branches at once (its needs-collection
AND the Merken directory — e.g. Juicy Couture, Hi-Tec) rendered BOTH top-level items as active
simultaneously on its own collection page, because Shopify's `link.child_active` fires true on
every branch that contains a matching link and the Menu API has no "primary parent" concept.
Both are fixed in code (`sections/header.liquid`, `snippets/header-dropdown-menu.liquid`) and need
the spec brought in line with what actually ships now.

## What Changes

- Desktop submenu (dropdown) links now get the same current-item treatment as top-level links: a
  2px primary-blue underline that expands from 0 to full label width, replacing Dawn's default
  text-decoration underline for the active submenu item.
- Exactly one top-level navigation item is active at a time. When a collection is linked from more
  than one top-level branch simultaneously, Merken never wins that tie — the same deliberate
  fallback treatment it already gets in `custom.breadcrumb_rank` (left unranked/last-resort).

## Capabilities

### Modified Capabilities
- `header-navigation`: the "Desktop main navigation communicates hover and current-page state"
  requirement's submenu scenario changes from "no change" to "submenu links get an equivalent
  active-state underline." A new requirement is added: exactly one top-level item is active at a
  time, with Merken as the deterministic tie-break loser.

## Impact

- `sections/header.liquid` — added mirrored active-underline CSS rules scoped to `.header__submenu`.
- `snippets/header-dropdown-menu.liquid` — child/grandchild link titles wrapped in `<span>` to reuse
  the same underline technique; added a `non_merken_link_active` tie-break computed once per render.
- No data model or template JSON changes. Both fixes are live on theme `148245381229`, verified on
  `/collections/juicy-couture` (was: Fashion & Lifestyle + Merken both active; now: Fashion &
  Lifestyle only), `/collections/hi-tec` (Outdoor & Werk only), and `/pages/merken` (Merken still
  activates on its own page).
