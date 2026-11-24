## Decisions

Use the merchant-owned `custom.bottom_description` rich-text collection metafield so the team can edit content in Admin and translate it through Shopify. There is no custom app in this project, so app-owned TOML definitions are not applicable.

Use a separate section after the grid. It is outside Dawn's replaced grid container, remains present through facet/sort and load-more requests, and is server-rendered without JavaScript. Render rich text with `metafield_tag`; do not repurpose the native short description or place a copy inside each fetched product page.

Store original editorial HTML and readable text, source URLs, final URLs, status, and capture dates in Git. Revised copy has an explicit source mapping; new navigation categories use related legacy material plus current collection context rather than pretending a matching old page existed. Exclude the internal Home page and unused Merken collection from buying-copy authoring; `/pages/merken` is the real brands directory. Hold `kinderen` pending merchandising review: the current Unisex rule includes adult items and the marketing pallet already tracked in `NICK.md` #15, so children's-range copy would misrepresent the selection.

Use concise H2 sections and paragraphs with root-relative collection links. Avoid unsupported therapeutic, certification, sustainability, stock, and delivery claims. Do not promise any technology applies to every model. Keep historical source claims only in clearly labelled reference files.

## Verification

Back up current collections, create the definition, write values with compare-and-set protection, and re-read every value. Check all links against real collection handles. Verify rendered order, rich-text output, unchanged hero introductions, no duplicates after filtering/load more, and desktop/mobile screenshots plus computed geometry on the active theme. Record shop-owned field and content in the launch checklist.
