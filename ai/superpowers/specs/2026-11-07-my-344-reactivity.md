# Reactivity: spec

Observable behavior of the `reactivity` module of `ljsf`. Issue: MY-344.

## Public API (from `'ljsf'`)

- `reactive(target)`: returns a deep reactive proxy of a plain object or an array.
- `effect(fn)`: runs `fn` now and again whenever a reactive value it read changes; returns a function
  that disposes the effect.
- `batch(fn)`: runs `fn` and returns its result; effects triggered inside run once, synchronously, when
  the outermost `batch` ends.

`signal`, `computed` and the owner tree are internal: exported from `src/reactivity/index.js` for the
framework modules, not from `src/index.js`.

## Behavior

- **Fine-grained.** An effect depends on exactly the keys it read. `state.page = 2` reruns the effects
  that read `page`, no others. Writing the same value (`Object.is`) triggers nothing.
- **Dynamic dependencies.** Dependencies are recollected on every run: a key no longer read by the last
  run no longer triggers the effect.
- **Batching.** A write queues the dependent effects; they run once each in a microtask. Several writes
  in a row give one run. `batch(fn)` runs the queued effects right after `fn` instead of in a microtask.
- **Lazy computed.** A computed value is calculated on first read, cached, marked dirty when a source
  changes and recalculated on the next read only.
- **Owners.** An effect created while an owner is current (another effect, or an owner run through
  `owner.scope(fn)`) belongs to it. Disposing the owner disposes its children, so they never run again.
  A rerun of an effect first disposes the effects created by its previous run. An effect created with
  no owner lives until its disposer is called.
- **Deep and lazy.** A nested plain object or array is wrapped on its first read; the wrapper is cached,
  so `state.user === state.user`. `reactive(proxy)` returns the proxy itself.
- **Objects.** Reads, `in`, `Object.keys` / `for...in`, writes, adding and `delete` of keys are tracked.
- **Arrays.** Index reads and writes, `length`, iteration (`for...of`, `map`, `forEach`) and the
  mutators `push`, `pop`, `shift`, `unshift`, `splice`, plus `length = n`, trigger the effects that read
  what changed. A mutator called inside an effect does not subscribe that effect to the array.
- **Unsupported values.** `reactive()` of anything but a plain object or an array throws `TypeError`
  (`Map`, `Set`, class instances, primitives). Such a value nested in a reactive tree is returned as is,
  not wrapped.
- **Cycles.** If one flush runs the same effect more than 100 times (it keeps rewriting what it reads),
  the queue is dropped and the flush throws `Error: Reactive cycle ...`. The scheduler keeps working
  afterwards.
- **Errors.** An effect that throws does not stop the other queued effects: they still run, and the
  first error is rethrown.

## Edge cases

- An effect disposed while queued does not run.
- A nested `batch` flushes only when the outermost one ends.
- Effects created inside a batch still run their first pass immediately.
