# CONTEXT.md

This project follows the frontend starter architecture and conventions defined below.

The repository uses a feature-based Next.js architecture with a minimal default dependency set. Project-specific technologies and requirements should be documented here when they are introduced.

## Project Structure

* `src/app/` — Next.js App Router. Contains routes, layouts, pages, loading/error states, and route handlers.
* `src/features/` — Business features. Feature-specific components, hooks, services, schemas, types, and utilities belong here.
* `src/components/ui/` — Generic reusable UI components without business-specific logic.
* `src/components/shared/` — Application-wide reusable components such as header, footer, navigation, sidebar, and pagination.
* `src/components/providers/` — React providers.
* `src/api/` — Low-level backend communication and API clients.
* `src/services/` — Application-level operations that use the API layer.
* `src/hooks/` — Generic reusable React hooks.
* `src/context/` — React Context implementations.
* `src/lib/` — Infrastructure, configuration, and third-party library setup.
* `src/utils/` — Small reusable pure utility functions.
* `src/types/` — Shared TypeScript types.
* `src/assets/` — Imported icons, images, and fonts.
* `src/messages/` — Translation resources when internationalization is required.
* `src/styles/` — Global styles and styling configuration.
* `src/tests/` — Unit, integration, and E2E tests.
* `public/` — Static assets referenced directly by URL.
* `.agents/` — AI agents and skills.

## Architecture

* Use feature-based architecture.
* Feature-specific code belongs inside the feature.
* Shared code belongs outside features.
* Do not move code into shared folders prematurely.
* Keep `app/` focused on routing and Next.js concerns.
* Keep business logic out of pages when it belongs in a feature or service.
* Prefer Server Components.
* Use `"use client"` only when client-side functionality requires it.
* Prefer existing abstractions before creating new ones.
* Avoid global abstractions for single-feature requirements.

## Tech Stack

The default starter stack is:

* Next.js
* React
* TypeScript
* Tailwind CSS
* pnpm

Default supporting dependencies:

* React Hook Form
* Zod
* `@hookform/resolvers`
* `clsx`
* `tailwind-merge`
* `class-variance-authority`
* `lucide-react`

The exact versions are defined by `package.json`.

Do not hardcode package versions in this document.

## API and Data Fetching

The default HTTP mechanism is native `fetch()`.

Preferred flow:

```text
Component
    ↓
Service
    ↓
API Client
    ↓
fetch()
    ↓
Backend
```

Keep API communication separate from UI components.

Do not introduce Axios or a data-fetching library unless the project has a clear requirement for it.

## State Management

No global state-management solution is required by default.

Choose the appropriate approach based on the actual application requirements.

Possible solutions include:

* React state
* Context
* URL state
* Server state
* Redux
* Zustand
* TanStack Query

Do not install a state-management library simply because it is available.

## Forms

Use React Hook Form and Zod for forms by default.

Prefer schema-based validation.

Keep feature-specific schemas close to the feature that uses them.

## Styling

Tailwind CSS is the default styling solution.

Use the existing `cn()` utility when class merging is required.

Global styles belong in:

```text
src/styles/
```

Do not introduce another styling system without a project requirement.

## TypeScript

Use TypeScript consistently.

Prefer:

* specific types
* reusable types
* type-safe API responses
* narrow types
* existing project types

Avoid `any` unless technically justified.

Feature-specific types should remain inside their feature.

Shared types belong in:

```text
src/types/
```

## Import Alias

The project uses the `@/*` import alias.

Prefer:

```ts
import { cn } from "@/utils/cn";
```

over unnecessarily deep relative imports.

## Dependencies

Before adding a dependency:

1. Check existing dependencies.
2. Check whether Next.js, React, TypeScript, or the browser already provides the functionality.
3. Check whether an existing project utility can solve the problem.
4. Add a dependency only when it provides meaningful value.

Do not add dependencies for hypothetical future requirements.

## Optional Technologies

The starter does not include every technology that may be useful in a real application.

Depending on project requirements, the following may be added:

* Redux
* Zustand
* TanStack Query
* Axios
* shadcn/ui
* Prisma
* Supabase
* Auth.js
* next-intl
* Framer Motion
* Sass
* Testing libraries
* Authentication providers
* Analytics
* Monitoring tools

These are project decisions, not starter requirements.

## Commands

Development:

```bash
pnpm dev
```

Lint:

```bash
pnpm lint
```

Format:

```bash
pnpm format
```

Check formatting:

```bash
pnpm format:check
```

Production build:

```bash
pnpm build
```

Start production server:

```bash
pnpm start
```

## Validation

After making changes:

1. Run the relevant validation.
2. Run `pnpm lint`.
3. Run `pnpm format:check`.
4. Run `pnpm build` when the change can affect the production build.
5. Review the final diff.

Do not claim a change works without verification.

## Git

* Use `pnpm`.
* Do not create commits unless explicitly requested.
* Keep commits focused on one logical change.
* Use conventional commit messages.
* Review `git status` and `git diff` before committing.

## Project-Specific Context

### Digitaz store

* Persian/English storefront (`fa` default locale) built with `next-intl`.
* OTP-only authentication via NextAuth credentials provider; login and signup
  share one verify step that auto-creates the user (`src/lib/auth.ts`,
  `src/lib/otp.ts`, `POST /api/auth/otp/request`).
* Single localized sign-in page at `src/app/[locale]/auth/sign-in` with the
  two-step OTP `SignInForm` in `src/features/auth/`; the header account
  button links there. The form uses shadcn-style primitives from
  `src/components/ui/` (`button`, `field`, `input`, ...) with `data-slot`
  attributes and `cn` class merging.
* SQLite + Prisma 7 in development (`prisma/schema.prisma`).
* No wishlist feature: the header exposes account and cart shortcuts only.

### Feature structure

Each feature under `src/features/<name>/` follows this layout:

```text
src/features/<name>/
  components/              # feature UI (Server Components by default)
  actions/                 # data fetching / server actions, one file per domain
    <name>.action.ts       # e.g. products/actions/product.action.ts
  types/                   # interfaces plus runtime validators
    <name>.ts              # e.g. products/types/product.ts
    <name>.validator.ts    # e.g. products/types/product.validator.ts
```

Conventions:

* `actions/` holds what the starter calls `services/`: functions that call
  `fetchInstance` and return validated domain data. Name files
  `<domain>.action.ts` (singular `action`, e.g. `product.action.ts`).
* Every `types/<name>.ts` has a matching `types/<name>.validator.ts` with
  `is<Name>` / `is<Name>sResponse` type guards. Validators share the tiny
  primitives in `src/utils/guards.ts`; no validation dependency is installed,
  so do not add one for this.
* Read actions validate API payloads before returning them. Shape mismatches
  throw the mapped `*_FETCH_FAILED` code so `src/utils/apiErrors.ts` resolves
  the existing localized `errors` message; single-item lookups resolve to
  `null` so pages can render the not-found boundary.

When this starter is used for a real project, add project-specific decisions here.

Examples:

* application purpose
* important features
* backend/API
* authentication
* database
* state management
* data fetching
* internationalization
* testing strategy
* deployment
* important architectural decisions
* project-specific conventions

Keep this section specific to the current project.

Do not modify the starter architecture simply to document project-specific behavior. Update the relevant architecture only when the project actually requires a different approach.
