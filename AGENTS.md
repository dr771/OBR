# Original Brands — Agent Instructions

Primary instructions are in **CLAUDE.md**. Read that file first.

This repo is worked on by more than one coding agent (Claude Code, Codex). To
keep them in sync instead of drifting apart:

- **Don't create a separate notes/memory file for this project.** If you'd
  otherwise write a persistent note (a project-memory feature, a scratch
  `NOTES.md`, etc.), put the fact where CLAUDE.md says it belongs instead:
  - Architecture/scoping decisions, anything shared with the Only Brands
    sibling project → `MIXED-SHOPS-PLAYBOOK.md`
  - Process/workflow rules → CLAUDE.md's Hard Rules section
  - Capability behavior/requirements → `openspec/specs/`
- These files are committed and are the single shared source of truth for
  every agent working in this repo — a per-tool memory silo goes stale the
  moment the other tool changes something and can't see it.
