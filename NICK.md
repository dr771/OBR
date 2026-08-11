# Akeneo sync — issues for Nick

Found while building the PLP/PDP colour swatches + filters against the first 7 synced products (2026-08-11). All four are **data/sync-side**, not theme bugs — the theme renders faithfully whatever the feed provides.

Ordered by impact.

---

## 1. Metaobject entries arrive DRAFT — RESOLVED, no action for Nick

**Corrected attribution (2026-08-11, per Nick).** This is **not an Akeneo sync bug**. It's a Shopify platform default: any metaobject definition with the `publishable` capability enabled makes *new API-created entries* DRAFT unless the creating request explicitly sets `capabilities.publishable.status: ACTIVE`. Nick hit and fixed this on the SweatyBetty project already; it was recorded there in July and I failed to check that before writing it up here as a defect. Both OB definitions have `capabilities.publishable.enabled: true`, which is what exposes the default.

Keeping the entry because the *symptom* is worth knowing — it is genuinely hard to diagnose — not because anything is owed by the sync side.

| Type | Entries | Status as first seen | Now |
|---|---|---|---|
| `filtercolors` | 12 | all DRAFT | ACTIVE |
| `activities` | 2 (`lifestyle`, `running`) | all DRAFT | ACTIVE |

**Symptom:** the storefront can't read draft metaobjects. For `filtercolors` the "Kleur" filter had **zero visible values, so Shopify dropped it from the storefront entirely**. For `activities` the PDP icon row would render empty. In both cases the admin shows everything correctly configured (admin *can* see drafts), so it reads as an indexing delay or a theme bug.

**Status:** all 14 entries set ACTIVE via `metaobjectUpdate` on 2026-08-11 — verified holding, `filtercolors` did not regress across the syncs since.

**Two ways to keep it fixed**, if it ever recurs on OB:
1. The creating request sets `capabilities: { publishable: { status: ACTIVE } }` — the SB fix, presumably already carried by this connector.
2. Disable the `publishable` capability on the definition, so entries can't be DRAFT at all. Structurally safer for sync-managed reference data, but **not applied here**: if the connector explicitly sends a publish status, removing the capability could break its writes. Worth agreeing with Nick before touching.

**Verify** (per type, after any new metaobject type appears):
```graphql
{ metaobjects(type: "filtercolors", first: 50) { edges { node {
  handle capabilities { publishable { status } } } } } }
```

---

## 2. "Black Grey" is tagged **blue** + grey

Every `Black Grey` variant of `SB8985` (Sweaty Betty After Class Longline Sweatshirt) carries:

```
custom.filtercolors = [ 224312590445 (blue), 224461095021 (grey) ]
```

**Effect:** filtering by **Blauw** returns this product showing a black sweatshirt — it's the first variant matching "blue", so Shopify legitimately picks it. Wrong data, correct rendering.

**Fix:** should be `black` + `grey`. Worth checking whether other multi-word colour names got the same mistreatment.

---

## 3. `brown` has the wrong hexcode

```
brown → hexcode #FFD700     (that's gold — the gold entry has the same value)
```

**Effect:** the "brown" filter chip renders **gold** on the storefront. The other 11 hexcodes are correct.

---

## 4. Metaobject display name is the English `code`, not the Dutch `label`

The storefront colour filter lists **"brown", "black", "blue"** rather than **"bruin", "zwart", "blauw"**. Both definitions have `displayNameKey: "code"` — `filtercolors` and `activities` alike.

The Dutch values are present and correct in each entry's `label` field — they're just not what the metaobject definition uses as its display name, so Shopify surfaces `code` instead.

**Effect:** English colour names on a Dutch storefront. (Lower impact on `activities`, where the theme reads the `label` field directly — but the admin and any native filter built on it still show English.)

**Fix:** set both metaobject definitions' display name to the `label` field.

---

## 5. `activities`: every product carries the same single value

All 7 synced products reference the **same** `activities` entry — `lifestyle` — including footwear (Holster Soleseeker, FitFlop sandals, Loewenweiss slippers). The `running` entry is referenced by nothing.

Two questions rather than a definite bug:

1. **Is this real data or a sync placeholder?** "Lifestyle" on every product across four brands looks like a default rather than a per-product attribute.
2. **Should `custom.activities` be a list?** It's currently defined as `metaobject_reference` (**exactly one** value per product), where the equivalent field on the reference project is `list.metaobject_reference` (many). If a product is meant to carry several activities — e.g. *Running* + *Lifestyle* — the definition needs changing to a list; the value can't hold two as it stands.

**Effect:** blocks the PDP feature-icon row from being built to the right shape. A single-value field means one icon per product, which is a different feature from a multi-icon row.

---

## Short message for Nick

> Hi Nick,
>
> While wiring up the colour swatches, filters and PDP icons on the dev store I ran into a few things on the data side — full detail with GraphQL snippets is in `NICK.md`, but the short version. (The DRAFT-metaobject one I'd flagged earlier is **withdrawn** — you're right that it's the Shopify publishable-capability default, not the sync. Sorry for the noise; the entries are all ACTIVE now and have stayed that way.)
>
> **2.** "Black Grey" is tagged as **blue + grey** instead of black + grey, so that product turns up under the Blue filter showing a black item. Might be worth checking other two-word colour names too.
>
> **3.** `brown` has hexcode `#FFD700`, which is gold — so the brown filter chip renders gold.
>
> **4.** The metaobject display name is the English `code` ("brown") instead of the Dutch `label` ("bruin") — on both `filtercolors` and `activities`. The Dutch labels are in the data already; it's the definition's display-name setting.
>
> **5. Two questions on `activities`**, which I need answered before I build the PDP icon row: all 7 products currently point at the same single value, *Lifestyle* — including the footwear — and nothing references *Running*. Is that real data yet, or a placeholder? And should the field be a **list**? Right now it's a single `metaobject_reference`, so a product physically can't carry both *Running* and *Lifestyle*.
>
> No rush on 2–4, but 5 is blocking me.
>
> Thanks!
