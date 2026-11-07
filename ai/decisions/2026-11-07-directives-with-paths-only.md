# Directives read property paths only, no `eval`

Date: 2026-11-07 · Status: accepted

## Context

Template directives need values from the component. Evaluating an expression string (`eval`,
`new Function`, a `with` block) is the short path, and it breaks a strict Content Security Policy,
hides errors until runtime and puts logic into markup.

## Decision

- A directive value is a property path on the component (`book.title`, `items.length`), optionally
  negated with `!` (`!isOpen`).
- A computation is a getter on the component, referenced by name; an event directive names a method.
- No `eval`, no `new Function`, no expression interpreter in the template module.

## Consequences

- Templates work under a CSP without `unsafe-eval`.
- Logic stays in JavaScript, where it is tested; templates stay declarative.
- Rejected: a small expression parser (grows the core and turns templates into a second language).
