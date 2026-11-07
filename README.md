# ljsf

🪶 Light JavaScript framework and Shelf, a reading tracker built on it.

ljsf is a thin layer over HTML and JS: class components, HTML templates with directives and hidden
reactivity. Shelf is the demo app that uses the framework the way a real app would. Both live in one
pnpm monorepo: the framework in `packages/ljsf`, the app in `apps/shelf`, linked locally through
the workspace.

> Early stage: the monorepo and quality tooling are in place, framework modules are next.

## ✨ Features

- pnpm workspace: `apps/shelf` imports `ljsf` as a package via `workspace:*`
- `ljsf` builds in Vite library mode, single public entry `packages/ljsf/src/index.js`
- Vitest + happy-dom test setup in `packages/ljsf`
- ESLint (flat config), Prettier, Stylelint and a pre-commit hook from the first commit
- Size budget for the framework core in `.size-limit.json`

## 🧰 Tech Stack

- Node.js 24
- pnpm workspaces
- JavaScript (ES modules)
- Vite
- Vitest + happy-dom
- ESLint, Prettier, Stylelint
- Husky + lint-staged
- size-limit

## 📁 Project Structure

```text
packages/
  ljsf/            framework
    src/           source, index.js is the public API
    test/          Vitest tests
apps/
  shelf/           reading tracker on ljsf
    src/           app entry and styles
examples/          small standalone apps on ljsf
docs/              public docs of the framework
ai/                agent docs: workflow, map, rules, skills, decisions, prompts
```

Agent instructions start at [AGENTS.md](AGENTS.md), the repo map at [ai/map.md](ai/map.md), the
reasons behind key choices at [ai/decisions/](ai/decisions/README.md).

## 🚀 Scripts

### Install

Installs every workspace package with one command.

```bash
pnpm install
```

### Dev

Starts Shelf on `http://localhost:5173`.

```bash
pnpm dev
```

### Build

Builds every package in dependency order: `ljsf` first, then Shelf.

```bash
pnpm build
```

### Test

```bash
pnpm test
```

### Lint

```bash
pnpm lint
pnpm lint:css
```

### Format

```bash
pnpm format
pnpm format:check
```

### Size

Builds `ljsf` and checks the gzipped core against the budget in `.size-limit.json`.

```bash
pnpm size
```

## 🔄 CI

The pre-commit hook runs ESLint, Stylelint and Prettier on staged files via Husky + lint-staged.
