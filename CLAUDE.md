@AGENTS.md
# CLOUD.md

## Purpose

This document contains cloud, deployment, environment, and production-related instructions for the project.

The application is a Next.js application.

## Package Manager

The project uses:

```text
pnpm 11.11.0
```

Use pnpm for dependency installation, development, and production builds.

## Framework

```text
Next.js 16.3.4
React 19.2.8
TypeScript
```

## Build

The production build command is:

```bash
pnpm build
```

The production server can be started with:

```bash
pnpm start
```

## Development

Run the development server with:

```bash
pnpm dev
```

## Lint

Run:

```bash
pnpm lint
```

before deploying when possible.

## Environment Variables

Environment variables must not be committed to Git.

Use:

```text
.env.local
```

for local development when appropriate.

Production environment variables must be configured in the deployment platform.

Never expose secrets through:

- source code
- Git commits
- public environment variables
- client-side components

Only variables intentionally required by the browser should be exposed as public environment variables.

## Production Rules

Before changing deployment-related configuration:

1. Check the existing configuration.
2. Understand why the configuration exists.
3. Make the smallest required change.
4. Run `pnpm build`.
5. Run `pnpm lint` when applicable.

Do not change deployment configuration simply to silence a warning unless the change is understood and safe.

## Dependencies

Before adding a dependency, check whether an existing dependency can solve the problem.

Production dependency:

```bash
pnpm add <package>
```

Development dependency:

```bash
pnpm add -D <package>
```

After dependency changes:

```bash
pnpm install
pnpm build
```

## Deployment Checklist

Before production deployment:

- [ ] Dependencies install successfully.
- [ ] `pnpm lint` passes.
- [ ] `pnpm build` passes.
- [ ] Required environment variables are configured.
- [ ] No secrets are committed.
- [ ] Production configuration is correct.
- [ ] Database/API services are reachable.
- [ ] Local-only URLs are not used in production.
- [ ] Application routes work correctly.
- [ ] Images and assets resolve correctly.

## Agent Rules

When working on cloud or deployment issues:

- Do not randomly modify configuration files.
- Do not remove dependencies just to make the build pass.
- Do not change Node.js or pnpm versions without checking compatibility.
- Do not expose environment variables.
- Do not commit `.env` files.
- Prefer fixing the root cause instead of hiding build errors.
- Always verify the production build after significant deployment changes.

## Local vs Production

Local development and production may use different environment variables.

Never assume that a value available locally also exists in production.

If a build works locally but fails in the cloud:

1. Check the build logs.
2. Check the Node.js version.
3. Check the pnpm version.
4. Check dependency installation.
5. Check environment variables.
6. Check filesystem and path assumptions.
7. Run `pnpm build` locally.
8. Only then modify deployment configuration.
