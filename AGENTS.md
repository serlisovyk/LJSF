# Agent Instructions

This is the canonical instruction file for **every** AI agent working in this repo. `CLAUDE.md` and
any other tool-specific entry point point here: keep shared knowledge in `ai/`, not duplicated per
tool.

## Project

A pnpm monorepo with two products. **ljsf** is a light JavaScript framework: class components, HTML
templates with directives, reactivity hidden behind `this.reactive()`, a router, a store and a query
module. **Shelf** is a reading tracker on the Open Library API, built on ljsf the way a real app would
use it. JavaScript ESM, Vite, plain CSS with CSS Modules, Vitest + happy-dom. No TypeScript, no JSX, no
virtual DOM. The framework stays small (core budget about 5 kB gzip) and readable; the app proves its
API.

- Repo: <https://github.com/serlisovyk/LJSF>
- Backend: a separate repo and Linear project **Shelf-Backend**
- Tasks: Linear, project **ljsf** (team `MY`, issues `MY-<n>`)

## Read First

- `ai/map.md`: where packages, modules and folders live, what the project deliberately does **not**
  have. Read it before exploring the code from scratch.
- The rules of the area you touch, in `ai/rules/`: `architecture.md` for the framework ↔ app boundary
  and the layers, `testing.md` for tests and the test-first way of working, `style.md` for code style
  and naming, `css.md` for styles, `scope.md` for what not to add without an explicit request.
- `ai/rules/definition-of-done.md`: the gate before a change is handed over; `ai/rules/docs.md`: one
  fact one home, size limits, no history in docs.
- `ai/superpowers/` is the archive of past plans and specs: read only the plan or spec of the feature
  you change.

## Decisions

`ai/decisions/` records durable decisions and **why** they were made. Start from its `README.md` index
and read the records of what you touch before proposing to change or "restore" anything: rules say
what to do now, decisions say why. Reversing one means a new dated record, not editing the old one.
Propose a new record, without being asked, when a decision meets the criteria in that `README.md`.

## Workflow

`ai/workflow.md` is the end-to-end flow for a Linear task: orient, plan (+ spec when behavior
changes), implement test-first, docs, verify, Definition of Done, self-review, report, author approval,
local merge into `main`.

The parts that never bend:

- Never commit task work directly on `main`: use a `my-<n>-<slug>` branch.
- Write a **plan** for anything non-trivial, and a **spec** when observable behavior changes, under
  `ai/superpowers/`: one commit, before any code.
- **TDD**: a failing test committed as its own `test:` commit, then the code, then the refactor; a bug
  starts with a test that reproduces it (`ai/rules/testing.md`).
- Nothing is merged and no issue is marked `Done` without the author's explicit approval.
- Merges happen locally into `main`, then `main` is pushed. No pull requests, and never a force-push
  of `main`.
- Never bypass a git hook (`--no-verify`).

Prompts to start agent sessions live in `ai/prompts/` (index in `ai/prompts/README.md`):
`orchestrator.md` runs up to three tasks from one session, `task.md` runs a single task. Linear issues
follow `ai/linear-task-template.md`.

## Skills

Playbooks live in `ai/skills/` (plain Markdown, index in `ai/skills/README.md`):

- `framework-module`: the path of a framework feature through its module, the public entry, tests, size
  and `docs/`.
- `shelf-feature`: the path of a Shelf feature through api, store, service, page, component and test.
- `review`: self-review for regressions, leaks, size, scope creep, accessibility and docs drift.

If a change materially reshapes a pattern, update the matching skill in the same change
(`ai/rules/docs.md`).

## Working Principles

- Prefer small, focused changes.
- A feature lands where it belongs (`ai/rules/architecture.md`): a reusable mechanism in
  `packages/ljsf`, product logic in `apps/shelf`. The framework never learns about Shelf.
- Every byte of the core counts: no dependency, helper or abstraction without a real user.
- Follow the existing folder structure, file naming and patterns.
- Do not rewrite working code just to make it look different.
- If a request conflicts with these rules, follow the user's explicit request and mention the
  tradeoff.

## Project Defaults

- Package manager: `pnpm` (workspaces), never npm or yarn; keep `pnpm-lock.yaml`, no other lockfile.
- Packages: `packages/ljsf` (the framework, imported as `ljsf`), `apps/shelf` (the app),
  `examples/*` (small demos); `apps` and `examples` depend on `ljsf` through `workspace:*`.
- Stack: JavaScript ESM, Vite (library mode for `ljsf`), plain CSS + CSS Modules, Vitest + happy-dom.
- Formatting: Prettier (`.prettierrc`); `pnpm format` applies it. Linting: ESLint flat config and
  Stylelint (`stylelint-config-standard`).
- Pre-commit: Husky runs lint-staged (`.lintstagedrc.json`): ESLint, Stylelint and Prettier on staged
  files; fix what it reports.
- Size: `.size-limit.json` holds the budgets of the `ljsf` core and of Shelf JS and CSS; `pnpm size`
  builds and checks them. CI runs the Verification checks on every push.

## Commands

```bash
pnpm install         # install every workspace package
pnpm dev             # Shelf dev server on port 5173
pnpm build           # build ljsf, then Shelf
pnpm test            # Vitest once, in every package that has tests
pnpm lint:fix        # ESLint with --fix
pnpm format          # apply Prettier
pnpm size            # build everything and check the size budgets
```

## Language

- Chat with the author in Russian.
- Code, commit messages, `docs/` and `ai/` docs stay in English.
- Linear issues are written in Russian, following `ai/linear-task-template.md`.

## Verification

Run before handing over any change:

```bash
pnpm format:check
pnpm lint
pnpm lint:css
pnpm test
pnpm build
pnpm size
```

A change to Shelf or to an example is also used in the browser (`pnpm dev`): desktop width and 390 px
wide, keyboard and mouse. A green build does not prove a UI change works. If a check cannot be run,
report that clearly.
