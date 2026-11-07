# Reactivity: plan

Issue MY-344, branch `my-344-reactivity`, spec `ai/superpowers/specs/2026-11-07-my-344-reactivity.md`.
Decision records touched: none reversed; a new one, `reactivity-model`, is added.

## Author's answers (2026-11-07)

- Public API of `ljsf`: `reactive`, `effect`, `batch`. `signal`, `computed` and the owner tree stay
  internal, for framework modules only.
- Proxy depth: lazy. A nested object or array is wrapped on its first read; wrappers are cached in a
  `WeakMap`.

## Design

`packages/ljsf/src/reactivity/`, one file per concept, `#private` fields, no comments:

- `owner.js`: `Owner` (`adopt`, `release`, `clear`, `dispose`, `scope(fn)`); the current owner.
- `observer.js`: the dependency graph. `Dependency` (a set of subscribers: `track`, `trigger`),
  `Observer extends Owner` (two-way links: its `dependencies` and their subscribers; `observe(fn)`
  unsubscribes from the old ones, then runs `fn` with itself as the active observer), `untracked(fn)`.
- `scheduler.js`: queue of effects, microtask flush, `batch`, run limit per flush.
- `signal.js`: `Signal` (value + `Dependency`) and `signal()`.
- `computed.js`: `Computed extends Observer`, lazy with a dirty flag, notifies its own subscribers.
- `effect.js`: `Effect extends Observer`; each run clears the children of the previous run.
- `reactive.js`: Proxy handlers over a per-target `Map<key, Dependency>`; arrays: the mutators run
  untracked, index writes that change `length` and `length = n` trigger what they affect.
- `index.js`: the internal surface. `src/index.js` re-exports only `reactive`, `effect`, `batch`.

Costs: the whole module is expected at about 1.2 to 1.6 kB gzip of the 5 kB core budget; `pnpm size`
before and after goes into the report.

## Test-first sequence

Each step: failing test committed alone (`test:`) and seen failing, then the code (`feat:`), then a
`refactor:` if the code asks for one. Tests live in `packages/ljsf/test/`.

1. Graph: `signal` + `effect` rerun only for what they read, drop stale dependencies, disposer.
   (First code: synchronous rerun, the simplest thing that passes.)
2. Batching: one run for several writes, microtask flush, `batch()`, nested batch.
3. `computed`: lazy, cached, dirty on change, chains, effects reading computed values.
4. Owners: dispose with owner, nested effects, rerun clears children, idempotent dispose, disposed
   effect in the queue.
5. `reactive` objects: per-key effects, add/delete/`in`/`Object.keys`, lazy deep wrapping, cached
   wrappers, `Map`/`Set` behavior.
6. Cycles and errors (before arrays, so a self-triggering mutator test cannot hang the run): an effect
   writing its own dependency throws, the scheduler recovers, other effects run after one throws.
7. `reactive` arrays: `push`, `splice`, `pop`, `shift`, `unshift`, index write, `length`, iteration, a
   mutator inside an effect.
8. Public entry: `ljsf` exports `reactive`, `effect`, `batch` and no internals.

## Docs, same change

- `docs/reactivity.md`: public API, examples, `Map`/`Set` not supported, cycle limit; index line in
  `docs/README.md`.
- `ai/map.md`: the `reactivity` folder; `README.md`: one feature line.
- `ai/decisions/2026-11-07-reactivity-model.md` (the issue says `docs/decisions/`; decision records live
  in `ai/decisions/` in this repo) and its line in the index.

## Verification

`pnpm format:check`, `pnpm lint`, `pnpm lint:css`, `pnpm test`, `pnpm build`, `pnpm size`. No UI, so no
browser check. Then the Definition of Done walk and the self-review against `ai/rules/`.

## Out of scope

Templates, components, store, `Map`/`Set` reactivity, devtools, equality cutoff for computed values.
