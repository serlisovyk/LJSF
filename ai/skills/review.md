---
name: review
description: Use to self-review a diff in the ljsf repo for regressions, leaks, size, scope creep, accessibility, test gaps and docs drift before reporting a change done.
---

# Review

## When to use

Self-review pass before handing over any non-trivial change, per `ai/workflow.md`.

## Checklist

Walk the diff against `ai/rules/definition-of-done.md` and the rules of the areas it touches
(`architecture`, `style`, `css`, `testing`, `scope`). Then check what the rules do not cover:

- **Boundary**: the framework imports nothing from an app; an app imports only from `'ljsf'`; nothing
  internal leaked into `src/index.js`.
- **Reactivity**: an update reruns only the effects that read the changed value; no stale subscription
  after a branch of the template disappears; no write loop.
- **Cleanup**: every effect, listener, timer and child component created in the diff is released on
  `destroy`; a test proves it.
- **Templates**: directive values are paths; no string reaches `innerHTML` except through `:html` on
  purpose; list keys are stable ids.
- **Size**: `pnpm size` before and after; the growth is worth the feature.
- **Shelf states**: loading, empty and error states of what changed; a failed or cancelled request
  leaves the screen usable.
- **Accessibility in the browser**: every flow by keyboard alone; visible focus; names and states are
  announced; contrast in every theme; 390 px without horizontal scroll.
- **Tests**: new behavior has a test that fails without the change; no test was skipped or deleted to get
  green.
- **Style**: the whole diff read line by line against `ai/rules/style.md` and `ai/rules/css.md`: blank
  lines, names, import order, one component per file, tokens, no comments.
- **Scope**: nothing from `ai/rules/scope.md` slipped in; no unrelated rewrites; removed behavior left no
  unused code, classes or constants.
- **Docs drift**: the docs and `docs/` still match the code, none went over its limit
  (`ai/rules/docs.md`), and a decision record exists if a durable decision was made.

## Verification gaps to catch

- Tests green, but the feature was never used in the browser.
- Checked on desktop only, never at 390 px or by keyboard.
- Checked in one theme only.
- Checked in the happy path only: not with a failed request, empty data or a fast double action.
- Checked mount only, not unmount and remount.

## Report

State what was checked and what was found: fix it or say plainly why a finding is being left alone, per
`ai/workflow.md`'s report step.
