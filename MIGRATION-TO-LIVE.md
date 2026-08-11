# Migration to the live shop — checklist

**Context.** Per Nick's Akeneo setup there are **two separate Shopify shops**: this dev shop (`original-brands-dev.myshopify.com`, never public under the real domain) and a live shop stood up at launch. Launch is therefore a **store-to-store migration**, not a theme publish.

**How to use this file.** Append to it *as things are discovered*, not at launch. Whenever work here depends on something that lives in the shop rather than in this repo — an app config, a metafield definition, a metaobject entry, an admin setting — add a line. The point is that nothing is reconstructed from memory under launch pressure.

Status legend: `[ ]` todo · `[x]` done · `[~]` in progress/partially known

---

## 1. Catalog data — Nick / Akeneo

- [ ] Point the Akeneo sync at the live shop and run a full product push (products, variants, media, metafields).
- [ ] **Metaobject entries must be `ACTIVE`, not `DRAFT` — check every type, not just colours.** DRAFT entries are invisible to the storefront, which silently removes the *entire* colour filter and empties the PDP icon row, while still looking perfect in the admin. This bit us on dev twice: `filtercolors` and then `activities` (see playbook D3 / `NICK.md` #1). Assume any *new* metaobject type arrives DRAFT until Nick fixes the shared code path. Verify after the first sync, per type:
  ```graphql
  { metaobjects(type: "filtercolors", first: 50) { edges { node {
    handle capabilities { publishable { status } } } } } }
  ```
- [ ] Confirm the outstanding `NICK.md` data fixes landed on live (colour tagging, hexcodes, Dutch labels) rather than only on dev.

## 2. Custom data definitions

These do **not** travel with a theme export, and bare auto-created metafields are not enough.

- [ ] **Metafield definitions** exist with `access.storefront: PUBLIC_READ` — without it Liquid cannot read the value at all, so swatches and filters break silently: `custom.filtercolors`, `custom.colorid`, `custom.sizeid`, `custom.itemid`, `custom.genderid`, `custom.activities`, `custom.shopify_originalbrands_category`, `akeneo.available_erp_sizes`.
- [ ] **Metaobject definitions** `filtercolors` and `activities` exist with `access.storefront: PUBLIC_READ`.
- [ ] `filtercolors` metaobject **display name is the `label` field** (Dutch), not `code` — otherwise the storefront filter lists "brown"/"black" instead of "bruin"/"zwart" (`NICK.md` #4).
- [ ] Metaobject **GIDs will differ** on the live shop — this is fine, the theme resolves by key name and hardcodes no GIDs (verified 2026-08-11). Nothing to do; noted so nobody "fixes" it.

## 3. Apps & admin config

- [ ] **Search & Discovery filters recreated by hand** — these are app config, *not* part of any Akeneo sync, and will not exist on a fresh shop. Currently on dev: **Kleur** (`filtercolors`, variant metafield), **Maat** (`akeneo.available_erp_sizes`, product metafield), **Merk** (`vendor`), **Gender** (`custom.genderid`, product metafield), **Producttype**, **Prijs**. Match labels and order.
- [ ] Any other apps installed on dev are installed and configured on live.

## 4. Theme

- [ ] `git clone` this repo and `shopify theme push` to the live shop. The theme is fully in git — this is the easy part.
- [ ] Push with `--only <files>` if pushing onto an existing configured theme, so `settings_data.json` and templates aren't clobbered.
- [ ] Re-run the swatch/facet verification on live: PLP chips + tooltips + hover swap, PDP chips, colour filter chips render real hex, filtering swaps card images.

## 5. URLs & SEO

- [ ] **Redirect map from the legacy Drupal-ish site.** Still an open question in the playbook: the old site gives each colour/size combo its own URL, which consolidate into one Shopify product. Needs a strategy, not just a file.
- [ ] Canonical/domain settings, sitemap, robots.

## 6. Go-live

- [ ] Remove the storefront password on the live shop.
- [ ] Domain pointed at the live shop.
- [ ] Analytics / consent banner / newsletter wired up.

---

## Known to be non-transferable (summary)

The recurring theme: **a theme copy carries only the theme.** Everything below lives in the shop and must be recreated or re-synced:

| Thing | Travels with theme? | Who |
|---|---|---|
| Liquid, CSS, JS, spec docs | ✅ (git) | us |
| Products, variants, media, metafield *values* | ❌ | Nick / Akeneo |
| Metafield & metaobject *definitions* (+ storefront access) | ❌ | Nick / Akeneo |
| Metaobject entry ACTIVE/DRAFT status | ❌ | Nick / Akeneo |
| Search & Discovery filter config | ❌ | by hand in admin |
| Theme settings (`settings_data.json`) | ⚠️ only if pushed | us |
