# Decisions

Durable project decisions: why a choice was made, with a date. One decision per file, named
`YYYY-MM-DD-<slug>.md`. Format: a title, a `Date: ... · Status: ...` line, then `Context` → `Decision` →
`Consequences`; short and specific (about 30 lines, `ai/rules/docs.md`), rejected alternatives with their
reason, no check logs.

How this differs from `ai/rules/`: **rules** state what to do now (current law, rewritten as it changes).
**Decisions** state _why_, with a date. A record's text is not rewritten or deleted; only its `Status`
line changes.

The point: an agent (or a human) does not relitigate settled questions or "helpfully" restore something
that was deliberately rejected.

## Status

- `accepted`: in force and built.
- `accepted (not implemented)`: agreed now, built by a later task; that task sets it to `accepted`.
- `superseded by <file>`: replaced by a newer record; its line in the index moves to a Superseded group.

## Changing a decision

A refinement or a reversal is a **new record** that restates what stays in force, so the reader needs
only the newest one. The old record only changes its `Status` line to `superseded by <file>`.

## When to add a record

Propose one as soon as the decision surfaces, without being asked, and only for:

- a standing constraint ("we will not do X", "always / never Y");
- a feature the author deliberately rejected, in a dated record of its own;
- a tradeoff accepted over a named alternative, one a future agent would likely undo;
- a goal agreed now and built later (`accepted (not implemented)`);
- a convention chosen where an obvious alternative existed.

Not decisions: one-off task details, plain current-state facts, a choice nobody would reverse, anything
`ai/rules/` and `ai/map.md` already cover. Do not create noise records.

## Records

### Project and process

- [pnpm workspaces, no task runner](2026-11-07-pnpm-workspaces.md)
- [A monorepo, `ljsf` is not published to npm](2026-11-07-monorepo-without-npm-publish.md)
- [JavaScript ESM, no TypeScript](2026-11-07-javascript-without-typescript.md)
- [Prettier `endOfLine: auto`](2026-11-07-prettier-end-of-line-auto.md)
- [Only the tooling files the project uses](2026-11-07-tooling-files.md)
- [Vitest, happy-dom and TDD](2026-11-07-vitest-and-tdd.md)
- [Merge locally into `main`, no pull requests](2026-11-07-local-merge-without-pr.md)
- [Size budgets: core 5 kB, Shelf JS 30 kB, CSS 10 kB](2026-11-07-size-budgets.md)

### Framework

- [Class components and HTML templates](2026-11-07-class-components-and-html-templates.md)
- [Directives read property paths only, no `eval`](2026-11-07-directives-with-paths-only.md)
- [Plain CSS with CSS Modules](2026-11-07-css-modules.md)
