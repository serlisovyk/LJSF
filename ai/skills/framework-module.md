---
name: framework-module
description: Use when adding or changing anything in packages/ljsf: which module owns it, how it reaches the public API, how it is tested, and what it costs in the size budget.
---

# Framework module

## When to use

Adding or changing a framework mechanism: reactivity, a directive, the component lifecycle, the router,
the store, the query module, or anything exported from `ljsf`.

## Steps

1. Read `ai/map.md`, the rules (`architecture`, `style`, `testing`, `scope`) and the decision records of
   the module; do not rediscover the code. Start test-first: the failing test is committed before its
   code (`ai/rules/testing.md`).
2. Place the feature:
   - **Module**: the lowest module that can own it (`ai/rules/architecture.md`); a lower module never
     imports a higher one. A new module is a folder `src/<module>/` with an `index.js`.
   - **Public API**: export only what an app needs from `src/index.js`; internals stay unexported.
     Reactivity stays behind `this.reactive()` and getters.
   - **Directive**: a handler that receives the element, the property path and the component; it
     subscribes through an effect owned by the component, so it is disposed with it. Paths only, no
     evaluation (decision `directives-with-paths-only`).
   - **Lifecycle**: anything a component creates (effects, listeners, child components, timers) is
     registered with its owner and released in `destroy`.
3. Measure: `pnpm size` before and after; a visible jump gets a smaller design or a line in the plan.
4. Use it: an example or a Shelf screen exercises the feature in the browser (`pnpm dev`).
5. Document: the module's page in `docs/` (what it does, its API, a short example); the map if a folder
   or export group appeared.

## Tests

- Through the public API: create state, mount a component into a container, change state, assert the
  DOM and the number of effect runs.
- Every cleanup path: after `destroy` or `dispose`, a state change runs nothing and touches no node.
- Edge cases of the module: empty arrays, `undefined` paths, repeated writes in one tick, nested owners.

## Recipes

**A directive**: a handler in the template module, registered in the directive table, a test per update
case, a line in the directives page of `docs/` and in `ai/rules/style.md` if templates gain syntax.

**A lifecycle hook**: a method name on `Component`, called by the mount or destroy path in a fixed order
relative to the children; tests for the order and for a throwing hook.

**A module**: a folder with `index.js`, its exports added to `src/index.js`, a test file, a `docs/` page,
a line in `ai/map.md`, and its row in the module table of `ai/rules/architecture.md` if it is new.
