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
# protected deployment state" Hard Rule and GOTCHAS.md
# (Shopify CLI and pushing). This script makes the required pull-and-diff step automatic instead
# of relying on a human or an agent remembering to do it by hand.
#
# Usage: scripts/theme-push.sh [--dev] <file> [<file> ...]
# Targets the pre-live shop's active Dawn theme (the working surface); --dev
# targets the DEV test shop instead (see CLAUDE.md, Shopify CLI).
#
# EVERY theme file goes through this script, not only templates/*.json: the
# OB team edits the frontend in the Admin, which writes templates, section
# groups (sections/*.json), locales/*.json ("Edit default theme content") and,
# through the code editor, any Liquid/CSS/JS file. A raw `shopify theme push`
# is blocked by a Claude hook (.claude/settings.json).
#
# 1. Pre-live only accepts committed files (the commit is what goes live).
# 2. All files are pulled fresh in one call; a failed pull aborts.
# 3. scripts/check-theme-drift.py compares each file with the ledger
#    (assets/ob-theme-push-ledger.json in the shop: a hash of every file as we
#    last pushed it). A changed hash means an Admin edit: JSON is merged
#    three-way into the local file (exit 3: review, commit, re-run);
#    overlapping or non-JSON edits abort.
# 4. After the push the files are pulled again and the ledger is updated in
#    the shop. Its local copy is a gitignored staging file.
# config/settings_data.json is always refused outright, mirroring .shopifyignore.

set -euo pipefail
export PYTHONIOENCODING=utf-8

STORE="original-brands-mtr6tuym.myshopify.com"
THEME="209721262417"
if [ "${1:-}" = "--dev" ]; then
  STORE="original-brands-dev.myshopify.com"
  THEME="148245381229"
  shift
fi

if [ "$#" -eq 0 ]; then
  echo "Usage: $0 [--dev] <theme-file> [<theme-file> ...]" >&2
  exit 1
fi
echo "Target: $STORE theme $THEME"

TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

if python3 --version >/dev/null 2>&1; then
  PYTHON=python3
elif python --version >/dev/null 2>&1; then
  PYTHON=python
else
  echo "ABORTED: Python is required to compare JSON templates." >&2
  exit 1
fi

LEDGER="assets/ob-theme-push-ledger.json"
for f in "$@"; do
  if [ "$f" = "$LEDGER" ]; then
    echo "REFUSED: $LEDGER is written by this script only." >&2
    exit 1
  fi
  if [ "$f" = "config/settings_data.json" ]; then
    echo "REFUSED: config/settings_data.json is protected deployment state — never push it via a normal deploy. See CLAUDE.md Hard Rules." >&2
    exit 1
  fi
done

if [ "$STORE" = "original-brands-mtr6tuym.myshopify.com" ]; then
  DIRTY=$(git status --porcelain -- "$@")
  if [ -n "$DIRTY" ]; then
    echo "ABORTED: pre-live only receives committed files. Commit first:" >&2
    echo "$DIRTY" >&2
    exit 1
  fi
fi

PULL_ARGS=()
for f in "$@"; do
  PULL_ARGS+=(--only "$f")
done
echo "Pulling the shop's current copy of $# file(s) ..."
if ! shopify theme pull --store="$STORE" --theme="$THEME" "${PULL_ARGS[@]}" --only "$LEDGER" --path "$TMPDIR" >/dev/null 2>&1; then
  echo "ABORTED: theme pull failed, so Admin edits cannot be ruled out. Nothing pushed." >&2
  exit 1
fi

set +e
"$PYTHON" scripts/check-theme-drift.py check "$TMPDIR" "$@"
STATUS=$?
set -e
if [ "$STATUS" -eq 3 ]; then
  echo "" >&2
  echo "STOPPED: Admin edits were merged into the local file(s) above. Review with git diff," >&2
  echo "commit them, then re-run this script. Nothing pushed." >&2
  exit 3
elif [ "$STATUS" -ne 0 ]; then
  echo "" >&2
  echo "ABORTED: reconcile the conflicts above by hand, then re-run. Nothing pushed." >&2
  exit 1
fi

echo "No Admin edit would be lost. Pushing..."
shopify theme push --store="$STORE" --theme="$THEME" --allow-live "${PULL_ARGS[@]}"

echo "Recording the pushed state in $LEDGER ..."
mkdir -p "$TMPDIR/after"
if shopify theme pull --store="$STORE" --theme="$THEME" "${PULL_ARGS[@]}" --path "$TMPDIR/after" >/dev/null 2>&1   && "$PYTHON" scripts/check-theme-drift.py record "$TMPDIR/$LEDGER" "$TMPDIR/after" "$LEDGER" "$@"   && shopify theme push --store="$STORE" --theme="$THEME" --allow-live --only "$LEDGER" >/dev/null 2>&1; then
  rm -f "$LEDGER"
  echo "Done."
else
  echo "WARNING: push succeeded, but the ledger was not updated. The next push of these files" >&2
  echo "will compare against Git instead and may stop for review." >&2
fi
