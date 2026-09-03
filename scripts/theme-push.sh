#!/usr/bin/env bash
# Safe wrapper around `shopify theme push --only <file>` for this repo.
#
# Why this exists: templates/*.json is merchant-editable state that can be
# changed live in the Shopify Admin theme editor without ever being pulled
# back into git. A push built on a stale local copy of such a file silently
# reverts those live-only settings — no conflict, no warning, and nothing
# wrong-looking in `git status` (git never saw the live change in the first
# place). This happened for real on 2026-09-03 (commit cdc6c7c): a push meant
# to touch only templates/collection.json's banner section also reverted
# products_per_page, show_vendor, and image_ratio back to Dawn's Day-1
# defaults, because the local copy of the *whole file* was stale relative to
# what was actually configured live. See CLAUDE.md's "Theme settings are
# protected deployment state" Hard Rule and the feedback_pull_before_theme_push
# memory. This script makes the required pull-and-diff step automatic instead
# of relying on a human or an agent remembering to do it by hand.
#
# Usage: scripts/theme-push.sh <file> [<file> ...]
# Every JSON template in the list is pulled fresh from the live theme and
# diffed (formatting-normalized) against the local copy before anything is
# pushed. Any real difference aborts the whole push with the diff printed,
# so it can be reconciled by hand first. config/settings_data.json is always
# refused outright, mirroring .shopifyignore.

set -euo pipefail

STORE="original-brands-dev.myshopify.com"
THEME="148245381229"

if [ "$#" -eq 0 ]; then
  echo "Usage: $0 <theme-file> [<theme-file> ...]" >&2
  exit 1
fi

TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

normalize_json() {
  # Strips Shopify's auto-generated comment header (if present) and
  # reformats with sorted keys, so a pure formatting difference never
  # trips the check — only real content differences do.
  python3 -c "
import json, re, sys
raw = open(sys.argv[1], encoding='utf-8').read()
raw = re.sub(r'^\s*/\*.*?\*/\s*', '', raw, flags=re.DOTALL)
print(json.dumps(json.loads(raw), indent=2, sort_keys=True))
" "$1"
}

for f in "$@"; do
  if [ "$f" = "config/settings_data.json" ]; then
    echo "REFUSED: config/settings_data.json is protected deployment state — never push it via a normal deploy. See CLAUDE.md Hard Rules." >&2
    exit 1
  fi
done

for f in "$@"; do
  case "$f" in
    templates/*.json)
      echo "Checking live drift for $f ..."
      shopify theme pull --store="$STORE" --theme="$THEME" --only "$f" --path "$TMPDIR" >/dev/null 2>&1 || true
      if [ ! -f "$TMPDIR/$f" ]; then
        echo "  (not found live — treating as a new file, nothing to compare)"
        continue
      fi
      LIVE_NORM=$(normalize_json "$TMPDIR/$f")
      LOCAL_NORM=$(normalize_json "$f")
      if [ "$LIVE_NORM" != "$LOCAL_NORM" ]; then
        {
          echo ""
          echo "ABORTED: $f differs between the live theme and this local copy (beyond formatting)."
          echo "This usually means someone changed settings live in the Shopify Admin theme editor"
          echo "since this file was last pulled or committed. Pushing now would silently overwrite that."
          echo ""
          echo "Diff (live -> local):"
          diff <(echo "$LIVE_NORM") <(echo "$LOCAL_NORM") || true
          echo ""
          echo "Reconcile by hand — merge the live-only settings into $f — then re-run this script."
        } >&2
        exit 1
      fi
      echo "  OK: matches live, no drift."
      ;;
  esac
done

echo "All JSON templates verified clean. Pushing..."
ONLY_ARGS=()
for f in "$@"; do
  ONLY_ARGS+=(--only "$f")
done
shopify theme push --store="$STORE" --theme="$THEME" --allow-live "${ONLY_ARGS[@]}"
