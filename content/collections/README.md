# Collection bottom descriptions

The shared home for collection editorial copy and the old website reference. The native Shopify collection description stays the short hero introduction. Bottom copy is stored in the separate Collection metafield **Collectie ondertekst** (`custom.bottom_description`, `rich_text_field`).

- [INDEX.md](INDEX.md): collection-by-collection source map, word counts and exceptions.
- [bottom-descriptions.md](bottom-descriptions.md): editable Dutch copy. Each collection has source filenames and an editorial basis, followed by its storefront headings and paragraphs.
- [bottom-descriptions.json](bottom-descriptions.json): generated HTML and Shopify rich-text payloads, keyed by portable collection handle. Use this for migration; resolve destination IDs on the target shop.
- [legacy/](legacy/): original text in readable Markdown plus extracted HTML, links, original/final URLs, status and capture timestamp in JSON. Historical medical, environmental, delivery and discount claims are reference material, not approved copy.
- [shopify-before-2026-10-25.json](shopify-before-2026-10-25.json): pre-change collection descriptions and metafields. DEV IDs are historical reference only.
- [VERIFICATION.md](VERIFICATION.md): import, storefront, link and desktop/mobile verification results.

## Editing and migration

Edit **Products → Collections → the collection → Metafields → Collectie ondertekst** in Shopify Admin. This field is independent of the short introduction. Before another bulk import, export/reconcile current field values with this directory so newer Admin edits are preserved.

For repository edits, update `bottom-descriptions.md`, then run `python scripts/build-collection-copy.py`. Its small supported format is H2 headings, paragraphs and `[label](/collections/handle)` links. It verifies handle coverage, source availability and relative link targets while building the import artifact. Keep unique, helpful text; there is no target word count.

For the separate live shop, first recreate the Collection rich-text definition with storefront `PUBLIC_READ`, then resolve live collection IDs by handle and import each `richText` object as a JSON string with `metafieldsSet`. Re-read current values first and use `compareDigest` to avoid overwriting concurrent changes. Never reuse DEV collection IDs. The theme section is already ordered after the grid. See [MIGRATION-TO-LIVE.md](../../MIGRATION-TO-LIVE.md).

## Source capture

`python scripts/archive-collection-copy.py` captures the explicitly listed legacy brand/category sources serially with a three-second gap and stops on HTTP 429. It needs `requests` and `beautifulsoup4`. It does not crawl products or change the old site. Existing capture records are skipped, including unsuccessful/empty results. Keep these dated files as a baseline; make a separately dated folder for a future capture instead of replacing the team's historical reference.

The old CMS uses `.content__body` on brand landing pages and `.text__body` on product-listing category pages. A successful HTTP response with no extracted blocks is marked as an extraction gap, not proof of missing content. One swimwear source returned 403. Newly authored pages and category fallbacks are identified in the index rather than presented as exact legacy rewrites.

## Editorial rules used

Root-relative internal links contain no development hostname. Links point to actual collection handles; publication and rendered destinations are checked on the active storefront. FitFlop technology, waterproofing and warmth vary by model. No new copy promises treatment of pain, muscle toning, universal safety ratings, unverified recycling/certification, fixed delivery, discount percentages or perpetual stock.

`kinderen` is deliberately pending: its current rules include Unisex adult items and the already documented marketing pallet (`NICK.md` #15). Authoring children's buying copy would misrepresent that assortment. `frontpage` and the unused `merken` collection are utility collections; the real brands directory is `/pages/merken`.
