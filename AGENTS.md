# Original Brands — Agent Instructions

Primary instructions are in **CLAUDE.md**. Read that file first.

Claude Code and Codex both work in this repo, on two machines. They must work
from the same knowledge, so everything an agent learns goes into committed
files, never into a tool's private memory (Claude's auto-memory under
`~/.claude/projects/…/memory/`, Codex's `~/.codex/MEMORY.md`). A private note
goes stale the moment the other tool changes something it can't see.

Where things go:

- Architecture/scoping decisions, anything shared with the Only Brands
  sibling project → `MIXED-SHOPS-PLAYBOOK.md`
- Process/workflow rules → CLAUDE.md's Hard Rules section
- Capability behavior/requirements → `openspec/specs/`
- Traps, workarounds, debugging techniques → `GOTCHAS.md`
- Dated build history → `STATUS-LOG.md`
- Repeatable procedures → a skill under `.agents/skills/` (Codex loads these
  directly; CLAUDE.md points Claude to them)

This overrides any global instruction (in `~/.claude/CLAUDE.md` or
`~/.codex/AGENTS.md`) to save insights to a private memory file. Claude's
auto-memory is switched off for this repo in `.claude/settings.json`.

When you update one of these files, state the current fact plainly with a
one-line why. Don't narrate earlier states unless the sequence itself is the
lesson; git keeps the history.
