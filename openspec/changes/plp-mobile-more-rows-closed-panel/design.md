## Context

`ob-mobile-filter-bar` loops over a fixed list of row kinds and matches each filter by `param_name`. The same "has a bar row" rule (known kind, and `values.size > 1` or an active value) decides the row, the hidden pass-through and the mobile pill exclusion in `facets.liquid`. The panel was server-rendered open and an inline script closed it before first paint when localStorage held `closed`.

## Goals / Non-Goals

**Goals:**
- Category and Activities rows on mobile collection and search pages wherever they can narrow the result.
- Panel closed at page load; opens only on the toggle.

**Non-Goals:**
- No desktop change.
- No change to Search & Discovery configuration or to the filter labels there.

## Decisions

- **Match category on `originalbrands_cat`.** DEV writes `custom.shopify_originalbrands_category`, pre-live `akeneo.shopify_originalbrands_cate__1` (NICK.md #16). One substring covers both, so DEV and pre-live run the same code.
- **Match activities on `custom.activities`.** Metaobject-backed; labels already resolve through `ob-facet-value-label` (`label_nl`).
- **Order: Gender, Merk, Maat, Kleur, Category, Activities.** Owner decision 2026-11-12: the existing rows keep their place and the new ones are appended. A first draft put them between Merk and Maat. It is the `bar_kinds` list.
- **Headings from `filter.label`** for every kind except Maat and Kleur, which keep `ob-option-meta`.
- **Closed is server-rendered (`hidden` + `aria-expanded="false"`), not script-applied.** No flash and no dependency on storage. Facets.js only replaces `.js-filter` children, never the panel, so an opened panel stays open while filtering.
- **No persistence.** The client asked for "initially closed"; remembering "open" would bring back an open panel on the next collection and read as the old behavior.
- **Active count on the toggle.** With the panel closed and no pills for row filters, an active Gender/Merk/… selection would be invisible. The count lives in a `.js-filter` span inside the toggle so it updates on every AJAX response. It counts the same values as the reset link (forced availability excluded).

## Risks / Trade-offs

- Six rows make the open panel tall → panel is closed by default now, compact row height for the new rows, the "keep grid context" scroll on opening still applies.
- Category values are plain-text metafields; their labels depend on the sync writing Dutch (POST-SYNC-CHECK.md). Not a theme concern.
