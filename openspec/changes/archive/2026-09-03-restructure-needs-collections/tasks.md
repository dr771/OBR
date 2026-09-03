## 1. Pre-flight checks

- [x] 1.1 Verify connected Shopify shop is Original Brands DEV (`original-brands-dev.myshopify.com`) before any Admin API mutation
- [x] 1.2 Grep the theme for literal `dagelijks-comfort` references beyond `templates/index.json` and `snippets/ob-occasion-image.liquid`, to confirm the full blast radius of the handle rename
- [x] 1.3 Confirm the three live collection IDs and current `ruleSet` (already captured in design.md — re-confirm nothing changed since)

## 2. Shopify Admin: collection rule/title/handle updates

- [x] 2.1 `collectionUpdate` on `sport-training` (`gid://shopify/Collection/321699184749`): replace `ruleSet.rules` with vendor `EQUALS` conditions for Odlo, RH+, Nike Swim, Sweaty Betty (`appliedDisjunctively: true`); title/handle unchanged
- [x] 2.2 `collectionUpdate` on `outdoor-werk` (`gid://shopify/Collection/321699217517`): replace `ruleSet.rules` with vendor `EQUALS` conditions for Hi-Tec, Magnum (`appliedDisjunctively: true`); title/handle unchanged
- [x] 2.3 `collectionUpdate` on `dagelijks-comfort` (`gid://shopify/Collection/321702330477`): replace `ruleSet.rules` with vendor `EQUALS` conditions for Juicy Couture, Pas de Monaco, Irasuto Studios (`appliedDisjunctively: true`); set `title` to "Fashion & Lifestyle" and `handle` to `fashion-lifestyle`
- [x] 2.4 Re-query all three collections to confirm the new `ruleSet`, title, and handle took effect, and note each collection's resulting `productsCount`
- [x] 2.5 (found post-implementation, not in original task list) Update the live `main-menu` navigation: its "Dagelijks Comfort" item was a `COLLECTION`-type resource link, so its URL auto-followed the handle rename via `redirectNewHandle`, but its `title` label was still stale — fixed via `menuUpdate` (all 7 other items passed through unchanged)

## 3. Theme content updates

- [x] 3.1 Pull the live `templates/index.json` into a temp dir and diff against the repo copy to check for merchant drift before editing
- [x] 3.2 Update `templates/index.json` hero section `subheading` to replace the "everyday comfort" phrasing with wording that reflects the new Fashion & Lifestyle pillar
- [x] 3.3 Update `templates/index.json` occasions section: `comfort` block's `collection` → `fashion-lifestyle`, `number_label` → new copy consistent with blocks 01/02's style
- [x] 3.4 Update `templates/index.json` occasions section `subheading` to drop the "gewoon lekker wilt zitten" comfort/sitting framing in favor of style/lifestyle framing
- [x] 3.5 Update `snippets/ob-occasion-image.liquid`: change the `when 'dagelijks-comfort'` case to `when 'fashion-lifestyle'`, pointing at a fashion/lifestyle-appropriate curated asset (check existing `assets/ob-brand-*.jpg` for Juicy Couture/Pas de Monaco before falling back to Loewenweiss)

## 4. Docs

- [x] 4.1 Rewrite `COLLECTIONS.md`'s "Special collections" section: document the new vendor-based OR rules for all three collections, the SKU-weight rationale, and the RH+/Magnum vendor-string-unverified and Sweaty-Betty-provisional caveats
- [x] 4.2 Update any other `dagelijks-comfort` handle references found in `COLLECTIONS.md` (e.g. the breadcrumb rank table) to `fashion-lifestyle` — also updated `MIGRATION-TO-LIVE.md`, `CLAUDE.md`, and `.agents/skills/ob-collection-maintenance/SKILL.md`, which the pre-flight grep (task 1.2) found referencing the old handle/mechanism too

## 5. Ship and verify

- [x] 5.1 `shopify theme check` for the `ob-occasion-image.liquid` edit — clean, 204 files inspected, 7 pre-existing warnings elsewhere, none in touched files
- [x] 5.2 Push changed theme files to the live active theme (`148245381229`, `--allow-live --only <files>`)
- [x] 5.3 Verify live in the browser (chrome-devtools MCP): all three occasion cards render correct titles, links, and images — confirmed via DOM query (`/collections/sport-training`, `/collections/outdoor-werk`, `/collections/fashion-lifestyle`, correct number labels and images incl. the new Juicy Couture card image)
- [x] 5.4 Verify `fashion-lifestyle` collection shows real Juicy Couture/Pas de Monaco products — confirmed via `/collections/fashion-lifestyle/products.json`: 2 Juicy Couture, 3 Pas de Monaco, 1 Irasuto Studios
- [x] 5.5 Verify Sport & Training and Outdoor & Werk no longer show the same products — confirmed via `products.json` on both collections: 12 vs 2 products, zero overlap (the 2 Hi-Tec products that previously also matched Sport & Training's activity rules now appear only in Outdoor & Werk)
