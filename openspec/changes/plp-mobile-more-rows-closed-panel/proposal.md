## Why

Client request (2026-11-12): "On mobile we need additional filters on activity and category for customers to be able to filter more. Also can you make sure that the filters tab on mobile is initially closed and opens once a customer clicks on the filter button?"

Desktop already has Activities and Category facets (Search & Discovery on pre-live: Gender, Maat, Kleur, Activities, Merk, Category, Producttype), but the mobile bar only offers Gender, Merk, Maat and Kleur. The current spec also requires the panel to be open at first paint and to remember the shopper's choice, which is the opposite of what the client asks.

## What Changes

- The mobile filter bar gains a Category row (`akeneo.shopify_originalbrands_cate__1` on pre-live, `custom.shopify_originalbrands_category` on DEV) and an Activities row (`custom.activities`), with the same checkbox-backed boxes and native parameters as desktop. Order: Gender, Merk, Category, Activities, Maat, Kleur.
- Both rows follow the existing "fewer than two values, none active" rule and the existing pass-through/pill rules.
- **BREAKING (spec):** the panel renders closed on every page load and opens only when the shopper taps "Verfijn op". The open/closed choice is no longer stored; the old `ob-plp-filter-bar` localStorage key is removed. An opened panel stays open across AJAX filter changes on the same page.
- While filters are active, the toggle shows their number ("Verfijn op (2)"), because a closed panel would otherwise hide every active row selection (rows have no pills).

## Capabilities

### New Capabilities

### Modified Capabilities
- `plp-mobile-filter-bar`: six rows instead of four; panel closed by default and not persisted; active-filter count on the toggle.

## Impact

- `snippets/ob-mobile-filter-bar.liquid`, `snippets/facets.liquid` (mobile pill exclusion), `assets/ob-plp.js` (toggle), `assets/component-facets.css`.
- Depends on `plp-mobile-brand-row` being archived first: this delta is written against the spec as that change leaves it.
- Shop dependency: the Activities and Category filters must exist in Search & Discovery (already on pre-live since 2026-11-03). Row headings come from the filter labels there.
