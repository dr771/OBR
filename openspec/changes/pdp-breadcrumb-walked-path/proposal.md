## Why

The PDP breadcrumb reads "Dagelijks Comfort" on effectively every product, no matter which
collection the shopper actually browsed. `snippets/ob-breadcrumb.liquid` prefers Shopify's
`collection` routing global, but that global is only populated on
`/collections/<handle>/products/<slug>` URLs, and every card link in
`snippets/card-product.liquid` uses a bare `card_product.url` with no `within:` filter. The
global is therefore blank on essentially every real PDP visit, and the
`product.collections.first` fallback runs instead. That fallback's order is neither documented
nor merchant-configurable, and "Dagelijks Comfort" — the shop's broadest collection at 18 of 26
products — wins it on every product sampled live. The result is a breadcrumb that misreports
where the shopper is, and a `pdp-breadcrumb` spec whose "Shopper arrives from a collection"
scenario describes behaviour that never actually fires in this theme.

## What Changes

- Record the collection a shopper is browsing (handle + title) in `sessionStorage` when a
  collection page renders.
- On the PDP, resolve the breadcrumb's collection entry from the remembered collection when the
  product genuinely belongs to it, so the trail names the collection the shopper walked through.
  A remembered collection the product is not in is ignored rather than displayed.
- Keep Shopify's `collection` routing global as the highest-priority source for the rare visit
  where it is populated, so no existing behaviour regresses.
- Replace the accidental `product.collections.first` fallback with a deliberate, ranked
  server-rendered default, so direct entry, crawlers, and JS-off visits get a sensible
  collection instead of the broadest one. Rank is declared per collection (collection-side), not
  per product — product-type collections outrank occasion collections, which outrank brand
  collections.
- Resolve the breadcrumb entry without a visible flicker of the wrong collection label.

Explicitly **not** changing: product URLs stay clean (`within:` was rejected — the collection
slug does not belong in a product URL), and no per-product primary-collection field is
introduced (collections here are rule-based smart collections managed only in Shopify, never in
Akeneo, with no manual per-product attachment).

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `pdp-breadcrumb`: the requirement covering how the collection entry is chosen changes. The
  "Shopper arrives from a collection" scenario is restated against the real mechanism (a
  remembered browsing context validated against the product's own collections) rather than the
  routing global that never fires, and the direct-entry scenario gains a requirement that the
  server-rendered default be a deliberate ranked choice rather than an arbitrary one.

## Impact

- `snippets/ob-breadcrumb.liquid` — collection resolution rewritten; markup gains the hooks the
  client script needs to swap the entry.
- New `assets/ob-breadcrumb.js` — records the collection context on collection pages and
  resolves the PDP entry, following the established per-capability `ob-*.js` convention
  (`ob-plp.js`, `ob-card-swatches.js`, `ob-pdp-gallery.js`).
- `sections/main-collection-product-grid.liquid` (and the search results surface, if it should
  count as a browsing context) — loads the recorder.
- `sections/main-product.liquid` — loads the resolver alongside `ob-pdp-gallery.js`.
- Shop-side: a collection-level rank needs a metafield definition in Shopify Admin plus a value
  on each collection. That is a deployment dependency for the live shop and must be appended to
  `MIGRATION-TO-LIVE.md` when it is created.
- No Akeneo change, no product data change, no URL change, no build step.
