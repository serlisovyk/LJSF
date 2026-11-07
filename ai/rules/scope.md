# Scope Rules

ljsf is a small framework with one real app on it. Grow it by what Shelf needs, without turning it into
a general-purpose framework.

## Do Not Add Without Explicit Request

- TypeScript, JSX, a template compiler or a build step of the framework's own
- A virtual DOM, SSR or hydration, devtools
- Expression evaluation in templates (`eval`, `new Function`, a mini interpreter)
- A runtime dependency in `ljsf`
- A UI kit, a CSS preprocessor, CSS-in-JS or a utility CSS framework in Shelf
- A second package manager's lockfile, a task runner on top of pnpm (Nx, Turborepo, Lerna)
- Publishing `ljsf` to npm
- Backend code in this repo: it lives in Shelf-Backend

## Dependencies

- `ljsf`: none at runtime. Shelf: `ljsf` only.
- Tooling in scope: Vite, Vitest + happy-dom, ESLint, Prettier, Stylelint, Husky + lint-staged,
  size-limit.
- Another dependency needs the author's explicit yes and, if it is a lasting choice, a decision record.

## Tradeoffs

- A framework feature earns its place when Shelf or an example uses it.
- If a feature costs a visible share of the size budget, find a smaller design or leave it out.
- If an optimization makes the source harder to read, reconsider it.
