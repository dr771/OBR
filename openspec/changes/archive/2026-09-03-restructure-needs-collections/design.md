## Context

See proposal.md - Why. Current mechanism: `sport-training`, `outdoor-werk`, and
`dagelijks-comfort` are Shopify smart collections using `appliedDisjunctively:
true` rule sets built from `PRODUCT_METAFIELD_DEFINITION` conditions on the
`custom.activities` (metaobject reference, multi-valued) and
`custom.shopify_originalbrands_category` (plain string) product metafields,
per `COLLECTIONS.md`. A live GraphQL sample of synced products confirmed the
`custom.activities` field is genuinely multi-valued in practice (not a data
error) — e.g. `Odlo Active Warm Base Layer Top` carries
`[Training, Fietsen, Skiën & Snowboard, Wandelen, Running]` — so a single
product routinely satisfies both the Sport & Training and Outdoor & Werk rule
sets at once under the current mechanism.

## Goals / Non-Goals

**Goals:**
- Make the three needs-collections mutually exclusive by construction, not by curation.
- Preserve the `sport-training` / `outdoor-werk` collection IDs and handles; only the third collection is renamed/rehandled.
- Keep the homepage occasion grid, its copy, and the collection-image resolver in sync with the new handle so nothing 404s or shows stale text.

**Non-Goals:**
- Rebuilding the Merken/homepage brand roster (Sweaty Betty/Nike Swim vs. RH+/Magnum mismatch) — real, but a separate follow-up (see proposal.md - Impact).
- Adding a fourth needs pillar for the comfort-footwear brands (FitFlop, Holster, Loewenweiss) — deliberately rejected; it would duplicate the existing Schoenen/Kleding/Accessoires product-type axis.
- Changing the breadcrumb-rank metafield (`custom.breadcrumb_rank`) or PDP related-products logic — both reference these three collections by name/rank, not by rule type, and are unaffected by this change.

## Decisions

**Vendor-based OR conditions instead of activity/category metafield conditions.**
Vendor is single-valued per product, so routing by vendor eliminates the
confirmed overlap bug at its source. Alternative considered: keep
activity-based rules and curate a mutually-exclusive activity taxonomy —
rejected because Odlo's multi-activity tagging reflects real product
versatility (a base layer legitimately serves running, skiing, and hiking),
and re-tagging thousands of Akeneo-sourced SKUs is out of reach for a
theme-side change.

**Keep existing collection IDs; only rehandle the renamed collection.**
`sport-training` and `outdoor-werk` keep their IDs, titles, and handles —
only their `ruleSet` changes. `dagelijks-comfort` keeps its ID but gets a new
title ("Fashion & Lifestyle") and handle (`fashion-lifestyle`). Alternative
considered: recreate all three collections fresh — rejected as unnecessary
churn that would also lose each collection's existing `productsCount`
history for no benefit.

**Sweaty Betty stays in the Sport & Training vendor list, marked provisional.**
The user expects Sweaty Betty will "probably" leave the Akeneo feed, but it
currently has live synced products (leggings, sweatshirt). Leaving it in the
OR-condition is harmless if it later contributes zero SKUs, and avoids
orphaning currently-live products from every needs-collection while the
roster is still unconfirmed. Alternative considered: drop it now — rejected
as premature.

**RH+ and Magnum vendor strings taken verbatim from the SKU export's brand
labels ("RH+", "Magnum"), unverified until either brand syncs.**
Alternative considered: wait for sync before touching the rule set at all —
rejected because Hi-Tec alone still gives Outdoor & Werk a real (if small)
population today, and the vendor string can be corrected for free (a config
change, not a schema change) the moment either brand's real vendor field is
observed.

## Risks / Trade-offs

- [Risk] RH+/Magnum's real vendor field value may not exactly match "RH+"/"Magnum" (capitalization, spacing) → Mitigation: re-check against the real product record the moment either brand syncs; documented as an open caveat in `COLLECTIONS.md`, not treated as done.
- [Risk] Outdoor & Werk will be visibly sparse (Hi-Tec only, ~2-9 products today) until Magnum syncs → Mitigation: same class of "not yet exercisable at full scale" caveat this project already accepts elsewhere (PLP load-more >18 products, predictive search >8 results); not a blocker for shipping the rule-type fix now.
- [Risk] Renaming the `dagelijks-comfort` handle breaks any reference to it beyond the homepage occasions block → Mitigation: grep the theme for the literal handle before pushing, to confirm blast radius before changing it live.
- [Risk] Products previously surfaced under "Dagelijks Comfort" via `Lifestyle`/`Ondergoed`/`Slipper`/`Sandal` (e.g. FitFlop, Holster, Loewenweiss items) disappear from all three needs-collections once conditions become vendor-only → Mitigation: intentional per proposal.md (avoids duplicating the Schoenen/Kleding/Accessoires axis); those products remain reachable via Schoenen and their own brand collection.
- [Risk] This store is non-public dev-only, so the handle rename does not break real inbound links, but it would if applied carelessly to a live shop later → Mitigation: none needed now; flag as a live-migration consideration if this pattern is repeated on the production shop.

## Migration Plan

1. Grep the theme for literal `dagelijks-comfort` references beyond `templates/index.json`'s occasions block and `snippets/ob-occasion-image.liquid`, to confirm the full blast radius before renaming.
2. Run `collectionUpdate` on the three live Shopify collections: replace `ruleSet.rules` with vendor `EQUALS` conditions (`appliedDisjunctively: true`); for the `dagelijks-comfort` collection, also update `title` to "Fashion & Lifestyle" and `handle` to `fashion-lifestyle`.
3. Pull the live `templates/index.json` first (per this project's JSON-template drift-check rule), then update it: occasions block's `comfort` entry (`collection` → `fashion-lifestyle`, refreshed `number_label`), hero and occasions section copy that referenced "comfort"/"everyday comfort"/"sitting".
4. Update `snippets/ob-occasion-image.liquid`'s `case collection.handle` branch for the new handle, picking a fashion/lifestyle-appropriate curated asset.
5. Update `COLLECTIONS.md` to document the new vendor-based rule set, the SKU-weight rationale, and the RH+/Magnum/Sweaty-Betty caveats.
6. Push the changed theme files to the live active theme (`148245381229`, `--only <files>`); run `shopify theme check` for the Liquid edit.
7. Verify live in the browser: occasion cards render correct titles/links/images; `fashion-lifestyle` has real Juicy Couture/Pas de Monaco products; Sport & Training and Outdoor & Werk no longer show the same Odlo/Hi-Tec products confirmed overlapping earlier.

**Rollback:** collection rule/title/handle changes are reversible via another
`collectionUpdate` (the previous `ruleSet` is captured in this design doc and
in `COLLECTIONS.md`'s git history); theme file changes are reversible via
`git revert` + re-push.

## Open Questions

- Should Sweaty Betty be dropped from the Sport & Training vendor condition now, or stay provisional until Nick confirms the feed roster? Left provisional per the Decisions section above — revisit once confirmed; doesn't change the specs, approach, or task breakdown either way.
