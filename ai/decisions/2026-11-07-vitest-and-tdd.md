# Vitest, happy-dom and TDD

Date: 2026-11-07 · Status: accepted

## Context

A framework is trusted only as far as its tests go: a reactivity or cleanup bug shows up far from its
cause. Tests written after the code tend to describe what the code does, not what it should do.

## Decision

- Vitest with happy-dom for every package; tests import from `'vitest'`, no globals.
- Work is test-driven: a failing test first, committed on its own as `test:`, then the code that passes
  it (`feat:` / `fix:`), then the refactor with the tests green.
- A bug fix starts with a test that reproduces the bug.
- Rules of what and how to test: `ai/rules/testing.md`.

## Consequences

- The history of every feature shows its test failing before the code.
- A change without a test that fails without it is not done (`ai/rules/definition-of-done.md`).
- Rejected: jsdom (heavier and slower for a DOM-light framework suite); end-to-end tests (the browser
  check of Shelf is manual, and the framework is covered at the unit level).
