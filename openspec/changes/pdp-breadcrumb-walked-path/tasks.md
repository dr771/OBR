## 1. Shop-side rank data

- [x] 1.1 Verify the connected shop is **Original Brands DEV** (`original-brands-dev.myshopify.com`) before any Admin write
- [x] 1.2 Create the `breadcrumb_rank` integer metafield definition on Collections
- [x] 1.3 Set rank values on the existing collections: product-type (Schoenen, Kleding, Accessoires) lowest, then occasion (Dagelijks Comfort, Sport & Training, Outdoor & Werk), then brand collections
- [x] 1.4 Append the definition and its values to `MIGRATION-TO-LIVE.md` as a launch dependency

## 2. Server-rendered ranked default

- [x] 2.1 Replace the `product.collections.first` fallback in `snippets/ob-breadcrumb.liquid` with a lowest-`breadcrumb_rank`-wins scan over `product.collections`, keeping the `collection` routing global as the first source
- [x] 2.2 Sort unranked collections last, and keep rendering Home > product with no placeholder entry or dangling separator when the product is in no collection
- [x] 2.3 Confirm the trail markup still matches the `pdp-breadcrumb` presentation requirement (1.2rem / 1.6rem line / 0.8rem gaps, aria-hidden separators, `aria-current` on the last entry)

## 3. Browsing-context recorder

- [x] 3.1 Create `assets/ob-breadcrumb.js` that writes `{handle, title, url}` to `sessionStorage` under `ob:breadcrumb-collection` on collection pages, wrapped in `try`/`catch`
- [x] 3.2 Record on initial render only, so Dawn's AJAX facet updates do not re-record
- [x] 3.3 Load it deferred from `sections/main-collection-product-grid.liquid`, and confirm the search results surface deliberately does not load it

## 4. Pre-paint resolver

- [x] 4.1 Render the product's own collections into a data attribute on the breadcrumb (handle → title + URL), correctly escaped
- [x] 4.2 Add the synchronous inline resolver immediately after the `<nav>` in `snippets/ob-breadcrumb.liquid`, with a comment stating why it is inline rather than in the deferred file
- [x] 4.3 Use the remembered collection only when its handle appears in the product's own collection map; otherwise leave the server-rendered entry untouched
- [x] 4.4 Guard every `sessionStorage` read in `try`/`catch` so a throwing or empty store leaves the ranked default standing

## 5. Deploy and live verification

- [x] 5.1 Push the changed files to theme `148245381229` with an explicit `--only` list
- [x] 5.2 Verify: browse Schoenen → open the Loewenweiss Diva slipper → breadcrumb reads **Schoenen**
- [x] 5.3 Verify: open the same product URL directly in a fresh tab → breadcrumb reads the ranked collection, not Dagelijks Comfort
- [x] 5.4 Verify: browse Schoenen → open an apparel product not in Schoenen → breadcrumb falls back to the ranked collection
- [x] 5.5 Verify no visible label change on load (throttle the network and watch the first paint, or record and step the load)
- [x] 5.6 Verify with JavaScript disabled that the trail still renders the ranked collection
- [x] 5.7 Verify product URLs still contain no collection segment, and that the PLP is otherwise untouched
