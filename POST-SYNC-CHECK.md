# Post-sync check

Run this after **every** Akeneo sync by Nick. Each item has broken silently at least once: nothing errors, nothing is logged, the shop just shows the wrong thing.

Shop: the pre-live working shop `original-brands-live.myshopify.com` (password-protected storefront; synced from Akeneo **live**). DEV (`original-brands-dev.myshopify.com`, password `original`) still gets Akeneo-dev syncs; run the same checks there only when testing on DEV. Open issues and history: [NICK.md](NICK.md). Category vocabulary: [cats-dev.csv](cats-dev.csv) is the **dev** vocabulary; Akeneo live differs, so confirm live values before treating a mismatch as an error.

**One script for checks 1 and 2.** Paste it into the browser console on any storefront page:

```js
const d = new DOMParser().parseFromString(await (await fetch('/collections/all?nocache=' + Date.now())).text(), 'text/html');
const f = {};
d.querySelectorAll('input[name^="filter."]:not([name*="price"]):not([name*="sizes"])').forEach(i => {
  const l = d.querySelector(`label[for="${CSS.escape(i.id)}"]`);
  (f[i.name.replace(/^filter\.\w\.(m\.)?/, '')] ??= new Set()).add((l?.querySelector('.visually-hidden') || l)?.textContent.replace(/\s+/g, ' ').trim());
});
console.log(Object.fromEntries(Object.entries(f).map(([k, v]) => [k, [...v].join(' | ')])));
```

---

## 1. Category facet: stale index or bad data?

**Why:** Nick's connector writes product metafields without saving the product, and the storefront filter index only refreshes on a product save. So the facet can stay a generation behind the real data (2026-09-21: 412 of 564 products). A wrong facet value is therefore either bad data *or* a stale index, and the facet alone cannot tell you which.

**Check:** compare the `custom.shopify_originalbrands_category` list from the script against the **right-hand** column of `cats-dev.csv`. Known and already with Nick, do not re-report: `Shirt` 4, `Legging` 3, `Slipper` 2, `Sneaker` 2, `Outdoor` 1 (NICK.md item 11).

For any *other* off-vocabulary value, open one product from that bucket at `/admin/products/<id>/metafields`. Use a value whose code is not a prefix of its label (`boots`→`Laarzen`, `pants`→`Broeken`), never `Slipper`→`Slippers`, because a prefix match proves nothing.

- Admin shows the Dutch label → **stale index**. Fix: Products → select all → **Select all in this store** → Actions → **Add tags** `ob-reindex-touch` → Save. The facet settles in about 2 minutes. Then remove the tag the same way. Always use this bulk route: saving a single product in the UI writes `Uncategorized` over its taxonomy suggestion.
- Admin shows the same value → **real data error**. Report it to Nick with the SKUs.

---

## 2. Kleur and Activities still Dutch?

**Why:** a metaobject field can stop serving its value to Liquid, which then shows the English handle, while the Admin API still has the right value. This has happened three times to `label_nl`, most recently on `filtercolors` on 2026-10-21. The trigger is unknown (NICK.md item 4). You cannot see it on the page: the colour filter shows chips only, the name sits in tooltip and screen-reader text. That is why it went unnoticed for weeks.

**Check:** in the script output, `custom.filtercolors` must read `zwart`, `blauw`, `bruin` … and `custom.activities` must read `Wandelen`, `Fietsen` …. English (`black`, `Hiking`) means broken. **Note the time** and ask Nick what his sync did just before, because that is the only way left to find the trigger.

**Fix (≈2 min, instant, no reindex):** delete `label_nl` from the definition, re-create it, re-write every entry's value. Read all values first, because deleting the field wipes them. Exact mutations and definition ids are in NICK.md item 4.

---

## 3. Metaobject `publishable` still off?

**Why:** with the `publishable` capability on, Shopify creates every API-made entry as DRAFT, which the storefront cannot see. The entry simply drops out of the filter, and a facet with no visible values disappears entirely. Since 2026-10-21 the capability is off on both definitions, so entries carry no status. This check makes sure nothing switched it back on.

```graphql
{ metaobjectDefinitions(first: 20) { nodes { type capabilities { publishable { enabled } } } } }
```

Every type must show `enabled: false`, and that includes any *new* type. Fix for `true`: set the type's DRAFT entries ACTIVE (`metaobjectUpdate` → `capabilities: { publishable: { status: ACTIVE } }`), then `metaobjectDefinitionUpdate` → `capabilities: { publishable: { enabled: false } }`.

---

## 4. New or vanished brand?

**Why:** the three needs collections (Sport & Training, Outdoor & Werk, Fashion & Lifestyle) are built from vendor rules. A new brand lands in none of them and nothing tells you.

**Check:** compare the script's `vendor` list against the baseline table in [COLLECTIONS.md](COLLECTIONS.md). For any difference, follow `.agents/skills/ob-collection-maintenance/SKILL.md`. Do not guess where a brand belongs.
