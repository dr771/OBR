# SEO redirects and blog

Redirect map from the old `originalbrands.nl` (Drupal) to Shopify. **Live since 2026-11-24:** 3,180 redirects in the live shop (577 product-colour rows), DNS switched the same day. Full check after launch (2026-11-24): every row answers 301 with its target as `Location`, and all 637 distinct targets answer 200. Two fixes came out of it: `/nl` (the old homepage, 2,571 clicks, listed as `/` in `gsc-clicks.json` so the generator made no row) → `/`, added by hand; `/blog/slippers` pointed at an empty tag page (below). Check slowly: the storefront answers 429 beyond about one request per second. The open follow-ups (Search Console 404 report, brand pages) are in SHOP-SETUP.md, Open after launch.

## How Shopify redirects behave

Measured, still true:

- A redirect fires only when the path itself 404s.
- `/nl/<path>` is not taken as a locale prefix, as long as `nl` is the primary language and not a published secondary one.
- Matching ignores case and a trailing slash. The path without `/nl` is a separate row: every alias has two.
- Query strings pass through and merge into the target (`?size=38` survives).
- **The importer skips paths that already have a redirect.** To change a target, edit the redirect in Admin → Navigation → URL redirects; a re-import does nothing for it.
- Variant ids differ per shop, so product rows are valid only for the shop whose catalog they were built from.

## What the map does

| Old page | Target |
|---|---|
| FitFlop brand × type (`/nl/fitflop-sandalen`, …) | the collection with the same slug (COLLECTIONS.md) |
| other brand pages and their sub-pages | the brand collection |
| dropped brands, and brands without products (Hi-Tec, Sneaker Lab, Magnum) | `/pages/merken`, never the homepage (Google reads a blanket homepage redirect as a soft 404) |
| Briko (products, no collection) | `/search?q=briko` |
| sale pages | `/collections/solden`; brand outlets → `/collections/fitflop-outlet` |
| blog posts / categories | `/blogs/inspiratie/<post>` / `/blogs/inspiratie/tagged/<category>` |
| FitFlop product colour pages | `/products/<handle>?variant=<id>`, matched on item/colour code, never on slug text |
| other brands' product pages | the brand collection (only `/fitflop-all` was crawled) |

The primary domain stays `www.originalbrands.nl`, so no Search Console change of address. Search Console traffic (16 months, 42.7k clicks): category/brand pages ≈ 27k, blog ≈ 10k, products ≈ 470.

## Tooling

- `node scripts/build-redirects.js <shop>`: reads `drupal_url_aliases.csv` plus `redirects/legacy-pages.json` (crawl), `gsc-clicks.json`, `overrides.csv` (`alias;target`, hand decisions that win over every rule) and `catalog-<shop>.json`. Writes `redirects-<shop>.csv` (Shopify import format, git-ignored) and `review-<shop>.csv` (every non-product path, its target, the rule, its clicks). Brands that get a collection go into `BRANDS` there.
- `redirects/catalog-<shop>.json`: the shop's products from `/products.json?limit=250&page=N`, git-ignored; regenerate per run.
- `scripts/legacy-crawl.js`: the crawl behind `legacy-pages.json`. The old site answered 429 after a few dozen requests, so it ran one request at a time and stopped at FitFlop.
- `drupal_url_aliases.csv` and `redirects/` stay in the repo as the record.

## Blog

- **One blog, handle `inspiratie`** (`/blogs/inspiratie`), linked from the footer's "Over ons". 14 of the old 22 posts were recreated; posts about brands no longer sold were not, and redirect to the blog via `overrides.csv`.
- **Post handle = the old last slug segment, unchanged**, so `/nl/blog/hielspoor/<post>` → `/blogs/inspiratie/<post>`.
- **Tags are the old category labels.** Shopify handleizes a tag for its URL, which gives the old slug (`/tagged/hielspoor`). Renaming a tag breaks its redirect.
- Four posts are unpublished on the live shop (3 clicks together); their old URLs go to `/blogs/inspiratie`. If the team republishes one, point its redirect at the post in Admin and drop its row from `overrides.csv`. A tag whose only posts are unpublished has no tag page (404): `slippers` is one, so `/blog/slippers` goes to `/blogs/inspiratie` too.
- Theme: `sections/main-blog.liquid` (tinted hero, tags as pills, card grid), `sections/main-article.liquid`, `assets/component-ob-blog.css`. Dates are hidden. Payloads of the posts: `blog/articles.json`.
