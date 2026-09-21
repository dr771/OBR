# Post-sync check

Run this after **every** Akeneo sync by Nick. Each item below has broken silently at least once — nothing errors, nothing is logged, the shop just quietly shows the wrong thing.

Reference vocabulary: [cats-dev.csv](cats-dev.csv). Open issues and history: [NICK.md](NICK.md).

Storefront password: `original`. Shop: `original-brands-dev.myshopify.com`.

---

## 0. Ground rule — never diagnose data off the facet

The storefront filter index **only refreshes when the product itself is saved**. A metafield written through the API leaves it stale indefinitely. So a wrong value in the facet means either bad data *or* a stale index, and you cannot tell which from the facet.

To read the truth, open the product in admin: `/admin/products/<id>/metafields`. See check 1 for how to clear the index.

---

## 1. Did the sync leave the filter index behind?

**Why:** Nick's connector writes metafields without saving the product, so the whole catalogue's facet can stay a generation behind (2026-09-21, 412 of 564 products).

**Check** — in the browser console on `/collections/all`:

```js
const r = await fetch('/collections/all?nocache=' + Date.now());
const doc = new DOMParser().parseFromString(await r.text(), 'text/html');
const v = {};
doc.querySelectorAll('input[name^="filter.p.m.custom.shopify_originalbrands_category"]').forEach(i => {
  const t = (i.closest('label')||{}).innerText || '';
  v[i.value] = +(t.match(/\((\d+)\)/)||[])[1] || 0;
});
console.table(v);
```

Then pick one value that looks like a raw Akeneo code and open a product from that bucket in admin. **Use a non-prefix pair** — `boots`→`Laarzen`, `pants`→`Broeken`, `top`→`Bovenkleding`. Never `Slipper`→`Slippers` or `Sandal`→`Sandalen`: the code is a prefix of the label, so a prefix-matching filter would look identical and the test proves nothing.

- Admin shows the Dutch label but the facet shows the code → **index is stale**, do the fix below.
- Admin shows the code too → **real data error**, goes to Nick.

**Fix (≈2 min, whole catalogue):** Products list → tick the header checkbox → **Select all in this store** → Actions → **Add tags** `ob-reindex-touch` → Save. Wait for the facet to settle, then the same path with **Remove tags**.

Use the bulk route, never individual saves — saving a product in the admin UI also clears its pending Shopify-taxonomy category suggestion and writes `Uncategorized`.

---

## 2. Did a metaobject field break?

**Why:** when the connector rewrites a metaobject *definition*, surviving fields are orphaned in the storefront index and start returning the entry's handle instead of its value. Happened to `label`, `display_label` and twice to `label_nl`.

**Check:** load `/collections/all` and look at the **Activities** and **Kleur** facets.

- Dutch (`Wandelen`, `Fietsen`, `Skiën & Snowboard`) → fine
- English or a humanized handle (`Hiking`, `Cycling`) → broken

**Fix:** delete the field from the definition, re-create it, re-write every entry's value. Exact mutations and definition ids in [NICK.md](NICK.md) item 4. Works instantly — do not wait, do not force a reindex, neither does anything.

---

## 3. Are new metaobject entries DRAFT?

**Why:** Shopify creates API-made entries as DRAFT unless the request sets `ACTIVE`. Drafts are invisible to the storefront, and a facet with zero visible values is dropped from the page entirely — so the filter does not look broken, it looks absent.

**Check:**

```graphql
{ metaobjects(type: "filtercolors", first: 50) { edges { node {
  handle capabilities { publishable { status } } } } } }
```

Repeat for `activities` and any new type. **Fix:** `metaobjectUpdate` with `capabilities: { publishable: { status: ACTIVE } }`.

---

## 4. Any category value outside the vocabulary?

**Why:** values that are in neither column of `cats-dev.csv` cannot be mapped, cannot be built into a collection, and are invisible until someone compares by hand. `Outdoor` sat on a Hi-Tec product for weeks.

**Check:** take the value list from check 1 (after the index is clean) and compare against `cats-dev.csv`. Every value should appear in the **right-hand** column.

- appears in the **left-hand** column → the sync sent the code instead of the label
- appears in **neither** → unknown value, needs a decision before it can be used

Both go to Nick, with the affected SKUs.

---

## 5. Quick sanity sweep

- **Product count** on `/collections/all` matches what Nick reports synced
- **Gender / Producttype** facets still render Dutch — if Nick starts sending Dutch values, the stopgap mapping in `snippets/ob-facet-value-label.liquid` becomes dead weight and should be dropped
- **Product titles** are names, not attribute dumps (NICK.md item 8)
- **Vendor facet** brand list matches the expected roster (NICK.md item 9)
