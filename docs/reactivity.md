# Reactivity

Change data, and only the code that read it runs again. No observers to add or remove, no component
re-render. Three functions are public: `reactive`, `effect` and `batch`.

```js
import { batch, effect, reactive } from 'ljsf'
```

## `reactive(target)`

Returns a reactive proxy of a plain object or an array. Nested objects and arrays are reactive too: they
are wrapped when first read, and the same wrapper is returned every time.

```js
const state = reactive({ page: 1, query: '', books: [] })

state.page = 2
state.books.push({ title: 'Dune' })
state.books[0].title = 'Dune Messiah'
```

- Reads, writes, `in`, `Object.keys` and `delete` are tracked on objects.
- On arrays, index reads and writes, `length`, iteration (`for...of`, `map`, `forEach`) and the mutators
  `push`, `pop`, `shift`, `unshift` and `splice` are tracked.
- Writing the value a key already holds does nothing.
- `reactive(proxy)` returns the proxy itself.

**Not supported:** `Map`, `Set`, class instances and primitives. `reactive()` throws a `TypeError` for
them, and one nested in a reactive object is returned as is, without tracking. Keep the data in plain
objects and arrays.

## `effect(fn)`

Runs `fn` immediately, remembers which reactive values it read, and runs it again when any of them
changes. It returns a function that stops the effect.

```js
const state = reactive({ page: 1, query: '' })

const stop = effect(() => {
  console.log('page', state.page)
})

state.page = 2
state.query = 'dune'

stop()
```

Here `state.page = 2` runs the effect again and `state.query = 'dune'` does not: it never read `query`.

- Dependencies are collected on every run, so a key the last run did not read no longer triggers it.
- An effect created inside another effect is stopped when the outer one runs again or stops.
- An effect created outside another effect runs until its stop function is called.
- Mutating an array inside an effect (`log.push(x)`) does not make the effect depend on that array.

## Batching

Writes do not run effects at once. The affected effects are queued and run once, in a microtask, after
the code that wrote has finished.

```js
state.page = 2
state.page = 3
state.page = 4
```

The effect above runs once and sees `4`. To run it at a known moment instead, group the writes with
`batch`: the queued effects run synchronously when the outermost `batch` ends, and `batch` returns what
its callback returned.

```js
batch(() => {
  state.page = 5
  state.query = 'arrakis'
})
```

## Cycles and errors

An effect that keeps rewriting what it reads would run forever. If one flush runs the same effect more
than 100 times, the queue is dropped and `Error: Reactive cycle` is thrown. An effect that settles, such as
one that clamps a value, is fine.

An effect that throws does not stop the other queued effects. They still run, and the first error is
thrown after them.

Inside `batch`, these errors are thrown from `batch`, so the writer can catch them. When effects run in
the microtask flush (a write without `batch`), the writer's code has already finished: the error cannot
be caught there and surfaces as an uncaught exception (the console, `window.onerror`).
