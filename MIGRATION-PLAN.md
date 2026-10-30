# Original Brands — migration execution plan

Updated: **2026-10-29 (Europe/Berlin)**.

Purpose: resume the DEV → pre-live → public launch migration after an interrupted session, quota limit, or machine change. This file tracks execution order and current progress. [MIGRATION-TO-LIVE.md](MIGRATION-TO-LIVE.md) remains the detailed dependency checklist; use both.

## Resume here

**Current phase: A3 shop data partly migrated (2026-10-29). Everything that does not depend on Akeneo-managed schema is now in pre-live and verified: 7 collection definitions, 9 pages, blog `inspiratie` (14 articles, 52 body images), 22 collections and the 3 footer menus. Nick plans to accept tomorrow morning.**

**Settings/apps/discounts/forms sweep done 2026-10-29: see A4.** Open owner UI items are listed there. Everything Nick must decide or do is in [NICK-PRELIVE.md](NICK-PRELIVE.md).

**Next action (needs Nick):** Nick connects the Akeneo PIM App (preinstalled) to pre-live; the connector creates the Akeneo-managed **product/variant metafield definitions** (`custom.shopify_originalbrands_category`, `custom.activities`, `custom.genderid`, `custom.colorid`, …) and the **metaobject definitions** `filtercolors`/`activities` on pre-live, as it did on DEV. That is not a question to ask him again. They block the remaining 37 collections (rules on those three product metafields), `accessoires`, the nested `main-menu` and the FitFlop sub-collections. Once the definitions exist on pre-live, run the same scripted pattern for the remaining collections (ruleSet conditionObject needs the *live* definition IDs) and then build `main-menu` from `dev-menus.json`. Exports and scripts: `.migration/2026-10-29-shopdata/`.

**Admin-write access (A2, resolved 2026-10-29):** the owner chose a migration exception in `CLAUDE.md`. Writes go through the Shopify CLI (`shopify store execute --store original-brands-mtr6tuym.myshopify.com --allow-mutations`). The CLI rejects the primary domain and needs this permanent one. Every mutation was preceded by an identity read of shop `109574717777`. Authorising the CLI installed Shopify's first-party **"Shopify CLI Connector App"** on pre-live (and read-only CLI auth on DEV). The claude.ai Shopify connector was switched out and is **currently signed out**. Re-authorise it for DEV via `/mcp` before the next DEV connector session.

**Next coordinated action:** Nick plans to accept on **Friday morning, 2026-10-30 (Europe/Berlin)**, per the owner on 2026-10-29. Once Nick is ready and the owner approves the interruption, follow the support-confirmed temporary removal → client transfer → re-invite sequence. Perform removal close to his actual availability; do not remove him overnight merely to send the invitation early.

Before continuing:

1. Read `CLAUDE.md`, this plan, the detailed migration checklist, and relevant `GOTCHAS.md` entries. Follow the project's shared-doc rules.
2. Check Git status; preserve existing work. Pull when safe. Do not assume uncommitted changes are disposable or that local theme settings match Admin.
3. Re-read actual store identity, ownership/transfer status and theme IDs. Browser tab IDs and element UIDs from an earlier session are not reusable identifiers.
4. Reconcile this plan with any work the owner or Nick did meanwhile. Update the next action and completed boxes before stopping again.

## Stores, repository and current facts

| Item | Source: DEV | Destination: pre-live |
|---|---|---|
| Shopify domain | `original-brands-dev.myshopify.com` | `original-brands-live.myshopify.com` |
| Shop ID | `72440086637` | `109574717777` |
| Admin | https://admin.shopify.com/store/original-brands-dev | https://admin.shopify.com/store/original-brands-live |
| Theme last observed | Active Dawn `148245381229` | Active migrated Dawn `209721262417`; Horizon `209707532625` retained as draft rollback |
| Current role | Existing development shop; keep operational | Client transfer store; not handed over yet |

- **One repository for both environments:** `https://github.com/dr771/OBR.git`, branch `main`. Code changes use the same Git history; deployment chooses the store and theme explicitly. Store data, app configuration and merchant settings remain shop-specific.
- Destination was created under **Dr770.com**, Partner organization `188200709`, country **Belgium**, Shopify Plus off. The intended starting paid plan is **Basic**, selected by Nick during acceptance; it is not active yet.
- Original destination identifier: `original-brands-mtr6tuym.myshopify.com`. Keep it for technical identification; it is the same shop, not a duplicate to delete.
- Destination primary domain and clean admin URL were verified working. Storefront remains password-protected; production `originalbrands.nl` still belongs to the existing site.
- Destination foundations verified on 2026-10-29: Dutch primary/published language, Brussels time zone, EUR, Belgium, metric units and kilograms. These prevent locale/filter and schedule mismatches before imports. Its business entity currently belongs to Dr770.com: do not overwrite that shared entity with client details; the client supplies their entity after handover.
- DEV has **Akeneo PIM App** and the separate **custom app `OB_AX-SFY_TEST`**. The latter shows customer/product/order activity and protected customer-field access. Nick must confirm each app's production role; do not assume they are interchangeable.
- DEV's local `config/settings_data.json` had an August timestamp at inspection. It is not an acceptable current migration source without a fresh pull and review.

## Completed preparation

- [x] Create the destination as a **Client transfer** store, not a Dev store.
- [x] Set and verify `original-brands-live.myshopify.com`; `original-brands` was unavailable.
- [x] Confirm intended owner email: **`nick@highdemandbrands.eu`**.
- [x] Confirm Shopify's transfer rejection: recipient is already in the sending Partner organization. No invitation was sent by the rejected attempts.
- [x] Obtain human Shopify Support guidance through the owner; transcript access: https://help.shopify.com/en/inbox.
- [x] Save Nick's six role assignments and exact store scopes in [MIGRATION-TO-LIVE.md](MIGRATION-TO-LIVE.md#nicks-access-snapshot-before-removal-2026-10-29). Recheck them immediately before removal.
- [x] Draft a short message asking Nick for a suitable interruption window; owner reports Nick will accept on Friday morning, 2026-10-30. No agent message was sent to Nick.

## A. Work available while waiting for Nick

These tasks do not require removing Nick or connecting pre-live to Akeneo. Execute approved migration steps without changing the original DEV configuration. Initial Dawn code is now deployed on pre-live; merchant settings/content/app dependencies remain pending.

### A1. Source and destination snapshots

- [x] Reconfirm both shops and list their current themes. CLI inventories saved to `.migration/2026-10-29-initial/dev-themes.json` and `prelive-themes.json`; baseline commit `6cfb2b0`, CLI `4.1.0`.
- [x] Pull active DEV Dawn into `.migration/2026-10-29-initial/dev-theme` and review it against Git: 478 files, 6,186,517 bytes. The working theme files were not overwritten.
- [x] Retrieve fresh DEV `config/settings_data.json` in the isolated backup folder without `.shopifyignore`; included in the full theme pull and parsed successfully. The normal repo's protection remains intact.
- [x] Back up destination Horizon and its settings to `.migration/2026-10-29-initial/prelive-theme`: 480 files, 5,067,012 bytes.
- [x] Save `manifest.json`, full SHA-256 file lists in `checksums.json`, CLI theme inventories, pull logs and `source-vs-git.json` under `.migration/2026-10-29-initial/`. Required layout/settings files are present and settings/schema JSON parses successfully. `.migration/` is now ignored by Git.
- [x] Record the reviewed findings below in this shared plan. Raw snapshots remain machine-local; re-pull if they are unavailable on a resumed machine. The owner explicitly approved the two store-specific theme-list commands and these two theme pulls; do not ask again merely to repeat the same approved reads when a refresh is needed.

**Done when:** both snapshots exist and can be located; current source settings are known; any Admin-only differences from Git have been reviewed.

**A1 snapshot review (2026-10-29).** Eight source files differ from commit `6cfb2b0`, after normalizing JSON formatting and line endings. Use Git as the code baseline plus reviewed current merchant state; no reconciliation has been copied into the repository's theme files yet.

**Capture workflow:** `scripts/theme-push.sh` checks selected `templates/*.json` before deployment; it does not automatically merge or commit Admin changes, does not check section-group JSON, and refuses protected `settings_data.json`. Settings capture requires the separate pull/review/commit procedure in `CLAUDE.md`; the current DEV theme card shows no GitHub repository/branch connection. The diff alone cannot identify an editor: empty settings objects may be editor-generated and app state may be app-generated, while branded fonts, links and campaign choices indicate project customization rather than a generic platform update.

| Source difference | Migration disposition |
|---|---|
| `config/settings_data.json` | 15 global setting paths and 68 app-embed setting paths differ. Fresh DEV values include Inter/Fraunces, logo/favicon, footer branding, Image chips, vendor visibility and EUR 70 free shipping for BE/NL. Five enabled app embeds (four Swish and one Forms) need destination installation/rebinding, not blind copying of source app state. |
| `sections/footer-group.json` | Preserve current newsletter disabled, language selector disabled and 68px top margin when preparing the release. |
| `sections/header-group.json` | DEV trust bar is disabled while demo promo messages run. Remove demo promotions and restore the intended trust-bar visibility for the actual launch; do not carry the disabled state blindly. |
| `templates/index.json` | Preserve bestseller cards' square images, visible vendor and mobile swipe settings. |
| `templates/product.json` | Preserve current delivery links to `/pages/levering` and `/pages/verzending-en-retour`; ensure both destination pages exist and their copy is final. |
| `templates/404.json`, `templates/password.json` | Differences are added empty settings objects; no behavior change identified. |
| `assets/component-ob-option-rail.css` | Comment-only difference; retain Git code. |

Five files exist only on remote DEV: `assets/component-ob-home-brands.css`, `assets/ob-pdp-option-rail.js`, `assets/ob-pdp-swatch-rail.js`, `assets/ob-price-format.js`, `sections/ob-home-brands.liquid`. Treat these as legacy residue requiring reference review, not code to automatically reintroduce into the migration release. Complete raw backups preserve them for recovery.

### A2. Destination foundations

- [x] Set **Dutch as primary language before importing content** (owner-approved 2026-10-29). Only English existed before the change; Dutch is now Default/Published after reload. The rendered pre-live storefront reports `lang="nl"`; theme-authored English demo copy still needs replacement with the migrated Dawn content.
- [x] Set Brussels time zone and verify EUR, Belgium, metric units and kilograms after reload (2026-10-29).
- [x] Verify intended customer-account mode: current Shopify customer accounts, account URL `https://shopify.com/109574717777/account`, sign-in links enabled; no change needed. DEV API confirms `NEW_CUSTOMER_ACCOUNTS` (2026-10-29).
- [x] Record current target product/content/app inventory in Chrome (2026-10-29), summarized below and in `destination-inventory.json`.
- [x] Inventory DEV collection/page/menu records, definition keys/types/access, blog counts and installed apps (2026-10-29). Save `resource-inventory.json` and `theme-image-references.json` under the initial snapshot folder. Files API inventory is a 50-record sample with more pages; complete editorial-file export and app-setting exports belong to A3/C, not this structural inventory.
- [x] Resolve deployment access and the current **DEV-only Admin API identity gate in `CLAUDE.md`** before target API writes. Done 2026-10-29: migration exception added; CLI `store execute` with an explicit permanent domain. Make any migration-specific target authorization explicit in shared instructions; never silently repoint a connector protected by that gate. Re-read shop identity before every mutation.

**Done when:** target foundations are verified in Admin and the source/target resource manifest exists. Keep storefront access private throughout preparation.

**A2 inventory (2026-10-29; read-only).** Source API identity was verified as shop `72440086637`; target identity was verified through the explicit `original-brands-live` Admin and account URL for shop `109574717777`. No customer/order records were exported.

| Resource | DEV source | Pre-live destination |
|---|---|---|
| Products | 566, all active | 0 |
| Collections | 62; all identifiers/handles paginated and saved | Default Home page collection `696251416913`, 0 products |
| Pages | 11, including `levering`, `verzending-en-retour`, `veelgestelde-vragen`, `merken` and `klantenservice` | Default Contact page `174750892369` only |
| Menus | 6, including the three custom footer menus; `main-menu` now has 8 top-level items, ending in Solden | Three defaults: Main menu (Home/Catalog/Contact), Footer menu (Search), Customer account main menu (Orders/Profile) |
| Blog content | `inspiratie`: 14 posts; `news`: 0 | Default News blog `132992041297`, 0 posts |
| Metafield definitions | Product 15, Variant 4, Collection 7; complete for these owner types | 0 across every displayed owner type |
| Metaobjects | `activities`: 8 entries; `filtercolors`: 18; Shopify Knowledge Base Facts: 4 | Shopify Knowledge Base Facts only, 1 entry; preserve target system data |
| Files | First 50 API records sampled; full file enumeration not performed. Four distinct image-picker references across source settings/homepage JSON saved separately | 0 |
| Apps | Messaging, Swish, Translate & Adapt, Forms, `OB_AX-SFY_TEST`, Search & Discovery, ChatGPT/Claude/CLI connectors, Channable, Akeneo PIM App, Flow | Flow only |

Treat app-managed Search & Discovery definitions, Akeneo schema and Shopify system objects according to their owning app; do not blindly recreate all source definitions/Knowledge Base entries. Rehearsal content must exclude the documented demo campaigns. Current page bodies, collection rules/values/publications, blog media and app configuration still need their actual export before import. The pre-live Pages screen confirms password-restricted store access.

**Access result:** the connected API remains DEV; its `appInstallations` read returned access denied, so app inventories were verified in Chrome. Destination CLI theme reads succeeded in A1, but that does not establish destination Admin-data API access. No connector switch, app install or change to `CLAUDE.md`'s write gate was made. Draft-theme preparation can proceed locally while this remains pending.

### A3. Theme and editorial content

- [x] Prepare the reviewed Dawn release locally (2026-10-29): `.migration/2026-10-29-dawn-release/theme-code`, code ZIP, separate settings candidate/review, resource references, manifest and checksums. The owner subsequently uploaded/published this separate destination theme; preserve Horizon as rollback. Full rendered verification remains pending.
- [x] Resolve the **new destination Dawn theme ID**: `209721262417`, uploaded and published by the owner (2026-10-29), confirmed as active in Admin; Horizon `209707532625` remains a draft rollback. Password protection remains on. No public launch or settings-copy approval is implied.
- [x] Back up and review the complete source/target settings diff; obtain the explicit settings-migration approval required by `CLAUDE.md` before pushing `settings_data.json` from a temporary theme directory. Keep the repo ignore protection intact. Applied 2026-10-29 with owner approval; details below.
- [x] Copy theme/editorial Files to destination and maintain a source-file → target-file mapping. Rebind logo, footer brand image, section image pickers and blog/page image URLs to destination assets. Done: the four theme images plus the 52 blog body images (`blog-files-map.json`, all READY, filenames unchanged). Pages contain no Shopify-hosted media.
- [ ] Create required metafield/metaobject definitions in dependency order, checking existing target definitions first. Preserve field keys, types, capabilities and appropriate access; do not copy source GIDs into target references. Coordinate any schema the Akeneo app manages with Nick before conflicting writes. **Collection definitions done** (7, identical to DEV incl. pin order and access). Product/variant definitions and metaobject definitions are pending, waiting for the agreement with Nick.
- [ ] Migrate collection records, handles, rules, copy and collection metafields. Definition dependencies come first; product-specific memberships can be restored after catalog import. Preserve manual versus automated collection types. **22 of 59 done** (all vendor/type/price/title rules and manual ones, compared field-by-field with DEV incl. publications and metafield values; `/collections/all` renders the custom "Alle producten" as on DEV). 37 wait for product metafield definitions; the 3 `actie-*` demo campaigns are deliberately excluded.
- [x] Export current page bodies from DEV, then create destination pages with matching handles and template suffixes. 9 pages, bodies byte-identical to DEV. `merken` keeps suffix `merken`. DEV's suffix `page` has no template and renders `page.json`, so it was left empty. `data-sharing-opt-out` is created by Shopify's privacy settings and was not copied. `contact` already existed: it is published on pre-live but unpublished on DEV; decide before launch.
- [x] Migrate blog `inspiratie`, its articles and destination-hosted media. 14 articles: title, body, summary, tags, author, publish date and SEO metafields match DEV; body images rewritten to destination Files; featured images re-hosted on pre-live. A rendered article showed 18 images, none broken and none from DEV. One body links `/products/fitflop-chrissie…?variant=45841922293869`, a DEV variant ID; fix it after the live catalog import.
- [ ] Recreate the nested `main-menu` and three footer menus with their exact handles, mapping references to newly created resources. Create referenced pages/collections before menu items. **Footer menus done** (`footer-klantenservice`, `footer-over-ons`, `footer-handige-links`; rendered in the footer). `main-menu` waits for the remaining collections. Pre-live still has the default Home/Catalog/Contact.
- [ ] Inspect the rendered frontend against DEV at desktop and true mobile viewport. Record expected gaps caused by missing products/apps; do not mark complete feature parity from an empty catalog.

**Deployment target (2026-10-30):** `scripts/theme-push.sh` now targets pre-live theme `209721262417` by default; `--dev` targets DEV `148245381229`. Pre-live is the working surface from now on (CLAUDE.md, Shopify CLI).

**A3 local preparation (2026-10-29).** Code ZIP has **472 files / 2,210,875 bytes**, SHA-256 `710bb7095c738a3eb4fe42a7fd8538a1d955378b59f57c82a0c1628e8d35d369`; Git baseline `6cfb2b0`. Six reviewed JSON overrides preserve current footer/homepage/product state and harmless 404/password structure; the header removes the three demo announcements and re-enables the trust bar. All Liquid/CSS/JS remains Git's code. Source-only legacy files are excluded. The code ZIP/folder contains no `settings_data.json` or source app bindings.

The separate `settings-review/settings_data.json` keeps every current DEV global setting and preset, removing only the five source app embed records saved alongside it for later rebinding. Full source Dawn versus backed-up target Horizon settings diff: **572 leaf paths**, saved in `settings-review/dev-dawn-vs-prelive-horizon.json`; different theme schemas are not a mechanical merge. Back up the newly created Dawn theme's own settings and review the final mapped candidate before requesting settings-copy approval. Four image-picker Files still need destination mapping.

**Validation:** original backup checksums matched; ZIP integrity/structure checked; 74 payload JSON files parsed; no source GIDs in setting JSON, source app bindings or documented demo campaign handles remain. Local `shopify theme check` exited 0, **0 errors / 8 warnings** in unchanged Liquid files (`theme-check.json`). No rendered parity verification has occurred. On Windows, `git archive` produced CRLF while `git show` returned LF, so compare code after line-ending normalization when checking this baseline.

**Launch copy discrepancy to resolve:** current PDP delivery text says EUR 5.95 shipping below EUR 70, while the recorded DEV rate is EUR 4.95. Current copy is preserved in the candidate; confirm the approved live rate and make rates, policies, PDP and theme promises agree before launch.

**Destination settings and image preparation (2026-10-29).** The owner approved the read-only pull for Dawn `209721262417`. It exited 0 without downloading `config/settings_data.json`; Chrome's code editor confirmed `config` contains only `settings_schema.json`. Record the original absence in `destination-before-settings/settings-presence.json`, rather than inventing an empty backup. The candidate is reviewed against that absence in `settings-review/candidate-vs-destination-dawn.json` and staged at `settings-deploy/config/settings_data.json`; no settings have been applied. Recheck immediately before a separately approved write in case the owner saves settings meanwhile.

Four source image records were matched by exact URL basename, downloaded and image-verified under `theme-images/`; `theme-image-transfer.json` records source IDs, URLs, dimensions and SHA-256, with destination mapping still pending. Shopify Files → More actions → **Upload from URL** is available in pre-live and avoids the local upload-tool workspace restriction. The owner approved importing all four images; they are now in destination Files, mapped below. Global settings application remains a separate pending approval.

| Theme image | Destination MediaImage ID |
|---|---|
| `Logo_aed26ee0-4811-4830-bc1d-2d027f886ff5.png` | `72143782478161` |
| `favicon.png` | `72143799943505` |
| `521A3153.jpg` (outlet) | `72143817376081` |
| `JUICY_10_1_2_1.jpg` (hero) | `72143825207633` |

**Image verification (2026-10-29):** destination CDN prefix is `/s/files/1/1095/7471/7777/files/`, and all four filenames/original dimensions match. Three files are byte-identical; the outlet JPEG has a tiny mean absolute channel difference (at most 0.052/255) and was visually compared with source. Both homepage photos render from destination `/cdn/shop/files/` URLs; desktop 1363px and mobile 390px screenshots plus image geometry/loading were inspected. Full storefront parity remains pending shop-data migration.

**Global settings applied (2026-10-29).** Owner-approved. A fresh pull immediately before writing confirmed destination Dawn `209721262417` still had no `settings_data.json`. Pushed only `config/settings_data.json` from the isolated `settings-deploy/` folder (no `.shopifyignore`) with `shopify theme push --store=original-brands-live.myshopify.com --theme=209721262417 --allow-live --only config/settings_data.json --path settings-deploy`. A re-pull matches the candidate once Shopify's auto-generated `/* … */` header is stripped. That header makes a plain `json.load` of a pulled settings file fail; strip it before comparing. Rendered check: the storefront reports theme `209721262417`, `--font-body-family` Inter, `--font-heading-family` Fraunces (same as DEV), destination-hosted logo, favicon and footer logo, trust bar visible, 0 app embeds. Desktop 1363px and mobile 390px were inspected. Expected gaps: default menus (Home/Catalog/Contact), empty catalog, no apps. Rollback: delete the created settings file. Record: `settings-applied.json`.

### A4. Settings, apps, discounts, forms (2026-10-29)

Full DEV admin sweep (API inventory `inventory-dev-vs-live.json` + every settings page in Chrome). DEV's shop settings are mostly empty, so pre-live values come from the old site (`.migration/2026-10-29-shopdata/reference/`: AGB, contact, levering, retourneren). `holsteraustralia.eu` (same group, Shopify) only had unfilled Shopify template policies and was not used.

- [x] **Market** renamed "België & Nederland", NL added (DEV's DE/FR/LU have no shipping zone, so they are not copied; asked in [NICK-PRELIVE.md](NICK-PRELIVE.md)).
- [x] **Shipping:** default zone replaced by BE/NL: `Standaard verzending` EUR 5.95 (0–69.99), `Gratis verzending` from EUR 70. EUR 5.95 is the old site's rate and matches the PDP copy; DEV's 4.95 is the outlier.
- [x] **Policies:** terms of service (old AGB verbatim), refund, shipping, contact information and legal notice via `shopPolicyUpdate`; the privacy policy stays Shopify-managed. Bodies: `live-policies.json`.
- [x] **Store address/phone:** Original Brands B.V., Maasstraat 67, 2060 Antwerpen, +32 13 53 26 85. The store email deliberately stays the builder's until handover. The business entity stays Dr770.com (client supplies theirs).
- [x] **Discounts:** `Welcome27` and Löwenweiss 2+1 (on new `actie-winter-loewenweiss`), plus the manual `actie-odlo-skiset` collection. Still pending: FitFlop laarzen (needs `actie-fitflop-laarzen`, which needs the category definition) and Odlo skiset BXGY (needs products). The expired "Test Broek 10%" was not copied.
- [x] **Forms:** app installed; the "Newsletter" popup recreated from DEV's config (`dev-newsletter-form-snapshot.txt`) with WELCOME27 and activated; the theme app embed is enabled. The rest of the settings JSON is unchanged.
- [x] **Search & Discovery** installed; filters wait for the product definitions.
- [x] **Already equal or better:** checkout settings, customer privacy (cookie banner BE/NL, EU double opt-in), customer accounts, taxes-included pricing.
- [ ] **Owner, in the UI:** (1) checkout editor: accent `#0D80C4`, order summary `#F1F5F9` (the API needs Plus); (2) Forms heading weight Semi Bold; (3) popup image `ob-brand-juicy-couture.webp` (two `fileCreate` imports from the DEV CDN failed); (4) ~~Swish~~ installed after the handover, embeds copied from DEV 2026-10-30.
- [ ] **Not installed on purpose:** Translate & Adapt (single language), Messaging (no marketing yet), ChatGPT/Claude connectors. Akeneo, `OB_AX-SFY_TEST`, Channable, Swish and Trusted Shops are Nick/owner items.
- [ ] **Not migrated on purpose:** DEV's 3 URL redirects (DEV-internal renames; real redirects come from SEO-REDIRECTS.md at launch), DEV's US "Domestic" zone, DEV test orders and customers.

## B. Ownership transfer — coordinate with Nick

Human Support's procedure, supplied by the owner: retain store ID `109574717777`, temporarily remove Nick from Dr770.com, send the standard client-transfer invitation to his existing email, let him accept/select a paid plan, then re-invite him and manually restore his assignments. Support confirmed referral preservation for that standard transfer; verify the actual referral afterward.

- [x] Nick confirms he can pause work and accept the transfer; owner approves proceeding with the interruption.
- [x] Refresh Nick's access snapshot immediately before removal. Role-card store counts were misleading; inspect each role's actual **View stores** list.
- [x] Remove Nick from **Dr770.com membership only**. Do not delete his Shopify account, apps, stores or client-store ownership. Done 2026-10-30; removal needs the owner's passkey (`RemoveOrganizationUser` → `user_verification/initiate/PASSKEY`), an agent click alone silently does nothing. Users now live at `admin.shopify.com/organization/188200709/settings/organization-account` (old `partners.shopify.com/188200709/...` URLs 404).
- [x] **Also remove the org user HDB Collaborator** (`261121636`). It carries the same email `nick@highdemandbrands.eu` as a *Collaborator* (roles `HDB x Sweaty Betty` and `Nick`, both Store roles on Sweaty Betty). While it existed the transfer was still rejected. Removed 2026-10-30 with the owner's approval.
- [x] Send the transfer for **OB pre-live only** to `nick@highdemandbrands.eu`. Sent 2026-10-30 from Settings → General → store-transfer; Admin shows *Transfer in progress* and a *Cancel transfer* option. Verify a pending transfer and correct recipient; a clicked button or HTTP 200 is not proof of success. The earlier mutation returned a `userErrors` rejection without displaying it in the dialog.
- [x] Nick accepts and selects Basic using client billing details (done 2026-10-30; plan verified). Re-read actual plan, ownership and unchanged shop ID; do not assume sending the invitation completed handover.
- [x] Re-invite Nick into Dr770.com and restore the saved existing roles/store scopes (2026-10-30, user `289846919`, pending his acceptance; scope differences in the handoff record). Nick may need to accept that invitation too. Verify his DEV/app access, the owner's collaborator access to OB, and the relevant collaborator store assignments.
- [ ] Verify attribution under **Partner Dashboard → Sales → Referrals**. Retain the support transcript or case reference if anything differs.

**Recovery:** if Nick cannot accept promptly or transfer fails after removal, prioritize restoring his team access and coordinating another window. A renewed Partner membership can block transfer again; never report handover complete without verifying it.

## C. Apps and DEV-catalog rehearsal

**Rehearsal skipped (owner decision 2026-10-30):** no DEV catalog snapshot is copied into pre-live. Nick connects the live Akeneo directly and testing happens against the real catalog, with DEV kept as the comparison reference. Of this section, the apps, shipping and verification items still apply; the snapshot, ID-map and restore items fall away (section D's cleanup of rehearsal data likewise).

The owner's preferred working approach is to test the destination against the DEV dataset first, then replace the rehearsal catalog with Nick's live feed. It has not been executed. Confirm the concrete rehearsal/reset scope before importing or deleting catalog data.

- [ ] Install/authorize destination apps as permitted by its current store state. **Custom/draft app installation is blocked before client handover.** Configure Search & Discovery, Swish embeds, Forms/newsletter and other required apps from the checklist; assess charges and production account details before activation.
- [ ] Have Nick confirm which production integration handles products, stock, orders and customers, plus app distribution/scopes and protected customer-field eligibility on the selected plan. DEV's Grow access is not proof that production Basic has the required access.
- [ ] Copy a **snapshot** of the agreed DEV products/variants/media and reference data for rehearsal. No pre-live connection to DEV Akeneo is needed. Keep the existing DEV shop and its connector working.
- [ ] Maintain product, variant, file and metaobject source → target ID maps. Rebuild all typed references; preserve the option-key/SKU/media contracts in the existing specs.
- [ ] Restore agreed manual collection membership, merchant-owned product values and product pickers. Do not import DEV test orders or customer/marketing data for frontend parity.
- [ ] Match relevant shipping zones and rates to configured markets; verify stock is actually purchasable. Configure filters and refresh their index as needed.
- [ ] Verify representative footwear/apparel, many colors/sizes, reduced products, facets/sorting/load-more, PDP galleries and size choices, breadcrumbs, cart, shipping progress, wishlist and newsletter. Follow the existing specs and desktop/mobile visual verification loop. Use test payments only; marketing automations must not send to real imported contacts.

**Done when:** source and destination comparisons pass with the same representative data; limitations and pending production checks are explicit.

## D. Replace rehearsal data with the live Akeneo catalog

- [ ] Back up the rehearsal catalog and its merchant-only values, manual memberships and resource mappings before the owner-approved cleanup. Confirm Nick has stopped any destination sync that could recreate deleted items.
- [ ] Delete only identified rehearsal **products/variants in pre-live**. Keep collection records, menu structure, pages, theme settings, editorial Files and schema definitions. Do not interpret “all Akeneo-related data” as permission to erase these dependencies.
- [ ] Review reference-entry cleanup separately with Nick. Metafield definitions used by collection rules must be preserved; deleting/recreating definitions or metaobjects can invalidate filters, collection conditions and references.
- [ ] Nick connects the **live** Akeneo environment and performs the full production import. A disconnected app does not imply product deletion or cleared connector mappings; agree connector reset details with Nick.
- [ ] Rebuild manual memberships, product/variant pickers, merchant-only values and any affected references against final live IDs. Preserve agreed product handles where relevant.
- [ ] Check live category vocabulary, brand roster and vendor strings against actual products. DEV and live vocabularies differ; automated collections refill only when their rules match the new data.
- [ ] Run [POST-SYNC-CHECK.md](POST-SYNC-CHECK.md): filter index, orphaned metaobject labels, publishability and category vocabulary. Recheck filters, collection membership, swatches, availability and reference bindings after the production sync.
- [ ] Verify a test order reaches Nick's destination system with required customer/address fields and correct stock/order behavior. Rehearsal parity alone does not prove the production integration.

## E. Final launch — separate from ownership handover

- [ ] Complete every applicable item in `MIGRATION-TO-LIVE.md`, including final shipping/tax/payment/market configuration, policies, consent, analytics and app configuration.
- [ ] Re-export and import legacy customers only at the agreed launch stage, following the checklist's CSV and automation controls. No customer campaigns or automations on DEV; no unrequested production mail.
- [ ] Build redirects against the **final live catalog IDs** using the documented `scripts/build-redirects.js live` workflow. Confirm pages/collections/blog targets exist before import.
- [ ] Verify final domain/canonical settings and complete desktop/mobile user journeys. Preserve theme/settings backups and record the rollback target.
- [ ] Obtain the owner's explicit launch go-ahead before the DNS switch/password removal. Ownership transfer and plan selection do not authorize public launch by themselves.
- [ ] Switch the production domain, remove the destination password when appropriate, verify the real public site and monitor errors/orders. Any relaunch email follows its separately approved scope and timing.

## Durable progress and handoff record

Update this section after each completed migration unit. Record actual results and artifact locations, not just commands attempted. Do not mark a phase complete until its stated checks pass.

| Item | Current recorded state |
|---|---|
| Fresh DEV/target theme snapshots | Verified complete: 478 DEV files and 480 pre-live files, including current settings; source differences reviewed above |
| Backup/export manifest | `.migration/2026-10-29-initial/manifest.json`, theme snapshots/checksums, `resource-inventory.json`, `destination-inventory.json` and `theme-image-references.json`; raw artifacts remain machine-local |
| Destination Dawn theme ID | `209721262417`, active after owner publication; Horizon `209707532625` retained as draft rollback |
| Local Dawn upload package | Prepared and checked: `.migration/2026-10-29-dawn-release/OB-Dawn-migration-code-2026-10-29.zip`; uploaded manually and published by the owner; password protection verified on; global settings remain separate/pending |
| Destination setup/content/catalog migrated | Foundations, code theme, theme images, global settings, 7 collection definitions, 9 pages, blog + 14 articles + 52 images, 22 collections and 3 footer menus applied and verified (2026-10-29). Pending: Akeneo-managed product/variant/metaobject definitions (coordinate with Nick), 37 collections, `main-menu`, catalog, apps |
| Shop-data artifacts | `.migration/2026-10-29-shopdata/`: DEV exports (`dev-*.json`), created-ID records (`live-*-created.json`), `blog-files-map.json`. The scripts live in the session scratchpad (`obx.py` identity-gated runner + per-step scripts); recreate them from this pattern if they are gone |
| Connected Shopify connector | To be pointed at **pre-live** by the owner (`/mcp` re-authenticate, pick Original Brands); owner decision 2026-10-30 that the connector stays on pre-live and DEV is reached via CLI only |
| Nick removal / transfer invitation / paid plan | **Handover done 2026-10-30.** Nick accepted the transfer and selected **Basic** (verified). Dr770.com keeps *Collaboration* access: Nick added Online Store/Apps permissions (a collaborator user **cannot** get the store's *Administrator* role: "Selected role cannot be assigned to collaborator users"). Verified: Online Store + Apps visible, `shopify theme list` on pre-live works (Dawn `209721262417` live, Horizon draft). Nick re-invited to Dr770.com as new user `289846919` (**Pending** until he accepts) with all 6 roles. [Custom] and Store administrator are now scoped to OB DEV + Sweaty Betty only, because Holster EU DEV, Holster Test and SB DEV were temporary shops and are deleted (owner, 2026-10-30); nothing to restore there. Collaborator access: all collaborator stores. HDB Collaborator not recreated: Store administrator on Sweaty Betty covers it. Open: referral check |
| Production domain / public launch | Unchanged; not authorized by this plan |
| Current local work | Shared docs plus `.gitignore` protecting `.migration/`; theme working files unchanged. Inspect Git status on resume. The owner uploaded the ignored package and published the destination theme; repo theme files remain unchanged. |

For future updates, append the date, completed unit, exact shop/theme/resource IDs, saved artifact paths, verification result, open blocker and next action. Keep secrets and customer data out of this file. Save and commit/push shared docs when the owner requests that Git action; merely creating this plan does not imply a push.
