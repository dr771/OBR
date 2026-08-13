# DESIGN-DIRECTION.md

Design-strategy input for the open **homepage direction** and **red-vs-blue CTA** decisions in [MIXED-SHOPS-PLAYBOOK.md](MIXED-SHOPS-PLAYBOOK.md). Nothing here is decided — this records evidence and reasoning as of 2026-08-13 so the decision can be made once rather than re-argued.

Method: `npx impeccable detect <url>` — 59 deterministic rules, no LLM, no API key. Re-runnable; re-run before trusting any number below.

## Evidence

| Surface | Total | Dominant pattern | cream | kickers | overused font |
|---|---|---|---|---|---|
| omoda.nl | **425** | 273 cramped-padding, 45 low-contrast, 21 bounce-easing | — | — | — |
| etrias.nl | 82 | 50 wide-tracking, 19 layout-transition | — | — | 1 |
| Bolt mockup (home) | 37 | 7 kickers, 8 low-contrast | ✓ | 7 | 2 (Inter + Fraunces) |
| Bolt PLP / PDP | 21 / 21 | hero-eyebrow-chip on both | ✓ | 3 (PDP) | 1 |
| **OBR mockup** (`?palette=deep-blue`) | **17** | 3 real findings | — | — | 1 (Inter 74%) |
| gesundheit-sprechstunde.ch (other client) | 56 | 23 tight-leading @1.15 | ✓ | — | — |

**Totals are not comparable across pages of different size** — a large commercial homepage accumulates more findings than a lean mockup. The *composition* is the signal, not the count.

Known false positives: `clipped-overflow-container` (fires on every legitimately clipped product image card — 11–40 per page, ignore); `text-overflow` on `span.visually-hidden` (sr-only clipping working as designed).

## Findings

**1. Three profiles exist, not two.**
Mainstream NL retail (Omoda) fails on *density and craft* — cramped padding, contrast, bounce easing — and trips **zero** trend rules. AI-generated (Bolt) fails on *structural scaffolding* — kicker labels above every heading, eyebrow chips, the two-font Inter+serif reflex. Our own mockup is the cleanest of everything measured.

**2. The peer set decides what "generic" means.**
Cream editorial reads generic against AI landing pages and DTC templates. It reads *distinctive* against Omoda, Zalando and Etrias — which is the only comparison our buyer ever makes. The initial "you'll look like everyone else" concern measured against a reference set the customer never sees. Warm editorial genuinely differentiates in Dutch footwear retail.

**3. The differentiating part is separable from the generic part.**
The calm, spacious editorial world is what sets us apart from Omoda. The 7 kicker labels and the second font family contribute nothing to that — Omoda has no kickers either, so nothing is being out-differentiated by "01 — Beweeg beter." Keep the world, drop the scaffolding.

**4. Both mockups' CTA fails WCAG AA, ours worse.**
OBR `#f7391e` at **3.8:1**; Bolt `#c05a3e` at **4.4:1**; AA needs 4.5:1. The red as specified is not shippable in either direction. Contrast is palette-dependent — re-test per `?palette=`.

**5. Cream is a trend hit, not an AI tell.**
The other client's human-brought design also trips `cream-palette` while tripping none of the scaffolding rules. The detector measures genericness, not provenance. Only the *cluster* (kickers + eyebrow chips + two overused fonts) indicates an assembled page.

**6. The homepage is the low-stakes decision.**
Nobody picks a shoe retailer for its hero section. Our actual advantage is Akeneo-driven discovery already shipped — color swatches that retarget the card link, per-color media galleries, the size box grid, instant facet filtering, four sort options. Omoda cannot match that without the attribute model. It is invisible in a homepage mockup comparison.

## Suggestions

1. **Do not port Bolt wholesale.** Absorb its editorial direction into the existing OBR mockup instead. Our mockup already has the cleaner structure and a working palette system; adding warmth to a clean base is less work than stripping 7 kickers, 2 fonts and 8 contrast failures out of Bolt's.
2. **Fix the CTA contrast to ≥4.5:1 before anything else.** Frame it as a conversion item, not a design item — the buy button being hard to read is measurable and neutral between both mockups.
3. **Drop the kicker/eyebrow scaffolding** in whichever direction wins. Zero competitive cost.
4. **Reconsider cream for a ten-brand host.** A warm background tints every brand's photography, and the brands supply inconsistent whites. True neutral is both more current and structurally safer here.
5. **One type family across a wide weight range**, not serif + sans. Reads more considered, loads faster, removes an `overused-font` hit.
6. **Split decision ownership** so the aesthetic and the conversion questions don't collide: visual world (palette, type, spacing, rhythm) vs. conversion levers (CTA prominence, above-fold clarity, PLP density, urgency mechanics — Melissa's call). These layers are nearly independent; a calm world can carry an aggressive CTA and a dense PLP.
7. **Fix the h1 → h3 skip** in the OBR mockup (missing h2). Accessibility, trivial.
8. **Photography consistency is the real risk.** Crop, light, background and ratio across 10 brands via Akeneo will make or break whichever direction wins — more than any framing choice. See the existing bestseller photo-variety decision for where deliberate variety is still wanted.
9. **Spend the argument-energy on PLP/PDP discovery, not the homepage.** That is where we are already ahead and where the buyer actually spends time.

## Open

- Homepage direction: OBR mockup / Bolt / OBR-absorbing-Bolt (suggestion 1).
- CTA: red vs blue — constrained by ≥4.5:1 in either case.
- Cream vs neutral background for a multi-brand host.
- Whether the calm-editorial bet or Omoda's density bet fits our funnel. Not resolvable from mockups; needs real traffic.

## Caveats

- OBR mockup scanned only at `?palette=deep-blue`. Other palettes will score differently.
- Reference sites redesign; re-run the detector rather than trusting these figures later.
- Detector output is evidence for a decision, never a mandate — it measures convention, not fit.
