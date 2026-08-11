# Akeneo sync — issues for Nick

Found while building the PLP/PDP colour swatches + filters against the first 7 synced products (2026-08-11). All four are **data/sync-side**, not theme bugs — the theme renders faithfully whatever the feed provides.

Ordered by impact.

---

## 1. `filtercolors` metaobject entries are created as DRAFT — breaks the colour filter entirely

All 12 `filtercolors` entries had `capabilities.publishable.status: DRAFT`.

**Effect:** the storefront can't read draft metaobjects, so the "Kleur" filter had **zero visible values and Shopify dropped it from the storefront completely** — no colour filter at all. It looks fully configured and correct in the admin (admin *can* see drafts, swatches and all), which makes this very easy to misdiagnose as an indexing delay or a theme bug.

**Status:** flipped all 12 to ACTIVE manually via `metaobjectUpdate` on 2026-08-11, so it works right now. **This will regress on the next re-sync** unless the sync emits them as ACTIVE.

**Fix:** create/update `filtercolors` entries with `capabilities: { publishable: { status: ACTIVE } }`.

**Verify:**
```graphql
{ metaobjects(type: "filtercolors", first: 20) { edges { node {
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

## 4. Filter shows the English `code`, not the Dutch `label`

The storefront colour filter lists **"brown", "black", "blue"** rather than **"bruin", "zwart", "blauw"**.

The Dutch values are present and correct in each entry's `label` field — they're just not what the metaobject definition uses as its display name, so Shopify surfaces `code` instead.

**Effect:** English colour names on a Dutch storefront.

**Fix:** set the `filtercolors` metaobject definition's display name to the `label` field.

---

## Short message for Nick

> Hi Nick,
>
> While wiring up the colour swatches and filters on the dev store I ran into four things on the Akeneo/sync side — full detail with GraphQL snippets is in `NICK.md`, but the short version:
>
> **1. The big one:** the `filtercolors` metaobject entries are created as **DRAFT**. The storefront can't read draft metaobjects, so the colour filter didn't appear on the storefront *at all* — even though it looks completely fine in the admin. I've set the 12 existing entries to ACTIVE by hand so it works now, but it'll break again on your next sync unless they're emitted as ACTIVE.
>
> **2.** "Black Grey" is tagged as **blue + grey** instead of black + grey, so that product turns up under the Blue filter showing a black item. Might be worth checking other two-word colour names too.
>
> **3.** `brown` has hexcode `#FFD700`, which is gold — so the brown filter chip renders gold.
>
> **4.** The filter shows the English `code` ("brown") instead of the Dutch `label` ("bruin"). The Dutch labels are in the data already; it's the metaobject definition's display-name setting.
>
> No rush on 2–4, but 1 is worth doing before the next sync run.
>
> Thanks!
