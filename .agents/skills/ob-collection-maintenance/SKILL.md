---
name: ob-collection-maintenance
description: Audit and safely maintain Original Brands' three vendor-based needs smart collections when the brand roster changes.
---

# Original Brands collection maintenance

Use this skill when the Akeneo brand roster changes (a new vendor syncs, an existing one leaves the feed), or when the three special smart collections need review. The approved mapping is in the repository root at `COLLECTIONS.md`.

As of 2026-09-03 these three collections are **vendor-conditioned**, not
activity/category-conditioned (see `openspec/changes/restructure-needs-collections/`
for why — the old activity/category rules caused real overlap between Sport &
Training and Outdoor & Werk). Don't revert to activity/category logic without
re-reading that change's design.md.

## Audit first

1. Confirm the Shopify connector identifies the shop as **Original Brands DEV** with domain `original-brands-dev.myshopify.com`. Stop on any other shop.
2. Read the live rule sets for **Sport & Training** (`sport-training`), **Outdoor & Werk** (`outdoor-werk`), and **Fashion & Lifestyle** (`fashion-lifestyle`).
3. Query distinct `vendor` values across the live product catalog.
4. Compare live vendor values with `COLLECTIONS.md`'s "Current scan baseline" table. Report vendors that are new, missing (in the table but with zero live products), or whose exact vendor string doesn't match what's actually stored (this matters for RH+ and Magnum specifically — their vendor strings were unverified estimates as of 2026-09-03). Include the current product count for each collection.

The audit is read-only. Do not guess a merchandising destination for a new vendor, and do not edit a collection or `COLLECTIONS.md` until the user approves the proposed assignment. Not every vendor belongs in a needs-collection — FitFlop, Holster, Loewenweiss, and Sneaker Lab are deliberately excluded (see `COLLECTIONS.md`); don't add a vendor just because it's new.

## Applying an approved change

- Reconfirm the connector identity immediately before any write.
- Keep each collection's rule set disjunctive (`appliedDisjunctively: true`): every approved vendor is an OR condition.
- Use `column: VENDOR`, `relation: EQUALS`, and the exact vendor string as `condition`. No `conditionObjectId` is needed for vendor conditions (that field is only for metafield-definition rules).
- Updating a Shopify rule set replaces all of its rules. Read the current rules first and send the complete approved list in one mutation.
- Verify the collection's final rules, OR logic, publication to Online Store, and product count. Then update `COLLECTIONS.md`'s "Current scan baseline" table in the same change.

## API details

- Use the Admin API / Shopify connector (`collectionUpdate`, `CollectionRuleColumn.VENDOR`) for collection work. Shopify CLI is for theme files and cannot manage collections.
- Shopify connector GraphQL calls cap the wrapper-level `first` argument at 50, even where the query requests more nodes. Pass `first: 50` and paginate if necessary.
