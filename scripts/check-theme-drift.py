"""Refuse a theme push that would overwrite a change made in the Shopify Admin.

The OB team edits the frontend in the Admin (theme editor, "Edit default theme
content", code editor). Those edits live only in the shop. This script decides,
per file, whether the shop's copy is still what we last pushed.

The ledger (LEDGER, a theme asset, so each shop carries its own and both
machines read the same one) records for every file the wrapper pushed:
  "shop": hash of the shop's copy right after our push (Shopify may reformat)
  "git":  hash of the local file we pushed (findable in Git history)

  check <live-dir> <file>...
    <live-dir> holds the shop's current copies (and the ledger), pulled just
    before the push. Per file:
    - not in the shop, or same content as local: fine.
    - shop hash equals the ledger's "shop" hash: untouched since our push.
    - otherwise it was edited in the Admin. Base = the Git version whose hash
      is the ledger's "git" hash. JSON is merged three-way: Admin edits that
      don't touch what the local copy changed are written into the local file.
      Same setting changed on both sides, a non-JSON file, or no base: conflict.
    - no ledger entry yet (pushed before the ledger existed): fine only if the
      shop holds exactly a committed version; otherwise merge against HEAD.
    Exit 0 safe, 1 conflict (nothing written), 3 merged (review, commit, re-run).

  record <old-ledger> <after-dir> <out> <file>...
    Writes the updated ledger after a successful push. <after-dir> holds the
    shop's copies pulled right after the push.
"""

import difflib
import hashlib
import json
import os
import re
import subprocess
import sys

LEDGER = "assets/ob-theme-push-ledger.json"
MISSING = object()
HISTORY_LIMIT = 200


def read(path):
    with open(path, encoding="utf-8-sig") as handle:
        return handle.read()


def parse(path, text):
    """(header, content): parsed JSON for .json files, LF text otherwise."""
    text = text.lstrip("﻿")
    if not path.endswith(".json"):
        return "", text.replace("\r\n", "\n")
    header = ""
    match = re.match(r"\s*/\*.*?\*/\s*", text, flags=re.DOTALL)
    if match:
        header, text = match.group(0).lstrip(), text[match.end():]
    return header, json.loads(text)


def digest(path, content):
    if path.endswith(".json"):
        content = json.dumps(content, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(content.encode("utf-8")).hexdigest()[:20]


def git_versions(path):
    """Parsed contents of every committed version of path, newest first."""
    hashes = subprocess.run(
        ["git", "log", f"-n{HISTORY_LIMIT}", "--format=%H", "--", path],
        capture_output=True, text=True, check=True,
    ).stdout.split()
    versions = []
    for commit in hashes:
        shown = subprocess.run(["git", "show", f"{commit}:{path}"], capture_output=True)
        if shown.returncode == 0:
            versions.append(parse(path, shown.stdout.decode("utf-8", errors="replace"))[1])
    return versions


def load_ledger(path):
    if not os.path.exists(path):
        return {}
    return json.loads(read(path))


def changed_paths(before, after, path):
    if isinstance(before, dict) and isinstance(after, dict):
        found = []
        for key in list(before) + [k for k in after if k not in before]:
            found += changed_paths(
                before.get(key, MISSING), after.get(key, MISSING), f"{path}.{key}" if path else key
            )
        return found
    return [] if before == after else [path or "(whole file)"]


def merge(base, live, local, path, taken, conflicts):
    """Three-way merge of parsed JSON; MISSING stands for an absent key."""
    if live == base or live == local:
        return local
    if local == base:
        taken.extend(changed_paths(base, live, path))
        return live
    if all(isinstance(v, dict) for v in (base, live, local)):
        merged = {}
        keys = list(local) + [k for k in live if k not in local]
        keys += [k for k in base if k not in local and k not in live]
        for key in keys:
            value = merge(
                base.get(key, MISSING), live.get(key, MISSING), local.get(key, MISSING),
                f"{path}.{key}" if path else key, taken, conflicts,
            )
            if value is not MISSING:
                merged[key] = value
        return merged
    conflicts.append(path or "(whole file)")
    return local


def lookup(value, path):
    for key in path.split(".") if path != "(whole file)" else []:
        if not isinstance(value, dict) or key not in value:
            return MISSING
        value = value[key]
    return value


def show(value):
    return "(absent)" if value is MISSING else json.dumps(value, ensure_ascii=False)[:160]


def print_text_diff(base, live):
    lines = difflib.unified_diff(base.splitlines(), live.splitlines(), "ours", "shop", lineterm="")
    for line in list(lines)[:60]:
        print(f"    {line}")


def check_file(live_dir, ledger, path):
    """Returns 'ok', 'merged' or 'conflict'."""
    live_path = os.path.join(live_dir, path)
    if not os.path.exists(live_path):
        print(f"  {path}: not in the shop yet, nothing to protect.")
        return "ok"
    _, live = parse(path, read(live_path))
    if not os.path.exists(path):
        entry = ledger.get(path)
        if (entry and entry.get("shop") == digest(path, live)) or live in git_versions(path):
            print(f"  {path}: deleted locally, the shop copy is unedited; the push removes it.")
            return "ok"
        print(f"  {path}: CONFLICT, deleted locally but edited in the shop.")
        return "conflict"

    local_header, local = parse(path, read(path))
    if live == local:
        print(f"  {path}: shop already matches the local copy.")
        return "ok"

    entry = ledger.get(path)
    if entry and entry.get("shop") == digest(path, live):
        print(f"  {path}: untouched in the shop since our last push.")
        return "ok"

    versions = git_versions(path)
    if entry:
        base = next((v for v in versions if digest(path, v) == entry.get("git")), MISSING)
        if base is MISSING:
            print(f"  {path}: CONFLICT, edited in the shop, and the version we last pushed is not in Git.")
            return "conflict"
    elif live in versions:
        print(f"  {path}: no ledger entry yet; the shop holds a committed version, no Admin edits.")
        return "ok"
    elif versions:
        base = versions[0]
        print(f"  {path}: no ledger entry yet; comparing the shop against HEAD.")
    else:
        print(f"  {path}: CONFLICT, edited in the shop and no Git history to compare against.")
        return "conflict"

    if not path.endswith(".json"):
        print(f"  {path}: CONFLICT, edited in the shop (code editor). Shop vs what we last pushed:")
        print_text_diff(base, live)
        return "conflict"

    taken, conflicts = [], []
    merged = merge(base, live, local, "", taken, conflicts)
    if conflicts:
        print(f"  {path}: CONFLICT, the shop and the local copy changed the same settings:")
        for item in sorted(conflicts):
            print(f"    {item}\n      shop:  {show(lookup(live, item))}\n      local: {show(lookup(local, item))}")
        return "conflict"
    if merged == local:
        print(f"  {path}: Admin edits already contained in the local copy.")
        return "ok"
    with open(path, "w", encoding="utf-8", newline="\n") as handle:
        handle.write(local_header + json.dumps(merged, indent=2, ensure_ascii=False) + "\n")
    print(f"  {path}: MERGED {len(taken)} Admin edit(s) into the local file:")
    for item in sorted(taken):
        print(f"    {item}: {show(lookup(live, item))}")
    return "merged"


def check(live_dir, files):
    ledger = load_ledger(os.path.join(live_dir, LEDGER))
    results = [check_file(live_dir, ledger, f) for f in files]
    if "conflict" in results:
        sys.exit(1)
    if "merged" in results:
        sys.exit(3)


def record(old_ledger, after_dir, out, files):
    ledger = load_ledger(old_ledger)
    for path in files:
        after = os.path.join(after_dir, path)
        if not os.path.exists(after) or not os.path.exists(path):
            ledger.pop(path, None)
            continue
        ledger[path] = {
            "shop": digest(path, parse(path, read(after))[1]),
            "git": digest(path, parse(path, read(path))[1]),
        }
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w", encoding="utf-8", newline="\n") as handle:
        json.dump(dict(sorted(ledger.items())), handle, indent=1)
        handle.write("\n")


def main():
    command, args = sys.argv[1], sys.argv[2:]
    if command == "check":
        check(args[0], args[1:])
    elif command == "record":
        record(args[0], args[1], args[2], args[3:])
    else:
        sys.exit(f"unknown command {command}")


main()
