# Testing Rules

The project keeps an automated suite: Vitest in happy-dom. `pnpm test` runs it once in every package
that has tests; `pnpm --filter <package> test:watch` watches. Work is test-driven.

## TDD

- **Red, green, refactor.** A failing test first, then the smallest code that passes it, then the
  refactor with the test green. A test that was never seen failing proves nothing.
- The failing test is committed on its own as `test:`, before the code that fixes it, so the history shows
  the test failing for the right reason; the code follows in a `feat:` or `fix:` commit.
- A bug starts with a test that reproduces it; the fix is done when that test passes.
- A change of behavior updates the test that described it first, then the code.

## What to test

- **Reactivity**: which effects rerun after a write and which do not, batching into one run, lazy
  computed values, disposal of an owner, arrays (`push`, `splice`, index writes), cycle protection.
- **Templates and directives**: each directive's DOM result and its update after a state change; that only
  the dependent nodes change; invalid paths and missing values.
- **Components**: mount and unmount, lifecycle hooks, nested components, events with modifiers, cleanup:
  no effect or listener survives `destroyed()`.
- **Router, store, query**: navigation and params; persisted state and its restore; cache hits,
  cancellation and status transitions.
- **Shelf**: `services/` (pure logic with edge dates and empty data), `stores/` and `api/` over a mocked
  `fetch` or storage; components by what the user sees and can do.

## What not to test by default

- Plain constants and configuration without behavior.
- Styling classes and the browser's own behavior.
- Vite's CSS Modules hashing itself: test only how the framework applies the mapping.

## Structure

- Framework tests live in `packages/ljsf/test/`, one file per module or topic, `<name>.test.js`.
- Shelf tests sit next to the module they cover, `<name>.test.js`.
- A test imports what it uses from `'vitest'` (`describe`, `test`, `expect`, `vi`, ...): there are no
  globals.
- A `describe` label names the unit (`reactive`, `BookCard`); a `test` label says the behavior
  (`reruns an effect only for the changed key`).
- A test builds its DOM through the public API (mount a component into a container), not by reaching
  into private fields.

## Mocking

- Mock what is outside the unit: `fetch`, `localStorage`, timers (`vi.useFakeTimers`), the clock for
  streaks and stats. A test never calls the real Open Library API.
- Microtask batching is awaited explicitly (`await Promise.resolve()` or a small helper), never with a
  fixed timeout.
- Keep a mock small and explicit.
- A test is changed only when the behavior it describes changed on purpose; none is deleted or skipped to
  make a change pass.
