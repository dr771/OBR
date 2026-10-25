# Verification — 2026-10-25

Target: Original Brands DEV, `original-brands-dev.myshopify.com`, active Dawn theme `148245381229`.

| Check | Result |
|---|---|
| Field values after import | All 55 rich-text values equal the generated payloads |
| Short introductions | All 58 native `descriptionHtml` values unchanged from the pre-write export |
| Server-rendered collections | All 58 return 200; 55 have exactly one matching bottom description; three exclusions have none |
| Internal links | All rendered link attributes match the authored root-relative paths, with actual collection destinations; 220 distinct destinations counted per collection |
| Background separation | Grid white, description `#f8fafc`, footer `#f1f5f9`; when the description is the final content section the footer's top margin is removed so no white strip separates the bands |
| Closing spacing and dividers | No border/padding above the load-more count; grid-to-count 48px. Button-to-description 72px desktop and 51px mobile; the description has a 1px `#e2e8f0` bottom divider, meeting the footer with zero gap. Screenshots checked at 1440px and 390px, with no horizontal overflow |
| Desktop screenshot and geometry | Inspected at 1440×1000; with a vertical filter column text and product grid both start at 328px; text width 880px, body 15px/27px, H2 Fraunces 24px/31.2px, no horizontal overflow |
| Two-column transition | At 990px the grid has four columns and text/grid start at 328px; at 989px the grid has two columns and text expands to the full 874px content width from the 50px page inset |
| Tablet two-column layout | At 820×1000, text uses the full 705px content width from 50px while the tablet filter column remains present; no horizontal overflow |
| Desktop without a filter column | Checked the actual no-filters class in the rendered page; text and grid both return to the 50px page inset |
| Mobile screenshot and geometry | Inspected at 390×844 with mobile/touch and DPR 2; verified `innerWidth` and visual viewport 390; text left 15px, width 360px, H2 22px, no horizontal overflow |
| Load more | Real button click: 20 → 40 cards; the same single editorial DOM node and content remain |
| Mobile filter | Real Men filter click: first 20 of 34 matching products, one correct bottom description remains |
| Desktop sorting | Native sort input event: `price-ascending` applied in URL and grid; the same editorial DOM node/content remain |
| Shopify toolkit theme validation | Section, stylesheet and collection template valid |
| Shopify theme check | Zero errors; no findings for the new section or collection template |
| Deployment state | Fresh post-push pull of collection JSON equals local template, preserving live-only merchant settings |
| OpenSpec | `add-collection-bottom-content` validates strictly; implementation complete and deliberately unarchived for owner review |

## Coverage notes

The legacy archive records 34 explicitly selected URLs: 23 contain extracted editorial copy; ten return 200 without matching editorial blocks, and one swimwear page returns 403. Empty extraction results are labelled as gaps rather than proof that a page had no text. No old product pages were crawled.

`frontpage` and the unused `merken` collection are utility exclusions. `kinderen` is deliberately unfilled pending a genuine children's assortment; the current rule matches Unisex adult items and the marketing pallet already recorded in `NICK.md` #15. The manual `fitflop-pantoffels` collection remains empty, so its copy provides comparison guidance without promising stock.

Claude was working concurrently. This task deployed only its new section, stylesheet and the reviewed collection template; it did not alter the separate TODO changes or other theme code.
