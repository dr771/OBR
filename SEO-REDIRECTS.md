# SEO redirects: old Drupal site → Shopify

Redirect map for the move from the old `originalbrands.nl` (Drupal 10) to Shopify. This is the
working document: state, decisions and what is still to do. Related: [BLOG.md](BLOG.md) (blog URL
structure), [COLLECTIONS.md](COLLECTIONS.md) (the collections the redirects point at),
[MIGRATION-TO-LIVE.md](MIGRATION-TO-LIVE.md) §5 (launch checklist line).

## Where we stand (2026-10-01)

The preparation that does not need the live catalog is done: inputs received, redirect behaviour
measured, target collections created, generator written and dry-run. What remains is a short list
of decisions and builds now, one generator run against the live catalog at launch, and checks after
launch. The lists are at the end.

Dry run on dev: **3,180 redirect rows**. By old page type, with 16-month search clicks:

| Rule | Old pages | Clicks | Target |
|---|---:|---:|---|
| sub-collection | 13 | 19,640 | the brand × type collection under the same slug |
| blog-post | 22 | 12,464 | `/blogs/inspiratie/<post>` (blog not created yet) |
| brand | 91 | 3,028 | the brand collection |
| fallback | 184 | 2,150 | `/pages/merken` (dropped or not-yet-synced brands) |
| sale | 23 | 1,020 | `/collections/solden` |
| exact | 18 | 515 | CMS pages, policies, search |
| brand-outlet | 18 | 205 | `/collections/fitflop-outlet` |
| faq | 27 | 63 | `/pages/veelgestelde-vragen` |
| blog-tag | 20 | 42 | `/blogs/inspiratie/tagged/<category>` |
| product (colour / item / brand) | 587 | about 470 in total | product with the colour preselected, else product, else brand |

## Facts

- **Old URL shapes.** Everything under `/nl/`; the same paths also answer without `/nl` (canonical
  points to `/nl`). Products: `/nl/artikel/<slug>`, one URL per colour, `?size=NN` per size.
  Categories are flat brand slugs: `/nl/<brand>`, `/nl/<brand>-all`, `/nl/<brand>-<category>`,
  `/nl/<brand>-outlet`. Blog: `/nl/blog/<category>/<post>`. Facets are query params. The `/en` site
  answers 403 and has no search traffic, so English aliases get no rows.
- **Inventory: `drupal_url_aliases.csv`** (`Alias;Path;Language`, UTF-8 BOM, CRLF): 13,275 product
  aliases for 9,461 article ids, 350 node pages, 65 taxonomy terms. There is no `sitemap.xml`. The
  export covers 42,166 of the 43,189 clicks on Search Console's top 1,000 pages.
- **Where the traffic is** (Search Console, 16 months, 42.7k clicks): the top 10 URLs carry 76%, the
  top 100 carry 97%. Category/brand pages ≈ 27k, blog ≈ 10k, homepage 2.6k, products ≈ 470 (1%).
  FitFlop sub-pages lead: `fitflop-slippers` 8,553, `fitflop-pantoffels` 3,739, `fitflop-dames`
  2,077, `fitflop-sandalen` 1,649, `fitflop-sneakers` 1,245, `fitflop-outlet` 1,213,
  `fitflop-heren` 632, then `fitflop-ballerinas` 204, `fitflop-enkellaarzen` 191, `fitflop-slides`
  129. The best non-FitFlop sub-pages: `odlo-outlet` 129, `juicy-couture-all` 110,
  `odlo-underwear` 90, `juicy-couture-pants` 67.
- **Product match key.** The export has no Akeneo codes, only `/article/<id>`. The old site's image
  path `…/product/<pid>/color/<article id>/image/A6H_646 (01)/…` holds `<item>_<colour>`, which is
  the Shopify SKU prefix `A6H__646__<size>`. Listing pages carry these paths for every colour they
  show, so one listing yields hundreds of pairs.
- **Most old product URLs are already dead.** In a sample of 66, 62 were 404 on the old site. A URL
  that already 404s gets no redirect.
- **Redirect behaviour on Shopify** (measured on dev with throwaway redirects):
  - A redirect only fires when the path itself 404s, so the import can go in before the DNS switch.
  - `/nl/<path>` is not taken as a locale prefix. This holds while `nl` is the shop's primary
    language and not a published secondary one.
  - Matching ignores case and a trailing slash.
  - The path without `/nl` is not covered by the `/nl` row: every alias needs two rows.
  - Query strings are passed through and merged into the target (`?size=38` survives, old facet
    params are carried along and ignored). No row per size or facet.
- **Variant ids differ per shop**, so product rows are only valid for the shop whose catalog they
  were built from.

## Decisions

- **Top brand × type pages are real collections under the old slug**, not filtered URLs: a filtered
  collection URL is canonicalised to its parent and loses its own title and ranking. Scope:
  **FitFlop only** (10 collections, about 19,600 clicks). Juicy Couture and Odlo sub-collections
  existed for a day and were deleted on 2026-10-02: their old pages had 125 and 13 clicks in 16
  months, so they redirect to the brand collection and the menu keeps a single third level. Table
  and rules in [COLLECTIONS.md](COLLECTIONS.md).
- **Dropped brands go to `/pages/merken`**, never the homepage (Google treats a blanket homepage
  redirect as a soft 404).
- **Products are matched on item/colour code, never on slug text**, and land on
  `/products/<handle>?variant=<id>` so the colour stays selected.
- **No table from Nick, and no further crawl for now.** The old site's product backend answers 429
  after a few dozen listing or product requests and stays blocked for 15+ minutes, while CMS pages
  keep answering. It is not known whether that limit is shared with real shoppers. Only
  `/fitflop-all` was crawled: 587 FitFlop colour pages, 532 matching a dev SKU exactly. Other
  brands' product URLs therefore go to their brand collection. Whether to resume is on the owner's
  list.
- **Primary domain stays `www.originalbrands.nl`**, so no Search Console change of address.

## Tooling

- `scripts/build-redirects.js [shop]` — reads the alias export plus, from `redirects/`:
  `legacy-pages.json` (crawl), `gsc-clicks.json`, `overrides.csv` (`alias;target`, hand decisions
  that win over every rule) and `catalog-<shop>.json`. Writes `redirects-<shop>.csv` (Shopify import
  format, git-ignored) and `review-<shop>.csv` (every non-product old path, its target, the rule
  that chose it, its clicks; sorted by clicks). **`review-<shop>.csv` is the sign-off list.**
- `scripts/legacy-crawl.js` — fills `legacy-pages.json`; resumable, one request at a time.
- `redirects/catalog-<shop>.json` — that shop's products as `[{h, v, vs: [[variantId, sku], …]}]`,
  taken from the storefront's `/products.json?limit=250&page=N`. Git-ignored; regenerate per shop.

## To do now (dev, before the full catalog)

- [ ] **Owner: sign off `redirects/review-dev.csv`**, at least every row with clicks. Corrections go
  into `redirects/overrides.csv`.
- [ ] **Owner: decide the 184 fallback pages with traffic.** Largest: `sidi-spare-parts` (531),
  `mechanix` (131), `rh-fietshelmen` (127), `sanita` (104). RH+, Magnum and Mechanix are expected to
  sync later and then get real targets; Sidi, Sanita, Briko, UYN are gone.
- [ ] **Owner: fill the manual `fitflop-pantoffels` collection** (3,739 clicks land there).
- [ ] **Owner: decide whether to resume the crawl** (ask the old site's admin for a whitelist or an
  export, or crawl slowly at night). Without it, non-FitFlop product URLs go to the brand collection
  and the old pages' SEO titles and descriptions are not captured.
- [ ] **Create the blog and its posts** — see [BLOG.md](BLOG.md). 12,464 clicks point at it.
- [ ] **Build the 404 fallback**: an unmapped old path should offer a search on its slug words
  instead of a dead end. Shopify redirects are exact-match only, so this catches the rest.
- [ ] **Publish `/pages/contact`** (unpublished on dev; the map points at it) and check the two
  policy targets exist (`/policies/terms-of-service`, `/policies/privacy-policy`).
- [ ] **Write SEO titles and meta descriptions for the top collections.** The old ones can be read
  by hand from the live old pages (e.g. `fitflop-slippers`: "FitFlop slippers, onmisbaar in de
  zomer! – Original Brands").

## To do at launch (live shop, full catalog)

- [ ] Recreate the collections and menu on the live shop with the same handles
  ([MIGRATION-TO-LIVE.md](MIGRATION-TO-LIVE.md) §3).
- [ ] Add newly synced brands to `BRANDS` in the generator (RH+, Magnum, Mechanix) and decide
  Hi-Tec sub-collections by their old-page clicks (none exist on dev).
- [ ] Dump the live catalog to `redirects/catalog-live.json` and run
  `node scripts/build-redirects.js live`. Product rows must come from this run.
- [ ] Review `review-live.csv`, then import `redirects-live.csv` (Admin → Navigation → URL
  redirects → Import, or `urlRedirectImportCreate`).
- [ ] On the live shop, re-test one `/nl/…` redirect before the DNS switch (locale prefix).
- [ ] Do the DNS switch only after the import. The old pages are gone from that moment.

## To do after launch

- [ ] Request every old URL in the map and check each answers 301 and its target 200.
- [ ] Submit the Shopify sitemap in Search Console.
- [ ] Watch Search Console's 404 report for several weeks; add rows for anything with traffic.
- [ ] Keep `drupal_url_aliases.csv` and `redirects/` in the repo as the record.
