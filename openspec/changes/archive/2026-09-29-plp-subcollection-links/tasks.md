## 1. Implementation

- [x] 1.1 Extend `snippets/ob-menu-trail.liquid`: keep matched link + parent, add `format: 'links'` (group resolution, All-first, collection/product filter, current marking, <2 → nothing)
- [x] 1.2 Add `links_content` slot to `snippets/ob-collection-hero.liquid`; fill it from `sections/main-collection-banner.liquid`
- [x] 1.3 Pill + mobile rail CSS in `assets/component-ob-collection-hero.css`; inline scroll-into-view for the current pill
- [x] 1.4 Locale label `general.breadcrumb.quick_links` (nl/en)

## 2. Ship and verify

- [x] 2.1 `shopify theme check`, diff locale files against the live theme, push to theme 148245381229
- [x] 2.2 Live-verify desktop + 390px: schoenen, ballerinas, instappers (scrolled into view), outdoor-werk (Magnum dropped), a collection not in the menu, Merken (no row), no horizontal overflow
- [x] 2.3 Extend the MIGRATION-TO-LIVE.md main-menu note
