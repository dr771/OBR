## 1. Trustbadge

- [x] 1.1 Create `snippets/ob-trustbadge.liquid`: TSID assign, data-attribute script embed (right on desktop and mobile, stacked above the arrow (desktop y-offset 20, mobile 64), mobile fadeout off), per-template mobile y-offset for `product`/`cart` (142), skipped in `request.design_mode`
- [x] 1.2 Render it in `layout/theme.liquid` before `</body>`

## 2. Scroll-to-top

- [x] 2.1 Create `snippets/ob-scroll-top.liquid` (native button, `aria-label="Naar boven"`, `hidden`, icon)
- [x] 2.2 Create `assets/ob-scroll-top.js` (reveal after ~1 viewport, scroll to top, focus start of page, reduced motion)
- [x] 2.3 Create `assets/component-ob-scroll-top.css` (arrow styles, mobile lift above PDP bar / stuck cart dock, overlay hide rule, trustbadge container z-index + overlay hide)
- [x] 2.4 Render snippet + load CSS/JS in `layout/theme.liquid`

## 3. Deploy and verify

- [x] 3.1 `shopify theme check`, grep for touched files
- [x] 3.2 Push the 5 files with `--only` to theme 148245381229
- [x] 3.3 Verify in Chrome: desktop home; mobile PDP (above purchase bar, no intersections); mobile cart dock; PLP (inline filter panel); cart drawer, menu, predictive search; keyboard + reduced motion

## 4. Docs

- [x] 4.1 MIGRATION-TO-LIVE.md: replace snippet with official TS Shopify app, TS account domain
- [x] 4.2 STATUS-LOG.md entry; GOTCHAS.md (widget z-index / container id hook); CI-STYLE-TOKENS.md if a token is added
- [x] 4.3 TODO.md: the owner removed the two lines themselves
