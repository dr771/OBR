## Context

`plp-card-swatches` already specified swatch chip *behavior* (image source, hover/selection, tooltip, link retargeting) but never its position or visual treatment on the card. Commit 2860b48 shipped a position/style change (chips below the image, borderless, multiply-blended) without a matching spec update — this backfills that gap.

## Goals / Non-Goals

**Goals:**

- Document the shipped chip position (below the main image) and visual treatment (shared warm surface, multiply blend, outline for active/focus, opacity for unavailable) as spec requirements.

**Non-Goals:**

- The card typography and Wishlist King floating-heart restyling that shipped in the same commit are out of scope here — they belong to `plp-card-meta` (already spec'd separately) and `wishlist-integration` respectively, and are noted as a separate follow-up rather than backfilled in this change.

## Decisions

- Treat this purely as a documentation backfill: the code already shipped and is live-verified by virtue of being in production use since 2026-08-16; no new implementation work is needed.

## Risks / Trade-offs

- [Backfilling after the fact risks the spec drifting from what's actually live] → Wrote requirements directly from the shipped CSS/markup diff (2860b48), not from memory.
