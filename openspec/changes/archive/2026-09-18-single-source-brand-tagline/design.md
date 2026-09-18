## Context

Two sections render a brand's one-line tagline from their own block data:

- `sections/ob-home-brand-logos.liquid` reads `block.settings.description`, stored per block in
  `templates/index.json`.
- `sections/merken-brands.liquid` reads `block.settings.eyebrow`, stored per block in
  `templates/page.merken.json`.

Both currently carry the same 11 strings. Shopify stores section block data per template JSON, so
there is no theme-side mechanism that keeps two section instances in sync — the `homepage-sections`
spec's "reads identically to the Merken page" requirement is enforced by nothing but care. The tagline
describes the brand ("Alpine pantoffels"), not the page it appears on, which makes the collection the
natural owner.

A third surface already renders brand marks without any tagline: the Merken hero chip grid and the
homepage marquee (both via `snippets/ob-brand-logotype.liquid`). They are untouched here.

One brand breaks the "collection owns it" assumption: **RH+ has no Shopify collection** (not synced
from Akeneo) and is rendered from a `brand_handle` block setting, so it can carry no collection
metafield at all.

Separately, `sections/ob-home-brands.liquid` — the text-wordmark predecessor of the logo grid — is
still in the theme with a `"disabled": true` instance in `templates/index.json`, kept as a rollback
path when the logo grid shipped.

## Goals / Non-Goals

**Goals:**
- One place to edit a brand's tagline, reachable by the owner in Admin without the theme editor.
- Both surfaces read that place, with a fallback that cannot blank existing copy.
- Retire the superseded text-wordmark section and its stylesheet.

**Non-Goals:**
- No layout change on either page. The homepage keeps its card grid; the Merken page keeps its hero
  chips and photo tiles. This is explicitly the owner's decision — only the data source is shared.
- The Merken page's *long* description stays block-level and page-specific.
- The brand roster and its per-page ordering stay block-level. Different order per page is desirable,
  not a defect, so it deliberately does not move to a shared source.
- No change to logo assets, `--ob-logo-scale` sizing, or `ob-brand-logotype.liquid`.

## Decisions

**Collection metafield over metaobject.** A `custom.brand_tagline` single-line text metafield on the
collection puts the copy on the object it describes, and the owner edits it on the collection page
they already visit. The alternative — a `brand` metaobject holding collection + tagline + sort order —
was considered and rejected for this scope: it would also centralize the roster and ordering, which
we explicitly want to stay per-page, and it needs an extra sort field plus a heavier definition to
rebuild on the live shop. A third option, a hardcoded list in a snippet, was rejected because it takes
editing away from the owner entirely.

**One shared resolver snippet, not duplicated Liquid.** `snippets/ob-brand-tagline.liquid` takes
`collection` and `fallback` and returns the resolved string, so the metafield-then-fallback rule
exists once. Both sections call it. This mirrors the existing `ob-*` snippet convention (the
`akeneo-option-handling` spec's rule that interpretation lives in a snippet, never inline in a
template) and means a later source change touches one file.

**Fallback is block-first-wins-when-blank, not metafield-only.** The block setting stays in both
schemas. A metafield-only read would blank RH+ (no collection) and would blank every brand for the
window between deploying the Liquid and populating 11 metafields. Keeping the block as fallback makes
the rollout order irrelevant and keeps the storefront correct at every intermediate step.

**Populate the metafields via Admin API, not by hand.** The 11 values already exist verbatim in
`templates/page.merken.json`'s `eyebrow` settings; they are read from there and written with
`metafieldsSet`, so the migration cannot introduce a typo. The store-identity gate (shop must be
`original-brands-dev.myshopify.com`) applies before the write.

**Block settings are left populated after the migration.** They are the documented fallback, so
emptying them would remove the safety net for no benefit. The setting labels gain an `info` note
saying the metafield wins, so the theme editor does not mislead.

## Risks / Trade-offs

- **Owner edits the block setting and sees no change** (the metafield silently wins) → the schema
  `info` text on both settings states that the collection metafield takes precedence and names it.
  This is the main usability cost of the fallback design and is accepted deliberately.
- **Metafield definition is shop-side state that the live store will not have** → appended to
  MIGRATION-TO-LIVE.md as part of this change, per the project's standing rule, at the moment it is
  created rather than at launch.
- **Removing `ob-home-brands.liquid` is irreversible from the theme editor** → it is already disabled
  and renders nothing, the wordmark treatment itself survives in `ob-brand-logotype.liquid` and
  `component-ob-merken.css`, and the removed file is recoverable from git (`788772c` or earlier). The
  spec's REMOVED block records this migration path.
- **`templates/index.json` is merchant-editable live state** → the section removal is pushed through
  the mandated pull-and-diff workflow, not a blind push, since a stale local copy silently reverts
  live-only Admin settings (the `cdc6c7c` incident).
- **Deleting theme files needs more than `theme push --only`** → `--only` never deletes remote files.
  The two removed files are deleted from the live theme explicitly; leaving them orphaned on the live
  theme would re-create exactly the local/live drift this project keeps getting bitten by.
