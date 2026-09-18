## 1. Shop data: the metafield and its values

- [x] 1.1 Verify the connected shop is **Original Brands DEV** (`original-brands-dev.myshopify.com`) before any Admin mutation
- [x] 1.2 Create the `custom.brand_tagline` collection metafield definition (single-line text), with a description naming both surfaces that read it and pinning it so it shows on the collection page
- [x] 1.3 Read the 11 tagline strings verbatim from `templates/page.merken.json`'s per-block `eyebrow` settings
- [x] 1.4 Write those values to the matching brand collections with `metafieldsSet`, then read them back and confirm all 11 round-trip exactly
- [x] 1.5 Append the new metafield definition to MIGRATION-TO-LIVE.md as a shop-side dependency

## 2. Shared resolver snippet

- [x] 2.1 Create `snippets/ob-brand-tagline.liquid` taking `collection` and `fallback`, returning the metafield value when present and the fallback otherwise, with a header comment explaining why the fallback exists (RH+ has no collection; rollout order)
- [x] 2.2 Confirm it emits no stray whitespace/newlines when interpolated inline

## 3. Wire both surfaces to the snippet

- [x] 3.1 `sections/ob-home-brand-logos.liquid`: resolve the card tagline through the snippet, passing `block.settings.description` as fallback
- [x] 3.2 `sections/merken-brands.liquid`: resolve the tile eyebrow through the snippet, passing `block.settings.eyebrow` as fallback
- [x] 3.3 Add an `info` note to both block settings' schemas stating that the collection's `custom.brand_tagline` takes precedence
- [x] 3.4 Confirm the blank-guard still works: a brand with neither metafield nor block text renders no empty tagline element

## 4. Remove the superseded text-wordmark section

- [x] 4.1 Pull `templates/index.json` fresh from the live theme and diff against local before editing (merchant-editable state)
- [x] 4.2 Remove the `brands` section object and its `order` entry from `templates/index.json`
- [x] 4.3 Delete `sections/ob-home-brands.liquid` and `assets/component-ob-home-brands.css` locally
- [x] 4.4 Update the stale references to the removed section: the header comment in `sections/ob-home-brand-logos.liquid`, the comment in `assets/component-ob-home-brand-logos.css:4`, and the note in `assets/component-ob-home-marquee.css:75`
- [x] 4.5 Confirm no remaining reference to `ob-home-brands` exists anywhere in the theme

## 5. Deploy

- [x] 5.1 Run `shopify theme check` on the changed Liquid
- [x] 5.2 Push the changed Liquid/CSS files to theme `148245381229` with an explicit `--only` list
- [x] 5.3 Push the edited `templates/index.json`, then re-pull it to verify the live copy matches
- [ ] 5.4 Delete the two removed files from the live theme (a `--only` push never deletes remote files), and confirm they are gone — **blocked, owner action required**: the Shopify MCP connector refuses `themeFilesDelete` against the live theme as a destructive operation, and the CLI cannot delete a single remote file (a full `theme push` would delete them but would also overwrite every other `templates/*.json` from a possibly stale local copy, which is the `cdc6c7c` incident class and not worth it here). Delete `sections/ob-home-brands.liquid` and `assets/component-ob-home-brands.css` in Admin → Themes → Edit code. Both are inert until then: no template renders the section and nothing links the stylesheet.

## 6. Verify live

- [x] 6.1 Homepage: all 11 cards show their tagline, text identical to before the change
- [x] 6.2 `/pages/merken`: all 11 tile eyebrows show their tagline, text identical to before the change
- [x] 6.3 Edit one collection's `custom.brand_tagline` in Admin and confirm both pages change together; restore the original value afterwards
- [x] 6.4 RH+ (no collection) still renders its marquee entry and tagline from its block setting
- [x] 6.5 Confirm the homepage renders no leftover empty section where the removed one sat, and that layout on both pages is visually unchanged
