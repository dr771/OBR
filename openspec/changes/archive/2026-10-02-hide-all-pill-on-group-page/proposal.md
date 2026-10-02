## Why

On a group's own page (Schoenen, FitFlop) the first hero pill, "Alle schoenen", links to the page already being viewed. The main menu dropped the same self-links on 2026-10-02 because a parent label is itself a link there; the owner wants the pill row to follow, as a trial to judge live.

## What Changes

- On the page of the group itself, the hero quick links omit the group's "Alle …" entry and show only its children. No pill is marked current there.
- On a sub-collection page nothing changes: "Alle …" stays first, as the way back up to the group.
- The fewer-than-two rule is unchanged but now counts without the "Alle …" entry on the group page, so a group with a single stocked child (Outdoor & Werk → Hi-Tec) shows no row on its own page.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `plp-subcollection-links`: the "Alle …" entry is omitted when the viewed collection is the group itself.

## Impact

- `snippets/ob-menu-trail.liquid`: `format: 'links'` only. Breadcrumb and JSON-LD output are untouched.
- No shop-side dependency: the menu's self-link items stay in Admin, since sub-collection pages still take the pill's wording from them.
