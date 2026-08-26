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

**Status (2026-08-26): RESOLVED on dev, but the obvious fix was not sufficient — read this before redoing it.**

Three separate things were wrong, and only doing all three made the storefront show Dutch:

1. `displayNameKey` was set to `label` on both definitions (the fix originally written above). **This alone changed nothing on the storefront.**
2. The Search & Discovery filters themselves map a *field* to the displayed label, independently of `displayNameKey` — both **Kleur** and **Activities** were mapped to `code`. Repointed to `label` in *Manage values → Label*. The app's Values screen then showed Dutch correctly, but the **storefront still did not** — Shopify's storefront filter index kept serving the old text (and for `hiking` served `"Hiking"`, which matches neither `code` nor `label`). Forcing a product reindex changed nothing.
3. So the theme now resolves the label from the metaobject itself instead of trusting the filter index (`snippets/ob-facet-value-label.liquid`).

**New sync requirement — action for Nick.** Step 3 cannot read the field named `label`: **`label` is a reserved property on Shopify's metaobject Liquid drop**, so `entry.label` returns the entry's *handle*, never the field. Verified live: for the `pink` entry, `hexcode` → `#FFC0CB` and `code` → `pink` read correctly, while `label` → `pink` where the stored value is `roze`.

A duplicate field **`display_label`** was therefore added to both `filtercolors` and `activities`, and all 23 existing entries were backfilled from `label`. **The sync must populate `display_label` alongside `label` on any new or updated entry** — otherwise new colours/activities silently fall back to Shopify's (English) index label. Renaming `label` itself would have been cleaner but would break the connector, so the duplicate was chosen deliberately.

---

## 5. `activities`: every product carries the same single value

All 7 synced products reference the **same** `activities` entry — `lifestyle` — including footwear (Holster Soleseeker, FitFlop sandals, Loewenweiss slippers). The `running` entry is referenced by nothing.

Two questions rather than a definite bug:

1. **Is this real data or a sync placeholder?** "Lifestyle" on every product across four brands looks like a default rather than a per-product attribute.
2. **Should `custom.activities` be a list?** It's currently defined as `metaobject_reference` (**exactly one** value per product), where the equivalent field on the reference project is `list.metaobject_reference` (many). If a product is meant to carry several activities — e.g. *Running* + *Lifestyle* — the definition needs changing to a list; the value can't hold two as it stands.

**Effect:** blocks the PDP feature-icon row from being built to the right shape. A single-value field means one icon per product, which is a different feature from a multi-icon row.

---

## 6. Shopify's taxonomy `category` is empty on almost every product

Found 2026-08-26. The storefront "Categorie" filter is built on Shopify's **standard product taxonomy** field (`filter.p.t.category`). That field is set on exactly **1 of 26 products** (Hi-Tec Silver Shadow OG → `Apparel & Accessories > Shoes > Sneakers`); every other product has `category: null`.

The real category data *does* arrive, but in a metafield: `custom.shopify_originalbrands_category`, with 9 distinct values —

`Sandal, Slipper, Legging, Shirt, Sneaker, Outdoor, Headware, Ondergoed, Kousen`

**Effect:** the Categorie filter shows a single value ("Sneakers") instead of 9, so it is effectively useless to shoppers.

**Two possible fixes, needs a decision:** either the sync populates Shopify's native taxonomy `category` per product, or we point the filter at `custom.shopify_originalbrands_category` and leave the taxonomy field alone. The metafield is the faster route and is already correct; the taxonomy field is the more "native" one and also feeds Shopify's own categorisation features.

## 7. Category / gender / product-type values are English (and mixed-language)

Found 2026-08-26. Unlike colours and activities, these are **plain text on the product**, with no metaobject and therefore no `label` field to translate — so the theme cannot fix them the way it fixes Kleur/Activities:

| Filter | Source | Values |
|---|---|---|
| Gender | `custom.genderid` (`single_line_text_field`) | `Men`, `Women`, `Unisex` |
| Producttype | Shopify `productType` | `Shoe`, `Fashion`, `Sport`, `Sneaker` |
| Categorie | `custom.shopify_originalbrands_category` | mixed: `Slipper`, `Shirt`, `Legging` … but also `Ondergoed`, `Kousen` |

**Effect:** English facet values on a Dutch storefront, and the category list is inconsistent with itself (Dutch and English mixed in one facet).

**Fix:** ideally the feed supplies Dutch values (`Heren`/`Dames`/`Uniseks` etc.) and one consistent language for categories. Failing that these can be renamed per value in Search & Discovery, but that is manual and drifts as soon as new values appear.

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
> **4 (update, 2026-08-26).** This one turned out to have three layers and is now working on dev — but it needs one thing from the sync. `label` is a **reserved word** in Shopify's Liquid, so a theme literally cannot read a metaobject field called `label` (it silently returns the handle instead — `pink` instead of `roze`). I've added a duplicate field **`display_label`** to `filtercolors` and `activities` and backfilled the existing 23 entries. **Could the sync write `display_label` alongside `label`?** Otherwise any new colour or activity will show up in English.
>
> **6.** The Categorie filter shows only 1 value instead of 9, because Shopify's native taxonomy `category` field is empty on 25 of 26 products. The real data is in `custom.shopify_originalbrands_category` (9 values). Should the sync fill Shopify's taxonomy field, or shall we just point the filter at that metafield?
>
> **7.** Gender (`Men`/`Women`/`Unisex`) and Producttype (`Shoe`/`Fashion`/`Sport`) come through in English, and the category values are mixed language (`Slipper`, `Shirt` … but `Ondergoed`, `Kousen`). These are plain text, so unlike the colours the theme can't translate them — can the feed supply Dutch, and pick one language for categories?
>
> No rush on 2–4, but 5 is blocking me.
>
> Thanks!
