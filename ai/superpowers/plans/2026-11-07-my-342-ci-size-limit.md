# CI and size budgets

Branch `my-342-ci-size-limit`. No spec: no application behavior changes. No `test:` commit: there is no
JS logic; the checks are the CI run and a deliberate budget breach.

## Scope

In: a GitHub Actions workflow that runs the repo checks on every push, size budgets for the Shelf bundle
next to the `ljsf` core, a `size` script that builds what it measures. Out (author's decision of
2026-11-07): the Vercel deploy, `vercel.json`, the `/book/123` fallback, any demo link, a CI badge
(house README style).

## Changes

1. `.github/workflows/ci.yml`
   - `on: push` for all branches; `concurrency` per workflow and ref with `cancel-in-progress`;
     `permissions: contents: read`.
   - One job on `ubuntu-latest`: `actions/checkout`, `pnpm/action-setup` (no `version`, it reads
     `packageManager`), `actions/setup-node` with Node 24 and `cache: pnpm`,
     `pnpm install --frozen-lockfile`, then `lint`, `lint:css`, `format:check`, `test`, `build`, `size`:
     the order of `AGENTS.md` (Verification) with the cheap checks first.
   - Actions are pinned to a major version tag.
2. `.size-limit.json`
   - Keep `ljsf core` (5 kB). Add `Shelf JS` (`apps/shelf/dist/assets/*.js`, 30 kB) and `Shelf CSS`
     (`apps/shelf/dist/assets/*.css`, 10 kB), all gzip. Hashed file names are why the entries are globs.
   - The Shelf entries set `rolldown: false`: the files are already bundled by Vite, and the preset's
     bundler rejects CSS. They are measured as built, gzipped, by `@size-limit/file`.
   - No new dependency: `@size-limit/preset-small-lib` already brings `@size-limit/file`.
3. Root `size` script: `pnpm build && size-limit`, so it builds `ljsf` and Shelf, everything it measures.
4. Breach proof, local only: lower one limit below the measured size, see `pnpm size` exit non-zero,
   restore it. The lowered value is never committed.

## Size cost

None in the shipped code. Today's measured sizes are far below the budgets; the report lists them.

## Docs

- `README.md`: the `CI` section says what runs on every push and names `.size-limit.json`; the Size
  script line mentions Shelf; no badge, no demo link.
- `ai/map.md`: the workflow file; the `.size-limit.json` line covers the Shelf entries.
- `ai/decisions/`: a dated record for the size budgets (the issue says `docs/decisions/`, records live in
  `ai/decisions/`) and its line in the index.
- `AGENTS.md`: the `Size` default and the `pnpm size` command line, which say "ljsf core" only.

## Verification

Every check of `AGENTS.md` (Verification) locally; the deliberate breach; a push of the branch and the
result of the workflow run on GitHub; the Definition of Done walk; a line-by-line review of the diff.
