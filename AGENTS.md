# AGENTS.md

Read `CONTEXT.md` before making repository-specific changes.

## 1. Think Before Coding

* Understand the request before changing code.
* Do not make assumptions when requirements are ambiguous.
* If multiple approaches are reasonable, explain the tradeoffs.
* Prefer the simplest solution that satisfies the requirement.

## 2. Simplicity First

* Do not add features that were not requested.
* Avoid abstractions for single-use code.
* Do not add dependencies without a clear reason.
* Prefer existing project utilities and patterns.

## 3. Surgical Changes

* Change only what is necessary.
* Do not refactor unrelated code.
* Do not rewrite working code for personal preference.
* Preserve existing behavior unless the task requires changing it.
* Clean up only unused code created by your own changes.

## 4. Follow Project Context

Read `CONTEXT.md` before making repository-specific architectural decisions.

Follow the existing:

* architecture
* naming conventions
* package manager
* styling conventions
* API conventions
* testing conventions

Do not change project architecture without a clear reason.

## 5. Reuse Before Creating

Before creating a new:

* component
* hook
* utility
* service
* type

check whether an existing implementation can be reused.

Do not create duplicate functionality.

## 6. Server and Client Components

* Prefer React Server Components.
* Use `"use client"` only when client-side functionality is required.
* Do not add `"use client"` unnecessarily.

## 7. Type Safety

* Use TypeScript consistently.
* Avoid `any` unless technically justified.
* Prefer specific types over broad types.
* Reuse existing types when appropriate.

## 8. Dependencies

Before installing a dependency:

1. Check existing dependencies.
2. Check whether Next.js, React, TypeScript, or the browser already provides the functionality.
3. Add a package only when it provides meaningful value.

Use `pnpm` for all package operations.

## 9. Validation

After making changes, run the relevant checks.

At minimum when appropriate:

```bash
pnpm lint
pnpm format:check
```

For production-affecting changes:

```bash
pnpm build
```

Do not claim that a change works without verifying it when verification is possible.

## 10. Goal-Driven Execution

For multi-step tasks:

1. Define the goal.
2. Make a short plan.
3. Implement the smallest appropriate change.
4. Verify the result.
5. Review the final diff.

## 11. Git

* Do not create commits unless explicitly requested.
* Before committing, review:

  ```bash
  git status
  git diff
  ```
* Keep commits focused.
* Use conventional commit messages.

## 12. Do Not

The agent must not:

* replace `pnpm` with `npm` or `yarn`
* modify unrelated files
* add unnecessary dependencies
* duplicate existing functionality
* over-engineer simple tasks
* change architecture without a reason
* ignore validation failures
* claim success without verification
