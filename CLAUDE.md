# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository. Codex also works in this repo and reads `AGENTS.md`, which points back here — CLAUDE.md is the shared source of truth for both, not Claude-specific.

## Project Overview

Shopify theme rebuild for Original Brands (originalbrands.nl) — multi-brand apparel + footwear retailer, migrating from a custom Drupal-ish CMS.

- **Store:** original-brands-dev.myshopify.com (storefront password: `original`)
- **Theme base:** Dawn (cloned fresh 2026-08-10, no upstream git history)
- **Product data source:** will be Akeneo (not yet connected — no products in the dev store yet)
- **Reference project:** `C:\Users\rezni\SHOPIFY\SweatyBetty` — same Dawn/Akeneo/OpenSpec stack, further along. Reuse its shipped patterns and lessons, not its SB-specific branding/hacks.
- **Only Brands (onlybrands.nl)** was a sibling shop for the same client/stack — **killed 2026-08-10**. The playbook below still has comparative research from when both were being scoped together (kept for the reasoning, not as an active second project).

## Project Docs

Read these before any major decision:

- [MIXED-SHOPS-PLAYBOOK.md](MIXED-SHOPS-PLAYBOOK.md) — every scoping decision for Original Brands + Only Brands: reuse ledger against SB's shipped specs, live-site audit, homepage direction, Akeneo→Shopify product-model decision. Read this first, always.
- `openspec/specs/` — capability specs, seeded on-touch as work starts (empty until the first change is proposed/archived)
- `mockup/` — the pre-Shopify static homepage mockup, reference only, not the live theme

## Shopify CLI

```
shopify theme dev --store=original-brands-dev.myshopify.com --store-password=original
```

Non-interactive shells (agent sessions) need `--store-password` explicit — the CLI can't prompt for it. See project memory `shopify-cli-windows-ops` for more CLI/Windows gotchas (port conflicts, `--force` on mutating commands).

## Hard Rules

- **Spec-covered changes:** For any bug report or behavior-change request, run `openspec list --specs` first, before touching code — don't rely on recognizing the capability from how the request happens to be phrased. If the touched area matches a listed capability, read its spec before editing. If the change would alter a documented SHALL/MUST requirement (not just an unspecified implementation detail), route it through `/opsx:propose` → apply → archive instead of editing the code directly. Early on, `openspec/specs/` will mostly be empty — as capabilities get built (many by porting from SB's reuse ledger), seed a spec for each one rather than skipping this because "there's nothing there yet."
- **"Autopilot" workflow:** once intent is confirmed (via `/opsx:explore` + discussion), "autopilot" means running `/opsx:propose`/`/opsx:ff` → `/opsx:apply` unattended, then **stopping before `/opsx:archive`** to let the user review/correct the actual code — the archived spec should reflect the final corrected code, not a pre-review draft. Only archive after explicit approval. Only skip the pre-archive stop if the user explicitly says the autopilot run should include archive.
- **"Update the docs" (end of a task):** check whether the task changed behavior for anything in `openspec/specs/` — if so, sync that spec too (a quick `/opsx:propose` → apply → archive cycle for a real requirement change, a direct edit for wording-only fixes). Also check whether MIXED-SHOPS-PLAYBOOK.md needs a new decision recorded (architecture/scoping calls go there, not into Claude memory — it's committed and shared with Only Brands).

## Current Status

Pre-build: Dawn theme scaffolded and connected to the dev store (2026-08-10), no sections/templates customized yet, no Akeneo connection, no products. Next real step is porting capabilities from SB's reuse ledger in MIXED-SHOPS-PLAYBOOK.md, starting wherever the client's priority points.
