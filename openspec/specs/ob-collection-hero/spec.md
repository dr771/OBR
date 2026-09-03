# ob-collection-hero Specification

## Purpose

Defines the shared tinted hero (`snippets/ob-collection-hero.liquid` + `assets/component-ob-collection-hero.css`) used at the top of every real Shopify collection page and the Merken brands-directory page, so both surfaces share one visual treatment instead of Dawn's stock plain-white collection banner.

## Requirements

### Requirement: Hero uses the tinted bg/spacing taken over from the bolt.host collection-hero
The hero SHALL use the `#f1f5f9` surface tint (the same token already shared by PLP/PDP card media) as its background, with a hairline `#e2e8f0` bottom border, and SHALL use the theme's own `.page-width` for horizontal inset rather than a hand-rolled container.

#### Scenario: Hero renders with tinted background on any surface that includes it
- **WHEN** a visitor loads any page whose template includes `main-collection-banner` (every `/collections/*` page) or the Merken page
- **THEN** the hero SHALL render on a `#f1f5f9` background with a hairline border at its bottom edge, aligned to the same left/right content edge as the header and footer.

### Requirement: Hero is a reusable component, not hardcoded per page
The hero markup and styling SHALL live in one shared snippet/stylesheet pair, parameterized by `title`, `subheading`, `meta`, and `extra_content`, so a second caller never re-implements or forks the markup.

#### Scenario: Real collection pages use it
- **WHEN** `sections/main-collection-banner.liquid` renders
- **THEN** it SHALL call `{% render 'ob-collection-hero', title: collection.title, subheading: ... %}` with no `meta` and no `extra_content`, rather than Dawn's original `.collection-hero` markup.

#### Scenario: Merken page uses it with extra content
- **WHEN** `sections/merken-brands.liquid` renders
- **THEN** it SHALL call the same snippet, passing its brand-chip grid as `extra_content` (a captured HTML string) so the chips render inside the same tinted wrapper, above the bottom border, and passing `meta` as the dynamic "N merken" count.

### Requirement: Real collection pages show no side-by-side collection image
Dawn's original image-inclusive collection-hero layout SHALL NOT be offered on this hero; a collection's `featured_image` SHALL NOT be displayed in it.

#### Scenario: show_collection_image setting is absent
- **WHEN** a merchant opens `main-collection-banner`'s section settings in the theme editor
- **THEN** no "show collection image" toggle SHALL be present — only `show_collection_description`, which gates whether `collection.description` is passed as the hero's `subheading`.

### Requirement: Breadcrumb is a simple two-level "Home / {title}" trail
The hero's breadcrumb SHALL show "Home" (linking to `routes.root_url`) followed by the current page/collection title, with no intermediate resolution logic (contrast with the PDP breadcrumb's collection-ranking behavior, which is deliberately out of scope here).

#### Scenario: Breadcrumb on a real collection
- **WHEN** a visitor views `/collections/fitflop`
- **THEN** the breadcrumb SHALL read "Home / FitFlop".
