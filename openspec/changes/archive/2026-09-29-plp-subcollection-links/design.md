## Context

`snippets/ob-menu-trail.liquid` already walks `linklists['main-menu']` to find where a collection sits, for the hero breadcrumb and the PDP's JSON-LD. The main menu is two levels deep, and each parent's first child is an "Alles voor …/Alle …" self-link. Some children are brands (Outdoor & Werk → Hi-Tec, Magnum `#`), and some brands appear under two parents.

## Goals / Non-Goals

**Goals:** menu-derived quick links in the hero, consistent with the breadcrumb. Parent and sibling pages both get them. Mobile shows a single scrolling row.

**Non-Goals:** carrying active filters into the linked collection. The filters are collection-specific, and the linked page is a fresh landing. Product counts on the pills. Links on search pages.

## Decisions

1. **One walk, new `format: 'links'` in `ob-menu-trail`.** The walk now also keeps the matched link (`ob_match`) and its direct parent. A second snippet with its own walk could drift from the breadcrumb's "first occurrence" rule, and the spec requires the two to agree.
2. **Group = matched item if it has non-self children, else its parent.** This covers top-level pages, sub-pages, and a future third menu level without special cases.
3. **The "All" pill uses the menu's own self-link title** ("Alle schoenen", "Alles voor outdoor & werk"), so the merchant controls the wording in the menu. The group title is only a fallback.
4. **Filtering: `link.type == 'collection_link' and link.object.all_products_count > 0`.** This drops Magnum's `#` link and empty collections. The rendered output is captured, and the row is dropped when it has fewer than two links.
5. **Placement: a `links_content` slot in the hero row.** On desktop the row is already `space-between` with the text on the left, so the pills sit right-aligned and wrap, as in the reference. The slot replaces `meta` on collection pages (`meta` is unused there). On mobile the row stacks, and the pill list becomes `overflow-x: auto` with no scrollbar. It bleeds to the viewport edge with a negative margin matching `.page-width`'s gutter, so the last visible pill is cut at the screen edge rather than at the content edge, which signals that the row scrolls.
6. **Scrolling the current pill into view: a tiny inline script after the list.** It sets `scrollLeft` on the list directly, never `scrollIntoView`, which could scroll the page vertically. It runs synchronously before first paint, so there's no visible jump.
7. **Pill look, measured from the bolt reference:** 14px/20px Inter 400, 8px 16px padding, 1px `rgba(15,23,42,.15)` border, white background, full radius, 8px gap. Hover uses the accent (`#0d80c4`, the AA-safe sibling of the reference's clay). The reference has no current state, so current = ink fill with white text.

## Risks / Trade-offs

- [Brand groups read differently than category groups] → Outdoor & Werk shows Hi-Tec as its only other pill; with Magnum's `#` dropped, the row is "Alles voor outdoor & werk" + "Hi-Tec". That is acceptable and improves automatically once Magnum has a collection.
- [A duplicate brand's sibling row] → Hi-Tec's page shows the Outdoor & Werk group, not Merken's 11 brands. This follows first occurrence in menu order, the same as its breadcrumb.
- [Liquid cost] → one extra pass over ~50 menu links per collection render, which is negligible.
