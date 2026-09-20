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

**Status (2026-08-31): RESOLVED on dev. Nick's sync writes `label_nl`, the theme reads it, Dutch labels are live. The real root cause was NOT field naming — see "Actual root cause" below before touching anything.**

Three separate things were wrong, and only doing all three made the storefront show Dutch:

1. `displayNameKey` was set to `label` on both definitions (the fix originally written above). **This alone changed nothing on the storefront.**
2. The Search & Discovery filters themselves map a *field* to the displayed label, independently of `displayNameKey` — both **Kleur** and **Activities** were mapped to `code`. Repointed to `label` in *Manage values → Label*. The app's Values screen then showed Dutch correctly, but the **storefront still did not** — Shopify's storefront filter index kept serving the old text (and for `hiking` served `"Hiking"`, which matches neither `code` nor `label`). Forcing a product reindex changed nothing.
3. So the theme now resolves the label from the metaobject itself instead of trusting the filter index (`snippets/ob-facet-value-label.liquid`).

**New sync requirement — action for Nick.** Step 3 cannot read the field named `label`: **`label` is a reserved property on Shopify's metaobject Liquid drop**, so `entry.label` returns the entry's *handle*, never the field. Verified live: for the `pink` entry, `hexcode` → `#FFC0CB` and `code` → `pink` read correctly, while `label` → `pink` where the stored value is `roze`.

A duplicate field **`display_label`** was therefore added to both `filtercolors` and `activities`, and all 23 existing entries were backfilled from `label`. Renaming `label` itself would have been cleaner but would break the connector, so the duplicate was chosen deliberately.

**Discovery + fix (2026-08-31): `display_label` never actually worked either — `display_label` is shadowed on the Liquid drop exactly like `label`.** Nick switched the sync to write `display_label`, and the Admin API confirms the field genuinely holds the Dutch text (`pink` entry → `display_label` = `roze`). But on the **storefront Liquid drop**, `entry.display_label` returns the entry's *handle* (`pink`), never the field — identical to the `label` bug.

Proven name-based, not stale data or caching:
- `display_label` was set to `ZZZTEST` via the Admin API; the storefront still rendered `pink`. So the field is not being read at all.
- `.value` / `.type` access does not help. `display_label.type` even reports `single_line_text_field`, so it *looks* like a valid field read and fails silently.
- On the same entry, `hexcode` → `#FFC0CB` reads correctly, so neutral field names are fine.
- A newly created field `label_nl` = `roze` on the same entry read back correctly on the storefront on the first try.

### Actual root cause (2026-08-31) — a field goes unreadable after a connector definition rewrite

The "reserved property name" theory was **wrong**, and it cost most of a day. What actually happens:

**When the Akeneo connector rewrites the metaobject *definition*, fields are left orphaned in Shopify's storefront index and stop serving their values from Liquid.** The connector prunes fields that are not in its mapping — when Nick switched the mapping to `label_nl`, it deleted `label` and `display_label` outright, and that rewrite also broke `label_nl`, which had been verified working 12 minutes earlier.

Symptom, and how to tell the two cases apart from Liquid:
- key returns **empty** → the field does not exist on the definition
- key returns **the entry's handle** → the field exists but is orphaned

Everything else looks healthy and will mislead you: the Admin API returns the correct value, `access.storefront` is `PUBLIC_READ`, `.type` reports `single_line_text_field`, `translations` is empty, and sibling fields on the same entry (`code`, `hexcode`) read correctly.

**Fix — delete the field, re-create it, re-write the values. Works instantly, no reindex, no waiting:**
```graphql
# 1. drop it (displayNameKey must not point at it while deleting)
metaobjectDefinitionUpdate(id: $defId, definition: {
  displayNameKey: "code", fieldDefinitions: [{delete: {key: "label_nl"}}] })
# 2. re-create it
metaobjectDefinitionUpdate(id: $defId, definition: {
  fieldDefinitions: [{create: {key: "label_nl", name: "label_nl", type: "single_line_text_field"}}] })
# 3. re-write every entry's value with metaobjectUpdate, then optionally
#    put displayNameKey back to "label_nl"
```
Definition ids: `filtercolors` `20196884589`, `activities` `20193411181`.

Things that did **not** work: writing a sentinel value (never propagated), waiting, forcing a reindex, renaming, `.value`/`.type` access. Re-creating the field is the only lever found.

**Current state:** `label_nl` exists on both definitions, is written by Nick's sync, and was recreated + re-backfilled after his 15:02 sync. Live-verified — Kleur renders `zwart`/`roze`/`blauw`/… and Activities renders `Wandelen`. Nothing further is owed by Nick.

**Standing risk:** any future Akeneo *mapping* change re-breaks this the same way. Routine value syncs appear unaffected (not yet observed across one). If the facets suddenly render English again, this is the first thing to check — and the fix above takes about two minutes.

Note `label` and `display_label` are **gone** — Nick's connector deleted them when the mapping changed. The Dutch text now exists only in `label_nl`, so there is no second copy to backfill from if that field is ever pruned.

**Lesson for any future field added to route around this:** verify the *storefront Liquid render*, never just the Admin API. The API reports the field correctly whether or not Liquid can read it, which is exactly how `display_label` went unnoticed for 5 days.

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

**Escalated 2026-09-18 — no longer just a filter-label problem.** The two-level main navigation (playbook D19) builds automatic sub-collections on `custom.shopify_originalbrands_category` (Sandalen, Teenslippers, Sneakers, Broeken, …). Live values at 565 products: 25 distinct, mixed Dutch/English and casing (`Sandal`, `Teenslipper`, `Slipper`, `Clogg`, `boots`, `pants`, `buttonupshirt`, `sweater`, `vest`, `Kousen`, `Handschoenen`, `Headware`, `Ondergoed`, …), and `Kousen` sits under product type `Shoe`. Collection rules can OR the raw values, but every value added later lands in no sub-collection silently — so a fixed vocabulary is required before the menu is built. Message sent (NL):

> Hoi Nick, korte vraag over de categorie-waarden in de feed. Tot nu toe gebruikte ik ze alleen als filter, maar nu ga ik er ook het hoofdmenu en de collecties op bouwen (Schoenen → Sandalen / Teenslippers / Sneakers …). Daarvoor moet elke waarde exact en stabiel zijn: elke nieuwe of afwijkende schrijfwijze valt anders stil buiten het menu.
>
> Nu zie ik 25 waarden, gemengd NL/EN en hoofdletters (`Sandal`, `Teenslipper`, `boots`, `pants`, `Clogg`, `buttonupshirt`, `Kousen`, `Handschoenen`, `Headware` …), en sokken staan onder producttype `Shoe`.
>
> Wat ik het liefst heb:
> 1. Eén vaste lijst (gesloten vocabulaire), Nederlands, meervoud, consistente hoofdletters: bv. Sandalen, Teenslippers, Slippers, Sneakers, Laarzen, Ballerina's, Clogs, Broeken, Shorts, Shirts, Tops, Vesten, Truien, Jurken, Rokken, Leggings, Ondergoed, Zwemkleding, Sokken, Handschoenen, Mutsen & caps.
> 2. Producttype consistent: Schoenen / Kleding / Accessoires (sokken, handschoenen, mutsen onder Accessoires).
> 3. Gender: Dames / Heren / Kinderen / Uniseks.
> 4. Nieuwe waarden eerst even melden voordat ze in de feed komen, dan hang ik ze meteen aan de juiste collectie.
>
> Als je me de volledige lijst van huidige Akeneo-waarden stuurt, maak ik het mapping-voorstel en jij hoeft alleen te bevestigen. Dank!

## 8. A product's title is an internal attribute description, not a name

Found 2026-09-03, spotted in the new homepage bestsellers grid (`/products/eva-grey-colour-with-holster-branding`, vendor Holster). Its Shopify product title is literally **"EVA grey colour with holster branding"** — reads like a PIM/spec field (colourway + material note) that landed in the customer-facing title, not a real product name the way `FitFlop Airmesh™ Sneaker` or `Ceramicool Run Crew Socks` are.

**Effect:** this exact string shows to shoppers everywhere the title renders — PLP cards, PDP `<h1>`, cart line items, order confirmations.

**Question for Nick:** is this an isolated mis-mapped field on one product, or does it point at a wider issue — e.g. a fallback that fires when Akeneo's real name field is blank for some products? Worth spot-checking whether other products in the same import batch/brand have the same pattern before assuming it's a one-off.

## 9. Featured brand roster doesn't match the full-catalog SKU export

Found 2026-09-03, while restructuring the homepage "Shop per behoefte" collections. The Merken page / homepage brand marquee and featured-brands grid list 11 brands including **Sweaty Betty** and **Nike Swim**, but a full-catalog SKU export shows **zero SKUs** for Sweaty Betty and only 3 for Nike Swim — while **RH+** (2801 SKUs) and **Magnum** (620 SKUs, work/tactical boots) have real volume but aren't featured on either page yet.

**Question for Nick:** is Sweaty Betty actually leaving the feed (it currently has a handful of live synced test products, so it hasn't fully dropped out yet), and when are RH+ and Magnum expected to sync? The featured-brand roster (Merken page + homepage) will need rebuilding around whatever the confirmed final set is — not urgent, but the sooner this is confirmed the less rework.

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
> **4 (update, 2026-08-31) — done, nothing needed from you.** Thanks for switching the sync to `label_nl`, that's exactly right and the Dutch labels are live now (colours show `zwart`/`roze`/…, Activities shows `Wandelen` instead of `Hiking`).
>
> One thing worth knowing for the future: when the connector changes its field mapping, it rewrites the metaobject definition — and that leaves the surviving fields unreadable from the storefront theme until they're re-created. That's what happened after your sync: `label_nl` had the right values in the API, but the theme still got English. Re-creating the field fixed it in two minutes.
>
> So **if the colour or activity filters ever show English again after a mapping change, ping me** — it's a known two-minute fix on my side, not a data problem on yours. Nothing to do otherwise.
>
> **6.** The Categorie filter shows only 1 value instead of 9, because Shopify's native taxonomy `category` field is empty on 25 of 26 products. The real data is in `custom.shopify_originalbrands_category` (9 values). Should the sync fill Shopify's taxonomy field, or shall we just point the filter at that metafield?
>
> **7.** Gender (`Men`/`Women`/`Unisex`) and Producttype (`Shoe`/`Fashion`/`Sport`) come through in English, and the category values are mixed language (`Slipper`, `Shirt` … but `Ondergoed`, `Kousen`). These are plain text, so unlike the colours the theme can't translate them — can the feed supply Dutch, and pick one language for categories?
>
> **8.** One product's title is literally `EVA grey colour with holster branding` (`/products/eva-grey-colour-with-holster-branding`) — reads like an internal spec note, not a name. Is that isolated, or could other products have the same real-name-missing pattern?
>
> **9.** The brands featured on our Merken page and homepage (11 of them, including Sweaty Betty and Nike Swim) don't match a full-catalog SKU export you shared — Sweaty Betty shows 0 SKUs there and Nike Swim only 3, while RH+ (2801) and Magnum (620) have real volume but aren't featured yet. Is Sweaty Betty leaving the feed, and when do you expect RH+/Magnum to sync? Want to rebuild our featured-brand list around the confirmed final roster rather than guess.
>
> No rush on 2–4, 8, or 9, but 5 is blocking me.
>
> Thanks!

## 10. Plain-text metafield filters are broken on the Dutch storefront (2026-09-20)

**RESOLVED 2026-09-20 by making Dutch the shop's primary locale.** All three facets recovered instantly, with no reindex: Category 31 values / 564 products, Gender 4 / 565, Maat 70 / 3452, alongside Merk 11 / 565, Kleur 15 / 1345 and Activities 7 / 747. Nothing was owed by Nick for this part. The diagnosis below is kept because the mechanism will recur on the live shop if its primary locale is set to English. See MIGRATION-TO-LIVE.md section 3.

**Third and corrected write-up.** Two earlier versions of this item were wrong and are replaced: the first blamed a lagging Dutch reindex and advised waiting; the second additionally claimed the colour filter was dead. **The colour filter is fine** — it renders `radio` inputs (`swatch-input__input`), not checkboxes, and a checkbox-only selector counted zero. Re-measured type-agnostically below.

English is the shop's primary locale, Dutch is secondary and published. Dutch is served at the root path; `/nl/` is a 404, `/en/` is the alternate.

`/collections/all`, same theme and template, counting every `input[name^="filter."]`:

| Facet | Source | Dutch (root) | English (`/en`) |
|---|---|---|---|
| Category | `custom.shopify_originalbrands_category` — **plain text** | 7 values / **16 products** | 31 / 564 |
| Gender | `custom.genderid` — **plain text** | 3 values / **17 products** | 4 / 565 |
| Maat | `akeneo.available_erp_sizes` — **plain text** | 70 values / **330** | 70 / 3452 |
| Kleur | `custom.filtercolors` — metaobject reference | 15 / 1345 | 15 / 1345 |
| Activities | `custom.activities` — metaobject reference | 7 / 747 | 7 / 747 |
| Merk | `vendor` — native field | 11 / 565 | 11 / 565 |

**The correlation is exact: every plain-text metafield facet is broken or degraded on Dutch, and every metaobject-reference facet plus the native vendor field is identical on both locales.** Metaobject references are GIDs and carry no locale-scoped text; plain-text metafield values are translatable content, so the secondary locale needs its own indexed copy and evidently has not got one for the newly synced products. This is the same structural weakness item 7 already described from the label angle — those three fields are plain text with no metaobject behind them.

The definitions themselves are healthy: `access.storefront: PUBLIC_READ`, 564/565 metafields attached, `useAsCollectionCondition: true`. So this is not the definition-orphaning of item 4 at the product-metafield level.

**Sentinel test** (the method item 4 established as the only reliable one): one product's category metafield was set to `ZZZSENTINEL` via the Admin API and polled for 11 minutes. It appeared in **neither** locale's facet. Restored to `Slipper` afterwards. So the filter index is not taking live edits at the moment, and the Dutch/English split is a property of the index, not of the product data.

**Do not simply wait.** Item 4 records that waiting and a forced reindex both achieved nothing in the earlier case. Worth trying before anything destructive: re-save each filter in Search & Discovery, and re-run the sync now that the definition change has settled. The structural fixes worth discussing with Nick are making Dutch the primary locale, or moving category/gender onto metaobjects the way colours and activities already are.

**Separately, one activity label regressed — FIXED 2026-09-20.** The documented recreate-the-field procedure was run on the `activities` definition (`displayNameKey` → `code`, delete `label_nl`, re-create it, re-write all 9 entry values, `displayNameKey` back to `label_nl`) and the facet now renders `Wandelen`. It worked instantly, no reindex, exactly as item 4 predicts. Confirms the standing risk: Nick's mapping change in this sync re-broke the field, and the next one will too.

**Original symptom.** The `hiking` entry (`gid://shopify/Metaobject/226176467053`, ACTIVE) holds `label_nl` = `Wandelen`, and the facet carries exactly that GID, yet the storefront renders `Hiking`. Sibling entries resolve correctly from the same loop (`cycling` → `Fietsen`, `swimming` → `Zwemmen`), so `snippets/ob-facet-value-label.liquid` is working and `entry.label_nl` is coming back empty for this one entry — the failure mode item 4 documents, now affecting a single entry. Fix per item 4 is to delete and re-create the field and re-write the values, about two minutes. A mapping change did occur in this sync: `custom.activities` is now `list.metaobject_reference`, where it used to be a single reference (which is what item 5 asked for).

**Important:** smart-collection rules read the stored metafield value, not the filter index, so the D19 menu and collection plan is unaffected by all of this. It is a storefront-filter problem only.

## 11. The re-sync is only partly applied, and production differs from the CSV

**Quantified against the CSV, 2026-09-20** (564 products carrying a category value, 31 distinct values). Three generations of values coexist in one field:

| State | Products | Values |
|---|---|---|
| Already the CSV's Dutch label | 90 (16%) | Hemden 20, Truien 20, Broeken 14, Kousen 10, Shorten 10, Headware 5, accessoires 3, Vesten 3, Leggings 2, Bovenkleding 1, Ondergoed 1, Teenslippers 1 |
| Still the raw Akeneo code | 345 (61%) | Slipper 90, Sneaker 80, Sandal 50, boots 26, Ballerina 20, pants 20, vest 18, Clogg 14, Shirt 13, top 5, dress 3, Legging 3, buttonupshirt 1, onepiece 1, swimwear 1 |
| **In no vocabulary at all** | 129 (23%) | **Teenslipper 111**, Handschoenen 14, Rokjes 3, Outdoor 1 |

The third row is the important one and it is not explained by "the sync is half done". `Teenslipper` is neither the code (`toepost`) nor the label (`Teenslippers`). `Handschoenen` is neither the code (`gloves`) nor the label — and note the shop's spelling is **correct** where the CSV's `Handsschoenen` has a typo. `Rokjes` vs the CSV's `Rokken`. These look like an **older, third vocabulary** still sitting in the data, not a partial application of the current one.

Six CSV entries have no product on dev at all: `gloves`, `pyjama`, `skirt`, `robe`, `jacket`, `skipants`.

**Two questions that resolve this before anything is built on it:**

1. **Which Akeneo environment feeds dev?** Nick's note said the CSV lists production options and "test can differ slightly". A 23% orphan rate is not "slightly", so either dev is fed from a different environment than the CSV describes, or the CSV is not the vocabulary actually in use.
2. **Run one full sync to completion, then re-measure.** If the 31 values collapse to the CSV's labels, the pipeline is sound and this was simply an unfinished run. If the orphans survive, there is a second value source in Akeneo.

Until one of those is answered, **do not build the D19 sub-collections on this field** — the menu would silently drop 23% of the catalog. Vendor (11 clean values, matching) and the existing product-type collections are unaffected and remain safe to build on.


Distinct category values on `/en` (the current index) show old codes and new Dutch labels side by side:

| Old value (count) | New value (count) |
|---|---|
| Teenslipper (111) | Teenslippers (1) |
| Shirt (13) + buttonupshirt (1) | Hemden (20) |
| pants (20) | Broeken (14) |
| vest (18) | Vesten (3) |
| Legging (3) | Leggings (2) |
| top (5) | Bovenkleding (1) |

Fully migrated: `shorts` → Shorten (10), `sweater` → Truien (20), `skirt` → **Rokjes** (3). Untouched: Sandal (50), Slipper (90), Sneaker (80), boots (26), Ballerina (20), Clogg (14), Handschoenen (14), Kousen (10), Headware (5), accessoires (3), dress (3), Ondergoed (1), onepiece (1), swimwear (1), Outdoor (1).

Points to raise:

1. **`skirt` is `Rokjes` live but `Rokken` in the CSV Nick sent.** Production does not match his own list.
2. **`shirt` and `buttonupshirt` both map to `Hemden`** — the collision is now real in the data, and the two cannot be separated in a menu or collection.
3. **`Outdoor` (1 product) is in no vocabulary block at all.**
4. **Gender and product type were not touched**: still `Men`/`Women`/`Unisex`/`Kids` and `Shoe`/`Fashion`/`Sport`/`Sneaker`, not the CSV's `W/M/U/K/B/G` and `shoe/sport/fashion`.
5. Label errors still in the CSV: `Handsschoenen` (double s), `Shorten` (not a Dutch word), `Ballerinas` (should be `Ballerina's`), `Headware` (English and misspelt), `Bovenkleding` for `top` (means outerwear, not a top).
