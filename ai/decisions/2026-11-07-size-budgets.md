# Size budgets: core 5 kB, Shelf JS 30 kB, CSS 10 kB

Date: 2026-11-07 · Status: accepted

## Context

The framework's point is to stay small, and nothing but a number holds that line. Shelf is the app that
proves the API, so its bundle size is the cost a user of ljsf would see.

## Decision

- `.size-limit.json` holds three gzip budgets: the `ljsf` core 5 kB, Shelf JS 30 kB, Shelf CSS 10 kB.
- Going over a budget fails `pnpm size` and the CI run. The way out is a smaller design; raising a
  budget is the author's call and a new dated record.
- The Shelf entries are globs on the built `assets/` (file names carry a hash) and are measured as Vite
  emitted them, not bundled again.

## Consequences

- `pnpm size` builds every package first, so it never measures a stale build.
- A change that eats a visible share of a budget says so in its report.
- Rejected: one budget for the whole of Shelf (a CSS growth would hide in the JS margin); no Shelf
  budget (the app is where an unwelcome dependency or a heavy feature shows up first).
