## Context

`snippets/ob-breadcrumb.liquid` resolves the PDP's collection three ways: the routing `collection`, then a sessionStorage value `ob:breadcrumb-collection` = `{handle,title,url}` written by `assets/ob-breadcrumb.js` on PLP load, then the lowest `custom.breadcrumb_rank`. An inline, synchronous script swaps the label before first paint. That placement is deliberate: a deferred asset raced and flickered for up to 310ms, per the `pdp-breadcrumb-walked-path` design. The hero (`snippets/ob-collection-hero.liquid`) hard-codes `Home › title`.

`main-menu` is two levels deep: 7 top-level items, each with an "Alles voor …/Alle …" self-link first, then children. Some collections appear twice. Hi-Tec, Juicy Couture, Pas de Monaco, and Irasuto Studios sit under both an occasion parent and Merken.

## Goals / Non-Goals

**Goals:**
- One visible PDP back link. It returns to the exact listing (filters included), through history when possible.
- The search context is remembered like a collection context.
- A menu-derived full path on the PLP hero and in the PDP's BreadcrumbList JSON-LD.
- Keep the zero-flicker, no-JS-safe resolution.

**Non-Goals:**
- Restoring appended "Toon meer" pages on a non-bfcache return. Load-more does not write the page to the URL, and changing that is a separate PLP decision.
- A visible breadcrumb on search pages. Search has no hero trail today.
- Changing the ranking data (`breadcrumb_rank`) or the menu itself.

## Decisions

**1. Context record: `{kind, handle, title, path, search}`, same key.** `kind` is `collection` | `search`. The recorder in `ob-breadcrumb.js` writes on page load, and again in the capture phase on `click` of any `a[href*="/products/"]`, so `search` is `location.search` at the moment of leaving. It picks up Dawn facet pushState URLs without hooking facets.js. An old-shape record, which has no `kind`, is treated as a collection record, so sessions that were live during deploy keep working.

**2. The PDP resolver uses only the handle and the query string from storage.** For a collection, the handle is matched against the Liquid-rendered candidate list, and href = candidate `u` + remembered `search`. For a search, href = `routes.search_url` (Liquid-rendered, on the nav as `data-ob-search-url`) + remembered `search`. `search` is accepted only if it is empty or starts with `?`. The path is never taken from storage, so a tampered value cannot point the link off-site or to `javascript:`.

**3. Clearing context: the script is loaded site-wide.** `ob-breadcrumb.js` moves from the collection grid section into `layout/theme.liquid` (deferred, small). On load, a page with a `[data-ob-listing-context]` marker records. A page with `[data-ob-breadcrumb]` (the PDP) leaves the record alone. Any other page removes it. Quick-add modals on a PLP never load a separate page, so they are unaffected. Alternative considered: validate `document.referrer` on the PDP. Rejected, because the referrer is a PDP after product-to-product hops, and it is empty under some referrer policies.

**4. History-back is decided at click time.** On a plain primary click (no meta/ctrl/shift/alt, button 0), if `document.referrer`'s origin + pathname + search equals the link's resolved href (normalized through `new URL`), then `preventDefault(); history.back()`. Dawn's facet pushState keeps `location` in sync with the filters, and the browser sets `referrer` from the document's current URL at navigation time, so the comparison holds after filtering. `history.length > 1` is required as a guard.

**5. Menu ancestry: new `snippets/ob-menu-trail.liquid`, rendering output.** Liquid snippets cannot return values. The snippet takes `collection` and `format` (`html` | `jsonld`) and walks `linklists['main-menu'].links` to 3 levels. A link matches when `link.type == 'collection_link'` and `link.object.handle == collection.handle`. A child whose `url` equals its parent's `url` (the "Alles voor" self-link) is skipped. The first match in document order wins and the walk stops. It emits the matched item's ancestors only. In `html` format it renders `link + separator` pairs, with class names passed in by the caller. In `jsonld` format it renders `ListItem` objects with a `start` position and a trailing comma each, so the caller can append the collection and product. Matching on handle rather than URL avoids locale-prefix mismatches (`/en/collections/…`).

**6. The PDP markup keeps the same nav/data attributes.** Inside `<nav data-ob-breadcrumb data-ob-collections data-ob-search-url>`, there is one `<a data-ob-breadcrumb-back>` containing an aria-hidden `arrow-left` icon plus `<span data-ob-breadcrumb-label>`. The inline resolver only rewrites the span text and the href. The label is `{{ 'general.breadcrumb.back_to' | t: name: … }}` ("Terug naar {{ name }}"). The search label is a separate key, `general.breadcrumb.back_to_search` ("Terug naar zoekresultaten"). The inline script gets it through a data attribute, because it runs before any t() is available in JS. The no-collection fallback is "Terug naar Home" via the existing `general.breadcrumb.home`.

**7. JSON-LD placement:** emitted from `ob-breadcrumb.liquid` itself, next to the nav. It uses `shop.url` + relative URLs for absolute `item` values, and the server-resolved collection only.

## Risks / Trade-offs

- [Shopify storefront pages are often not bfcache-eligible] → history.back() then reloads the listing. The browser still restores scroll, and filters are in the URL, but appended "Toon meer" pages are lost. This is still strictly better than a fresh link, and it is documented as a non-goal.
- [First-in-menu-order ancestry for multi-parent brands] → Hi-Tec reads `Home › Outdoor & Werk › Hi-Tec`, not `Merken › Hi-Tec`. It is deterministic and fixable by menu order alone.
- [A merchant flattens or renames the menu] → the trail degrades to `Home › title`, never broken. Menu nesting is recorded as a shop-side dependency in MIGRATION-TO-LIVE.md.
- [Recorder click listener misses keyboard or middle-click navigation] → the load-time record still holds the listing, possibly with slightly older filter params, which is acceptable. A `click` event also fires for keyboard Enter on links.
