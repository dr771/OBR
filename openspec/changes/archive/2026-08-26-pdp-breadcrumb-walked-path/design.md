## Context

See proposal.md — Why, for the motivation and the live findings behind it.

Constraints that shape the approach:

- Liquid renders once, server-side, with no knowledge of the shopper's previous page. Liquid
  cannot read the HTTP referrer, so "which collection did they browse" is not answerable at
  render time.
- Product URLs must stay clean, so `product.url | within: collection` — the only mechanism that
  makes Shopify populate the `collection` routing global — is off the table.
- Collections here are rule-based smart collections managed only in Shopify. No per-product
  field may be introduced, and nothing may depend on the Akeneo feed.
- The theme has no build step. Client behaviour lives in per-capability `assets/ob-*.js` files
  (`ob-plp.js`, `ob-card-swatches.js`, `ob-pdp-gallery.js`).

## Goals / Non-Goals

**Goals:**

- Resolve the breadcrumb's collection entry before first paint, so no label is ever seen
  changing.
- Degrade to a deliberate, sensible collection when there is no browsing context at all.
- Keep every mechanism inside the theme plus one collection-level metafield.

**Non-Goals:**

- Multi-level trails (`Home > Schoenen > Slippers`). The trail stays one collection deep.
- Treating search results as a browsing context. A query is not a collection; a shopper arriving
  from search gets the ranked default.
- Remembering the browsing context across tabs or sessions.
- Emitting `BreadcrumbList` structured data. None exists today and this change does not add it.

## Decisions

### Store the browsing context in `sessionStorage`, not `localStorage`

`sessionStorage` is per-tab and dies with the tab, which matches the lifetime of "the collection
I am currently shopping". `localStorage` would let a collection browsed last week caption an
unrelated product today. Key `ob:breadcrumb-collection`, value `{handle, title, url}` — storing
the title and URL alongside the handle means the resolver needs no network call and no second
data source.

_Alternative considered:_ the `document.referrer`. Rejected — it is empty on many navigations
(privacy settings, cross-origin referrer policies) and gives a URL, not a title, so the resolver
would still need a lookup to render a label.

### Validate the remembered collection against the product before using it

The PDP renders the product's own collections into a data attribute (handle → title + URL). The
resolver uses the remembered collection only when its handle appears in that map. This is what
keeps a stale or unrelated remembered collection from producing a breadcrumb that lies, and it
makes the storage value untrusted input rather than a source of truth.

### Resolve inline and synchronously on the PDP; record with a deferred script

The recorder on collection pages has no visual consequence, so it ships as a normal deferred
`assets/ob-breadcrumb.js` alongside the existing `ob-*.js` convention.

The resolver cannot — or more precisely, deferring it turns correctness into a race. Measured on
a harness reproducing both approaches (breadcrumb, ~40 rows of filler, swap driven from
`sessionStorage`):

| Variant | FCP | Swap | Frames showing the stale label |
| --- | --- | --- | --- |
| Deferred script, 300ms fetch (run 1) | 476ms | 548ms | 10 |
| Deferred script, 300ms fetch (run 2) | 364ms | 623ms | 20 (310ms on screen) |
| Deferred script, 0ms fetch | 388ms | 218ms | 0 |
| Inline synchronous | — | 195ms | 0 |

A deferred script wins the race whenever the fetch is cheaper than the parse-to-paint gap and
loses it otherwise; at 300ms it lost every run, leaving the wrong collection visible for up to
310ms. Notably the case where the swap matters at all — the shopper came from a collection page
— is also the case where that page has already cached the asset, so the warm 0ms row is the
common path and real-world flicker needs a cold cache *and* a remembered collection.

The inline script removes the race rather than betting on it: `sessionStorage` reads are
synchronous, so placing it immediately after the `<nav>` in `snippets/ob-breadcrumb.liquid`
resolves the label during parsing, before that subtree can paint. That ordering is structural,
not timing-dependent.

_Alternative considered:_ render the collection entry hidden and reveal it once resolved.
Rejected — it either reserves space (still shows a blank gap) or reflows the trail, trading a
label flicker for a layout shift.

_Alternative considered:_ have the server render nothing and let the client build the entry.
Rejected — crawlers and JS-off visits would get a degraded trail, which the spec forbids.

### Declare rank on the collection, via a `breadcrumb_rank` integer metafield

Rank belongs to the collection, so twelve one-time values in Shopify Admin cover every
rule-built product automatically, with no per-product work and no Akeneo involvement. It is
editable by the merchant without a theme deploy, which a hardcoded handle list in the snippet
would not be. Lower number wins; collections with no value sort last.

The intended banding — product-type (Schoenen, Kleding, Accessoires) above occasion (Dagelijks
Comfort, Sport & Training, Outdoor & Werk) above brand (Loewenweiss, Hi-Tec, …) — is merchant
data, not code, so re-banding later is an Admin edit.

_Alternative considered:_ rank by collection size, smallest wins as "most specific". Rejected on
the live data — for the Diva slipper the smallest collection is the brand collection
Loewenweiss (2 products), which is the wrong answer; Schoenen (9) is right.

_Alternative considered:_ derive the order from the main menu's link order. Rejected — it
couples breadcrumb priority to navigation order, so neither can be changed without disturbing
the other.

### Keep the routing global as the first source

`snippets/ob-breadcrumb.liquid` keeps checking Shopify's `collection` object first. It is
effectively never populated today, but it is correct when it is, and keeping it means a future
decision to link `within:` a collection somewhere specific needs no breadcrumb change.

## Risks / Trade-offs

- **`sessionStorage` access throws** (private-browsing modes, blocked site data) → every read and
  write is wrapped in `try`/`catch`; on failure the server-rendered ranked default stands.
- **Ranks are never set on the live shop**, leaving every collection at "sorts last" → the
  fallback degrades to today's arbitrary order rather than breaking. Mitigated by adding the
  metafield definition *and* the values to `MIGRATION-TO-LIVE.md` as a launch item.
- **Crawlers index the ranked collection while a shopper may see a different one** → accepted;
  the trail is navigational, not canonical, and both values are legitimate collections
  containing the product. If `BreadcrumbList` JSON-LD is added later it must be generated from
  the server-rendered value, not the client-resolved one.
- **An inline script in the snippet** is a small departure from the `ob-*.js` convention → kept
  deliberately minimal and commented in place with the reason (pre-paint resolution) and a
  pointer to the measurements above, so the next reader does not "tidy" it into the deferred
  file and silently reintroduce the race.
- **The recorder fires on every collection page view**, including AJAX facet updates that do not
  reload the page → it records on initial render only; a facet change does not change which
  collection the shopper is in, so no re-record is needed.

## Migration Plan

1. Create the `breadcrumb_rank` integer metafield definition on Collections in Shopify Admin.
2. Set values on the existing collections following the product-type / occasion / brand banding.
3. Push `snippets/ob-breadcrumb.liquid`, `assets/ob-breadcrumb.js`,
   `sections/main-collection-product-grid.liquid`, and `sections/main-product.liquid` to theme
   `148245381229` with an explicit `--only` list.
4. Verify live: collection → product shows the browsed collection; direct product URL shows the
   ranked collection; a product opened after browsing a collection it is not in shows the ranked
   collection; no visible label change on load.
5. Append the metafield definition and its values to `MIGRATION-TO-LIVE.md`.

**Rollback:** revert the four theme files. The metafield definition is inert without them, so it
can be left in place.
