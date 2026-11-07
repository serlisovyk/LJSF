# Architecture Rules

`ai/map.md` says where every package and folder lives; this file says who may depend on whom.

## Framework ↔ app boundary

- Dependencies point one way: `apps/*` and `examples/*` → `ljsf`. The framework never imports from an
  app or an example and never knows a Shelf name, route or data shape.
- An app imports only from `'ljsf'`, the public entry. No deep imports (`ljsf/src/...`): what an app
  needs is exported from `src/index.js` or does not exist yet.
- A mechanism two apps would both need (a directive, a router feature, a store helper) belongs in the
  framework; a product rule (shelves, reading goals, streaks) belongs in Shelf.
- `ljsf` has no runtime dependencies. A new one needs the author's explicit yes and a decision record.

## Framework modules

| Module       | Owns                                                              | Must not                              |
| ------------ | ----------------------------------------------------------------- | ------------------------------------- |
| `reactivity` | signals, effects, computed values, batching, owners, `reactive()` | touch the DOM                         |
| `template`   | parsing a template, directives, CSS Module class mapping          | hold component state                  |
| `component`  | the `Component` class, lifecycle, nested components, `this.$()`   | fetch data or know about routes       |
| `router`     | History API routing, params, links                                | render anything but the matched page  |
| `store`      | shared reactive state, `persist` to storage                       | call the network                      |
| `query`      | requests: cache, cancellation, status                             | know an API's URLs or response shapes |

- Lower modules never import higher ones: `reactivity` ← `template` ← `component` ← `router`, `store`,
  `query`.
- Reactivity is internal: components see `this.reactive({...})` and getters, not signals.
- Directives read property paths only (`book.title`, `!isOpen`), never evaluated expressions (decision
  `directives-with-paths-only`).
- A DOM update touches only the nodes that depend on the changed value; no whole-component re-render.

## Shelf layers

Data flows one way: `api/` → `stores/` and `services/` → `pages/` → `components/`.

| Layer         | Owns                                                    | Must not                       |
| ------------- | ------------------------------------------------------- | ------------------------------ |
| `api/`        | every network and storage call: Open Library, user data | know about components          |
| `stores/`     | shared app state built on the ljsf store                | call `fetch` directly          |
| `services/`   | pure product logic: streaks, stats                      | touch the DOM or the network   |
| `pages/`      | one component per route, wiring stores to components    | hold logic a service could own |
| `components/` | markup, styles, local interactive state                 | import `api/`                  |
| `router/`     | the route table                                         | hold page logic                |

- User data goes through one `shelf-api` module, so `localStorage` can be swapped for Shelf-Backend
  without touching pages or components.
- No global mutable state outside `stores/`.
