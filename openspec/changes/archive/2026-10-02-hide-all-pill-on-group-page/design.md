## Context

`snippets/ob-menu-trail.liquid` with `format: 'links'` emits the "Alle …" pill first, then every child that links to a stocked collection, and nothing when fewer than two pills result. The viewed collection is `ob_target`; the "Alle …" entry is `ob_all` (the self-link child, or the group item when the menu has no self-link).

## Goals / Non-Goals

**Goals:** no pill that links to the page being viewed on a group's own page.

**Non-Goals:** any change to sub-collection pages, to the breadcrumb, to pill styling, or to the menu data.

## Decisions

1. **Compare on the collection handle, as the current-marking already does.** The "Alle …" pill is skipped when `ob_all.object.handle == ob_target`. The same expression decided `aria-current` before, so the two can never disagree, and a locale prefix cannot cause a miss.
2. **The fewer-than-two rule keeps its threshold.** A lone child pill reads as a stray button, so a group page with one stocked child shows no row. Alternative considered: show a single pill; rejected as noise.
3. **The row's position is not held stable across pages.** On the group page the first pill is the first child; on a sub-page it is "Alle …". This shift is the thing the owner wants to judge live.

## Risks / Trade-offs

- [The row shifts by one pill between group page and sub-page] → accepted for the trial; reverting is a one-condition change.
- [No pill is current on the group page, so the mobile scroll-into-view script has nothing to target] → it already returns early when no current pill exists.
- [Outdoor & Werk loses its row until Magnum is stocked] → resolves itself when a second child has products.
