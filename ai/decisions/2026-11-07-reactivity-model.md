# Reactivity model

Date: 2026-11-07 · Status: accepted

## Context

Data changes must update only the places that depend on them, without re-rendering a component or
calling `addObserver` / `removeObserver` by hand. Every other module (templates, components, store,
query) builds on this one.

## Decision

- Fine-grained dependency tracking: an effect subscribes to the exact keys it read; the graph is
  two-way, so a rerun drops the subscriptions of the previous run.
- `reactive(obj)` is a Proxy over per-key dependencies. Nested objects and arrays are wrapped lazily on
  first read and cached in a `WeakMap`.
- Updates are batched: effects are queued and run once per microtask; `batch()` flushes at its end.
- Effects form an owner tree and are disposed with their owner. An effect that reruns more than 100
  times in one flush is a cycle and throws.
- Public API of `ljsf`: `reactive`, `effect`, `batch`. `signal`, `computed` and owners are internal,
  for framework modules only; components see `this.reactive()` and getters.
- `Map` and `Set` are not supported: `reactive()` throws for them and a nested one is left unwrapped.

## Consequences

- A write to `state.page` reruns only the effects that read `page`; several writes give one run.
- Rejected: eager deep wrapping (pays for objects never read, misses values added to the raw object
  later); getters and setters per property (cannot see added keys, deleted keys or array indexes);
  exposing `signal` and `computed` (a second state model for apps to learn); a synchronous rerun on
  every write (repeated work and half-written state visible to effects).
