# AGENTS.md

## Project Overview

This is a Next.js application using:

- Next.js 16.3.4
- React 19.2.8
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Lucide React
- React Icons
- next-themes
- pnpm 11.11.0

The project uses a feature-based architecture.

## Package Manager

This project uses **pnpm**.

Always use pnpm instead of npm or yarn.

### Commands

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

Do not replace these with npm or yarn commands.

## Architecture

The source code is located inside `src/`.

```text
src/
├── api/
├── app/
├── assets/
├── components/
│   ├── providers/
│   ├── shared/
│   │   ├── footer/
│   │   └── header/
│   └── ui/
├── context/
├── features/
├── helpers/
├── hooks/
├── lib/
├── messages/
├── services/
├── tests/
├── types/
│   └── enum/
└── utils/
```

## Feature-Based Architecture

The `features/` directory is the primary location for feature-specific code.

A feature should own code that belongs specifically to that feature.

Example:

```text
features/
└── products/
    ├── components/
    ├── hooks/
    ├── services/
    ├── types/
    └── ...
```

If a component, hook, utility, type, or service is specific to one feature, keep it inside that feature.

Do not move feature-specific code into `components/shared/`.

Do not put everything into `shared` simply because it is a React component.

## Shared Components

Reusable application components used by multiple pages or features belong in:

```text
src/components/shared/
```

Current shared areas include:

```text
components/shared/
├── header/
│   ├── Header.tsx
│   ├── MainHeader.tsx
│   ├── MegaMenu.tsx
│   ├── Navigation.tsx
│   └── TopBar.tsx
└── footer/
```

A component belongs in `shared/` when it is genuinely reusable across different parts of the application.

Do not create shared components prematurely.

If a component belongs only to one feature, keep it inside that feature.

## UI Components

Reusable low-level UI components belong in:

```text
src/components/ui/
```

Follow the existing shadcn/ui conventions.

Do not unnecessarily rewrite or duplicate existing UI primitives.

## Providers

Application-wide React providers belong in:

```text
src/components/providers/
```

Feature-specific providers should remain inside their feature unless they are genuinely application-wide.

## App Router

Routing and pages belong inside:

```text
src/app/
```

Keep route-specific logic close to the route or relevant feature.

## Server and Client Components

Prefer React Server Components by default.

Only add:

```tsx
"use client";
```

when the component actually requires client-side functionality such as:

- `useState`
- `useEffect`
- event handlers
- browser APIs
- client-only libraries
- client-side context

Do not add `"use client"` unnecessarily.

Avoid turning large component trees into Client Components when only a small part requires client-side behavior.

## TypeScript

Use TypeScript consistently.

Prefer explicit types for:

- component props
- API responses
- feature data
- reusable functions
- shared utilities

Avoid `any` unless there is a strong technical reason.

Prefer specific types over `any`.

## Enums

Enums are stored inside:

```text
src/types/enum/
```

When adding a new enum, follow the existing naming and organization conventions in that directory.

Do not create random enum files in unrelated directories.

## Hooks

Global reusable hooks belong in:

```text
src/hooks/
```

Feature-specific hooks should stay inside the relevant feature:

```text
src/features/<feature>/hooks/
```

Do not put feature-specific hooks into the global hooks directory.

## Services

Application or external data-access services belong in:

```text
src/services/
```

If a service is strongly coupled to one feature, prefer keeping it inside that feature.

## Helpers and Utils

Use the existing directories:

```text
src/helpers/
src/utils/
```

Do not create additional utility directories.

Before creating a new helper or utility, check whether an existing function already solves the problem.

Avoid duplicated utility functions.

## Context

Global React contexts belong in:

```text
src/context/
```

Feature-specific state should generally remain inside the feature unless it genuinely needs to be globally accessible.

## Internationalization

Translations are stored in:

```text
src/messages/
```

The application supports localized UI.

Do not hardcode user-facing translated text inside components when the existing message system should be used.

When adding UI text, update the appropriate locale message files and keep supported locales consistent.

## Styling

Use Tailwind CSS for styling and follow the existing project conventions.

Prefer existing design tokens, utility classes, and components instead of introducing another styling system.

Avoid unnecessary custom CSS.

Before adding CSS to global styles, check whether the same result can be achieved with existing Tailwind utilities.

## Component Guidelines

Prefer small, focused components.

Avoid large components that combine UI, data fetching, business logic, state management, and formatting without a clear reason.

Separate responsibilities when there is a clear benefit.

## Reuse Before Creating

Before creating a new component, hook, helper, utility, or service:

1. Check whether an existing implementation can be reused.
2. Check `components/shared/`.
3. Check `components/ui/`.
4. Check the relevant feature.
5. Only then create a new implementation.

Do not duplicate existing functionality.

## Imports

Use the project's configured path aliases when available.

Prefer:

```ts
import Button from "@/components/ui/button";
```

over unnecessarily long relative paths.

Follow the existing import ordering and formatting conventions.

## Changes

When modifying the project:

- Make the smallest reasonable change.
- Do not rewrite unrelated code.
- Do not rename files without a reason.
- Do not change the architecture unnecessarily.
- Do not introduce new dependencies when existing dependencies can solve the problem.
- Preserve existing behavior unless the task explicitly requires changing it.

## Dependencies

Before installing a package, check whether an existing dependency already provides the required functionality.

Use:

```bash
pnpm add <package>
```

for production dependencies.

Use:

```bash
pnpm add -D <package>
```

for development dependencies.

Never use npm or yarn.

## Validation

After making changes, run the relevant checks.

At minimum, when appropriate:

```bash
pnpm lint
```

For changes that may affect the production build:

```bash
pnpm build
```

Do not claim that a change works without validating it when validation is possible.

## Do Not

The agent must not:

- Replace pnpm with npm/yarn.
- Create unnecessary global components.
- Put feature-specific code in `components/shared`.
- Add `"use client"` without a reason.
- Use `any` unnecessarily.
- Duplicate existing components or utilities.
- Add unnecessary dependencies.
- Modify unrelated files.
- Rewrite working code just for stylistic preference.
- Change the project architecture without a clear reason.

## Priority

When working on this project, follow this order:

1. Existing project conventions
2. Feature ownership
3. Reusability
4. Type safety
5. Minimal changes
6. Performance
7. Developer experience
