"""Fail if a local JSON template would lose a shop-side change since Git HEAD."""

import json
import sys


def read(path):
    with open(path, encoding="utf-8-sig") as file:
        raw = file.read().lstrip()
    if raw.startswith("/*"):
        raw = raw.split("*/", 1)[1]
    return json.loads(raw)


base, live, local = (read(path) for path in sys.argv[1:])
missing = object()
conflicts = []


def check(before, remote, edited, path=""):
    if isinstance(before, dict) and isinstance(remote, dict):
        for key in before.keys() | remote.keys():
            check(
                before.get(key, missing),
                remote.get(key, missing),
                edited.get(key, missing) if isinstance(edited, dict) else missing,
                f"{path}.{key}" if path else key,
            )
    elif before != remote and edited != remote:
        conflicts.append(path)


check(base, live, local)
if conflicts:
    print("Live template settings missing or conflicting locally:", file=sys.stderr)
    for path in sorted(conflicts):
        print(f"  {path}", file=sys.stderr)
    sys.exit(1)
