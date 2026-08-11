# Akeneo sync — issues for Nick

Found while building the PLP/PDP colour swatches + filters against the first 7 synced products (2026-08-11). All four are **data/sync-side**, not theme bugs — the theme renders faithfully whatever the feed provides.

Ordered by impact.

---

## 1. Metaobject entries are created as DRAFT — breaks any feature built on them

Affects **every metaobject type the sync creates**, not just one. Confirmed on both:

| Type | Entries | Status as synced |
|---|---|---|
| `filtercolors` | 12 | all DRAFT |
| `activities` | 2 (`lifestyle`, `running`) | all DRAFT |

**Effect:** the storefront can't read draft metaobjects. For `filtercolors` this meant the "Kleur" filter had **zero visible values and Shopify dropped it from the storefront completely** — no colour filter at all. For `activities` it means the PDP feature-icon row would render empty. In both cases it looks fully configured and correct in the admin (admin *can* see drafts, swatches and all), which makes this very easy to misdiagnose as an indexing delay or a theme bug.

**Status:** flipped all 12 `filtercolors` (2026-08-11) and both `activities` (2026-08-11) to ACTIVE manually via `metaobjectUpdate`, so both work right now. **This will regress on every re-sync** — and on any *new* metaobject type added later — unless the sync emits entries as ACTIVE.

**Fix:** create/update metaobject entries with `capabilities: { publishable: { status: ACTIVE } }`. Worth fixing once in whatever shared code path emits metaobjects, rather than per type.

**Verify** (swap the type, or check each type the sync creates):
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
> While wiring up the colour swatches, filters and PDP icons on the dev store I ran into a few things on the Akeneo/sync side — full detail with GraphQL snippets is in `NICK.md`, but the short version:
>
> **1. The big one:** metaobject entries are created as **DRAFT**. The storefront can't read draft metaobjects, so the colour filter didn't appear on the storefront *at all* — even though it looks completely fine in the admin. This isn't specific to colours: `activities` came through as DRAFT too, which would have left the PDP icon row empty. I've set the existing entries to ACTIVE by hand (12 `filtercolors` + 2 `activities`) so both work now, but it'll break again on your next sync — and on any new metaobject type — unless they're emitted as ACTIVE. Probably one fix in whatever shared code path writes metaobjects.
>
> **2.** "Black Grey" is tagged as **blue + grey** instead of black + grey, so that product turns up under the Blue filter showing a black item. Might be worth checking other two-word colour names too.
>
> **3.** `brown` has hexcode `#FFD700`, which is gold — so the brown filter chip renders gold.
>
> **4.** The metaobject display name is the English `code` ("brown") instead of the Dutch `label` ("bruin") — on both `filtercolors` and `activities`. The Dutch labels are in the data already; it's the definition's display-name setting.
>
> **5. Two questions on `activities`**, which I need answered before I build the PDP icon row: all 7 products currently point at the same single value, *Lifestyle* — including the footwear — and nothing references *Running*. Is that real data yet, or a placeholder? And should the field be a **list**? Right now it's a single `metaobject_reference`, so a product physically can't carry both *Running* and *Lifestyle*.
>
> No rush on 2–4, but 1 is worth doing before the next sync run, and 5 is blocking me.
>
> Thanks!
