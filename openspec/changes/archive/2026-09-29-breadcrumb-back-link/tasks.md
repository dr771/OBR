## 1. Menu ancestry

- [x] 1.1 Create `snippets/ob-menu-trail.liquid` (html + jsonld formats, first-match, skip self-links, 3 levels)
- [x] 1.2 Render ancestors in `snippets/ob-collection-hero.liquid` when a `collection` is passed; pass it from `sections/main-collection-banner.liquid`

## 2. Context recording

- [x] 2.1 Rewrite `assets/ob-breadcrumb.js`: record `{kind,handle,title,path,search}` on load + product-link click; clear on non-listing, non-PDP pages; history-back click handler for `[data-ob-breadcrumb-back]`
- [x] 2.2 Replace the collection context marker in `sections/main-collection-product-grid.liquid` with `data-ob-listing-context`; add a search marker in `sections/main-search.liquid`
- [x] 2.3 Load `ob-breadcrumb.js` from `layout/theme.liquid` and remove the per-section include

## 3. PDP back link

- [x] 3.1 Rework `snippets/ob-breadcrumb.liquid` markup into a single back link and update the inline resolver (old-shape records, search kind, query-only href)
- [x] 3.2 Emit BreadcrumbList JSON-LD with the menu ancestors
- [x] 3.3 Add `back_to` / `back_to_search` strings to `locales/nl.json` and `locales/en.default.json`, and the `arrow-left` icon to `ob-icon.liquid`
- [x] 3.4 Restyle the back link in `assets/component-ob-pdp.css`

## 4. Ship and verify

- [x] 4.1 Run `shopify theme check` on the touched Liquid, then push to theme 148245381229
- [x] 4.2 Live-verify: hero trail (ballerinas, schoenen, a collection not in the menu), PDP from filtered PLP (label, href, history-back scroll), from search, from the homepage (cleared), direct entry, JSON-LD
- [x] 4.3 Add main-menu nesting to MIGRATION-TO-LIVE.md; record the back-link styling in CI-STYLE-TOKENS.md if new tokens appear
