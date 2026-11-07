# Repo map

Navigation only: where things live and who owns what. How it works is in the code, why in `ai/decisions/`.

## Repo

- `packages/ljsf/` — the framework, the package `ljsf` (below).
- `apps/shelf/` — the reading tracker (below).
- `examples/` — small standalone demos on ljsf (counter, todo), one workspace package per folder.
- `docs/` — public docs of the framework: API reference, guides. Agent docs stay in `ai/`.
- `pnpm-workspace.yaml` — the workspace: `packages/*`, `apps/*`, `examples/*`. `pnpm-lock.yaml` — the only lockfile.
- `package.json` — root scripts `dev`, `build`, `lint`, `lint:fix`, `lint:css`, `format`, `format:check`, `prepare` (installs the hook),
  `test`, `size`; all tooling devDependencies; `packageManager` pins pnpm.
- `eslint.config.js` — flat config: recommended rules, browser globals for packages, apps and examples, Node globals for configs, Prettier.
- `stylelint.config.js` — `stylelint-config-standard`. `.prettierrc`, `.prettierignore` — Prettier.
- `.husky/pre-commit`, `.lintstagedrc.json` — the pre-commit hook: lint-staged runs ESLint, Stylelint and Prettier on staged files.
- `.size-limit.json` — size budgets: the `ljsf` core, Shelf JS and Shelf CSS, each checked built and gzipped.
- `.github/workflows/ci.yml` — CI on every push: install, lint, lint:css, format:check, test, build, size.
- `AGENTS.md` — the entry point for agents; `CLAUDE.md` points to it.
- `ai/` — agent docs: this map, `workflow.md`, `rules/`, `skills/`, `decisions/`, `prompts/`,
  `linear-task-template.md`, and the archive `superpowers/` (`plans/`, `specs/`).
- `.claude/worktrees/` — one git worktree per task when tasks run in parallel; ignored by git.

## Framework (`packages/ljsf`)

- `src/index.js` — the only public entry: everything an app may use is exported here.
- `src/<module>/` — one folder per module as it lands: `reactivity`, `template`, `component`, `router`, `store`, `query`.
- `src/reactivity/` — `signal`, `computed`, `effect`, owners, scheduler (`batch`), `reactive()`; only `reactive`, `effect`, `batch` are public.
- `test/` — Vitest tests in happy-dom, `<name>.test.js`.
- `vite.config.js` — library build (ES module `dist/ljsf.js`) and the Vitest environment.
- `package.json` — `exports` maps `ljsf` to `src/index.js`; scripts `build`, `test`, `test:watch`; no runtime dependencies.

## App (`apps/shelf`)

- `index.html` — the page shell with `#app`; `vite.config.js` — dev server on port 5173.
- `src/main.js` — the entry: imports `ljsf` and the global styles, mounts the app.
- `src/styles/` — global CSS: tokens, themes, reset, base, cascade layers.
- Planned folders (created by their tasks): `components/`, `pages/`, `stores/`, `api/`, `services/`, `router/`.

## What the project does not have

- TypeScript, JSX, a compiler step of its own, a virtual DOM, SSR, devtools.
- `eval`, `new Function` or any string-to-code path in directives.
- Runtime dependencies in `ljsf`; a UI kit, a CSS preprocessor or CSS-in-JS in Shelf.
- Publishing to npm: `ljsf` is consumed only inside this workspace.
- A backend: Shelf keeps user data in `localStorage` until it moves to Shelf-Backend.
