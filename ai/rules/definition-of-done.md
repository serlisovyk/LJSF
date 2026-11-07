# Definition of Done

A change is done when all of the following hold. Use it as the gate before handing a change over for
approval.

## Code

- New code follows `ai/rules/architecture.md`, `ai/rules/style.md` and `ai/rules/css.md`: the package and
  layer that own it, imports from `'ljsf'` only, kebab-case files, named exports, one component per file.
- The framework knows nothing about Shelf; no string-to-code path appeared in the template module.
- Effects, listeners and nested components created by a component are disposed with it.
- No comments in code; styles only through tokens and CSS Modules.
- Stale code, classes and constants left behind by the change are removed.
- Nothing from `ai/rules/scope.md` slipped in.

## Size

- `pnpm size` is green. A change that grows the core by a visible share of the budget says by how much
  in its report.

## Tests

- The change was test-driven (`ai/rules/testing.md`): its failing test was committed first as its own
  `test:` commit, and a bug fix started with a test that reproduces the bug.
- New or changed framework behavior has a Vitest test that fails without the change.
- Shelf logic in `services/`, `stores/` and `api/` has tests; components are tested by what the user
  sees and can do.
- `pnpm test` is green, and no test was deleted or skipped to make it pass.

## Accessibility (Shelf and examples)

- Controls are real elements with an accessible name; one `h1` per page, no skipped heading levels.
- Everything works from the keyboard and the focus ring shows on `focus-visible` in every theme.
- Text contrast is at least 4.5:1, controls and borders at least 3:1, in every theme.
- The layout works from 320 px wide to desktop with no horizontal scroll and is checked at 390 px;
  motion respects `prefers-reduced-motion`.

## Docs (in the same change, within `ai/rules/docs.md`)

- `README.md`: a short line, only if what a user sees, the scripts or the structure changed.
- `ai/map.md`: only if a package, module, folder or script was added, renamed or removed.
- `docs/`: the page of a public API that was added or changed.
- `ai/rules/*`: only if the change reshaped a pattern.
- `ai/decisions/`: a new dated record if the change meets the criteria in its `README.md`.

## Verification

- Every check listed under "Verification" in `AGENTS.md` passes.
- A change to Shelf or an example was used in the browser at desktop width and at 390 px, with keyboard
  and mouse, not just built.
- Reported: what changed, which commands were run, whether they passed, and anything that could not be
  verified. Never claim a check passed unless the command was run and passed.
