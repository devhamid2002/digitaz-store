---
name: code-comments
description: "Audit and improve code comments without changing behavior: remove comments that state the obvious, keep comments that explain why, constraints, workarounds, business rules, or non-obvious decisions, and add comments only where they provide real value. Use whenever the user mentions code comments, comment cleanup, comment review, obvious comments, useless comments, why-comments, or asks to document tricky code."
---

# Code comments

Improve comments only. The diff must contain comment changes and nothing else: no behavior change, no refactors, no formatting churn.

This skill follows the project's `AGENTS.md` conventions and the existing code style. Comments are concise, neutral, human-authored, and written in English.

## When to use

- The user asks to review, clean up, audit, or improve code comments
- A change touches tricky code and needs a why-comment for constraints, workarounds, or business rules
- A review flags obvious, stale, misleading, or missing comments

## When not to use

- The task is to implement behavior, fix a bug, or refactor: that is implementation, not this skill
- The user wants docstrings/API docs generation for every function: this skill never comments mechanically

## Inputs

- The scope: entire project, one feature, or explicit file list
- The project's conventions from `AGENTS.md` / `CONTEXT.md` and the surrounding code style

## Procedure

1. Establish scope and read the code in full before touching comments. Never infer intent from a single line.
2. Classify each existing comment:
   - Keep: explains why, a constraint, a workaround with cause, a business rule, a non-obvious decision, a side effect, or a safety invariant
   - Remove: restates what the code obviously does, repeats types or names, states a stale or misleading fact, or narrates step-by-step mechanics
   - Rewrite: keep the insight but shorten to one clear line that matches surrounding style
3. Add a comment only where it provides real value and the code cannot make the reason obvious on its own. Prefer one targeted line at the decision point over file or function headers. Do not add comments mechanically to every file or function.
4. Match the existing project style:
   - TypeScript / TSX `//` for single lines, `/* */` only for true multi-line notes, TSDoc `/** */` only where the codebase already uses it
   - Concise plain English, neutral tone, no author names, no dates, no ticket spelunking, no commented-out code
   - Comments must not end with a period `.`
   - No `any` discussion unless the code itself needs it; never use a comment to excuse a shortcut the code should fix
5. Change comments only. If behavior must change to make code clear, stop and report instead of editing code.
6. Verify: run the project's own checks from `AGENTS.md` (`pnpm lint`, plus `pnpm build` when files were touched broadly). Confirm `git diff` shows comment-only hunks.

## Examples

- Remove (obvious):
  Input: `// increment i by one` above `i++`
  Output: no comment
- Keep (why):
  Input: `// next-intl Link preserves the /[locale] prefix; plain next/link drops it`
  Output: keep as-is (no trailing period)
- Add (constraint):
  Input: bare `staleTime: 60_000` with no context on why refetch is off
  Output: `// catalog changes rarely; avoid refetch storms on window focus`

## Final diff review

Before finishing, review `git diff` and confirm every hunk is a useful comment improvement: each kept comment earns its place, each added comment explains something non-obvious, and no application behavior changed.
