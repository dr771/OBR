# akeneo-option-handling Specification

## Purpose
Cross-cutting invariants for handling Akeneo-origin product data across every template and section: option kind must be detected from stable bracketed keys (`[color]`, `[shoe_size_eu]`) rather than visible or translated labels; a media item's color lives only in its filename, following a convention whose code may span multiple segments; and all Akeneo interpretation goes through centralized `ob-*` snippets rather than being reimplemented inline. Ported from the reuse-source project (SweatyBetty), with OB-specific deviations noted per requirement.

## Requirements

### Requirement: Option kind detection never depends on visible or translated labels
Code that needs to determine what kind of option a product option or storefront filter represents (color, size, type, or other) SHALL detect it from a stable, substring-matched raw key — the bracketed Akeneo option key (`[color]`, `[colour]`, `[kleur]`, `[shoe_size_eu]`, etc.) — never by exact-matching or branching on a humanized/translated display label. Size detection takes precedence over type detection so size keys containing other substrings keep resolving as `size`.

#### Scenario: Footwear size key arrives
- **WHEN** a product's option key is `[shoe_size_eu]` (confirmed live on Holster Soleseeker slipper)
- **THEN** option-kind detection identifies it as kind `size` via the `size` substring rule, without any footwear-specific special case

#### Scenario: A brand not yet synced introduces a new bracketed key
- **WHEN** Akeneo delivers a bracketed option key not yet seen from the 4 currently-synced brands
- **THEN** it still resolves via the same substring rules (color/size/generic), rather than requiring a per-brand allowlist

### Requirement: Akeneo/metafield rendering goes through a centralized snippet
Logic that interprets Akeneo-origin option keys or metafield presence SHALL live in a single centralized `ob-option-meta` snippet reused across every template/section that needs it, never duplicated or reimplemented inline in a page-specific template or section file. This establishes the `ob-*` centralized-snippet convention for this project, mirroring the `sb-*` convention on the reuse-source project.

#### Scenario: A new template needs to detect the color option
- **WHEN** a new section or snippet needs to find the `[color]` option on a product
- **THEN** it renders `ob-option-meta` rather than re-implementing the substring-matching logic locally

### Requirement: A media item's color code is parsed from its filename, and may span multiple segments
Akeneo delivers media with the filename convention `{sha1}_{product_code}_{color_code}__{shot}[_{uuid}].{ext}`, and alt text is empty — so the filename is the only carrier of a media item's color. Code that needs to know which color a media item belongs to SHALL parse it from the filename through a single centralized snippet, terminating the code at the double underscore that precedes the shot number. The color code SHALL NOT be assumed to be a single underscore-delimited segment: some brands use multi-segment codes (e.g. Loewenweiss `192_953`, `54_352`), and a parser that reads only the first segment will silently fail on them.

#### Scenario: Single-segment color code
- **WHEN** a media filename is `a9f5f34c..._X03_339__01.jpg`
- **THEN** its color code resolves to `339`

#### Scenario: Multi-segment color code
- **WHEN** a media filename is `5671d2d0..._2800BC_192_953__01.jpg`
- **THEN** its color code resolves to `192_953`, not `192`

#### Scenario: Filename does not follow the convention
- **WHEN** a media item's filename has no double-underscore shot marker (e.g. a video, or a manually uploaded image)
- **THEN** it resolves to no code and is treated as color-neutral, rather than raising an error or being mismatched to a color

### Requirement: Lookups degrade gracefully for brands without confirmed data
Only 4 of ~30 planned brands have synced products as of this change. Option-kind detection and any metafield-presence check SHALL treat an absent or unrecognized key as `generic`/absent rather than raising an error, so a product from an unverified brand still renders.

#### Scenario: A product from an unconfirmed brand has an unrecognized option key
- **WHEN** a product's option key doesn't match any known color/size substring rule
- **THEN** it is treated as kind `generic` and rendered as a plain option picker, with no error
