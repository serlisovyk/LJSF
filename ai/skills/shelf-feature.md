---
name: shelf-feature
description: Use when adding or changing a user-facing feature in apps/shelf: which layer owns its data, logic, state, page, component and styles, and how they connect on ljsf.
---

# Shelf feature

## When to use

Adding or changing anything a Shelf user sees or anything that reads or changes books, shelves, notes,
reading sessions or settings.

## Steps

1. Read `ai/map.md` and the rules (`architecture`, `style`, `css`, `testing`); do not rediscover the code.
   Start test-first for `api/`, `services/` and `stores/` (`ai/rules/testing.md`).
2. Split the feature across the layers before writing code:
   - **API**: a network call is a function in the Open Library module through the ljsf query module
     (cache, cancellation, status); user data goes through `shelf-api`, which hides `localStorage`.
   - **Service**: product logic (a streak, a statistic, a goal) as pure functions with no DOM and no
     network.
   - **Store**: shared state in a store built on the ljsf store; `persist` only for what must survive a
     reload.
   - **Page**: one component per route in `pages/`, wiring stores and services to components, with its
     loading, empty and error states.
   - **Component**: a folder `components/<group>/<name>/` with the class, `<name>.template.html` and
     `<name>.module.css`; state in `this.reactive()`, derived values as getters, nested components in
     `static components`.
   - **Styles**: CSS Modules with the tokens, mobile first (`ai/rules/css.md`).
3. If the feature needs something the framework lacks, stop: it is a framework change
   (`framework-module` skill), usually its own issue.
4. Verify per `ai/rules/definition-of-done.md`: use the feature in `pnpm dev` at desktop width and at
   390 px, with keyboard and mouse, including a failed request and empty data.

## Recipes

**A screen**: a route in the route table, a page component, its states, a link in the navigation.

**A component**: the folder of three files, a test of what the user sees and can do, styles through
tokens.

**A persisted setting**: a field in the settings store with `persist`, a control on its page, a test that
the value survives a store re-creation.
