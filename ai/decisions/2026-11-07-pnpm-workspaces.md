# pnpm workspaces, no task runner

Date: 2026-11-07 · Status: accepted

## Context

The repo holds one framework package, one app and a few examples that must be linked locally. npm
workspaces, pnpm workspaces and Nx on top of a package manager were the options.

## Decision

- pnpm workspaces: `pnpm-workspace.yaml` lists `packages/*`, `apps/*`, `examples/*`; an app depends on
  `ljsf` through `workspace:*`.
- `packageManager` in the root `package.json` pins the pnpm version; `pnpm-lock.yaml` is the only
  lockfile.
- Root scripts call pnpm directly (`pnpm -r build`, `pnpm --filter shelf dev`); no task runner.

## Consequences

- pnpm's strict `node_modules` fails a phantom import: a package uses only what its own `package.json`
  declares, which keeps `ljsf` honest about having no runtime dependencies.
- Commands in the docs, CI and Linear issues are `pnpm ...`; CI installs with
  `pnpm install --frozen-lockfile`.
- A `package-lock.json` or `yarn.lock` that appears is a mistake: remove it.
- Rejected: npm workspaces (hoisting hides undeclared dependencies); Nx or Turborepo (a task graph and a
  cache cost more configuration than they save for two packages and a few examples).
