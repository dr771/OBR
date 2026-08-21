---
name: ob-collection-maintenance
description: Audit and safely maintain Original Brands' three activity/category smart collections when catalog metafield values change.
---

# Original Brands collection maintenance

Use this skill when catalog imports add or change values in `custom.activities` or `custom.shopify_originalbrands_category`, or when the three special smart collections need review. The approved mapping is in the repository root at `Collections.md`.

## Audit first

1. Confirm the Shopify connector identifies the shop as **Original Brands DEV** with domain `original-brands-dev.myshopify.com`. Stop on any other shop.
2. Read the live rule sets for **Sport & Training**, **Outdoor & Werk**, and **Dagelijks Comfort**. Read all `activities` metaobjects and scan non-empty values of the Product metafield `custom.shopify_originalbrands_category`.
3. Compare live values and rules with `Collections.md`. Report values that are new, missing, duplicated, or not assigned. Include the current product count for each collection.

The audit is read-only. Do not guess a merchandising destination for a new activity or category, and do not edit a collection or `Collections.md` until the user approves the proposed assignment.

## Applying an approved change

- Reconfirm the connector identity immediately before any write.
- Keep each collection's rule set disjunctive (`appliedDisjunctively: true`): every approved activity and category is an OR condition.
- For `custom.activities`, use `PRODUCT_METAFIELD_DEFINITION` with relation `EQUALS`, the activity metaobject GID as the condition, and the `custom.activities` definition GID as `conditionObjectId`. Do **not** use `CONTAINS`; Shopify rejects it for this list-of-metaobject-reference definition.
- For `custom.shopify_originalbrands_category`, use `PRODUCT_METAFIELD_DEFINITION` with relation `EQUALS`, the exact stored category text as the condition, and the category definition GID as `conditionObjectId`.
- Updating a Shopify rule set replaces all of its rules. Read the current rules first and send the complete approved list in one mutation.
- Verify the collection's final rules, OR logic, publication to Online Store, and product count. Then update `Collections.md` in the same change.

## API details

- Both definitions must have `useAsCollectionCondition: true`; if either is disabled, report it and stop before changing rules.
- Shopify connector GraphQL calls cap the wrapper-level `first` argument at 50, even where the query requests more nodes. Pass `first: 50` and paginate if necessary.
- Use the Admin API / Shopify connector for collection and metafield-definition work. Shopify CLI is for theme files and cannot manage these resources.
