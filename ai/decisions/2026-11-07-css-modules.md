# Plain CSS with CSS Modules

Date: 2026-11-07 · Status: accepted

## Context

Components need styles that do not leak into each other, without a build step of the framework's own
or a runtime styling library.

## Decision

- Plain CSS: global tokens, themes and base styles in one styles folder, ordered with `@layer`.
- A component's styles are a `*.module.css` file; Vite turns its class names into hashed ones and the
  framework swaps the plain names in the template for them once per component class.
- Stylelint (`stylelint-config-standard`) checks every CSS file.

## Consequences

- Templates use readable class names; the mapping is not repeated in JavaScript.
- Rejected: CSS-in-JS (runtime cost and a dependency), a utility framework (long class strings in
  templates, a dependency), Shadow DOM (isolates global tokens and themes too, harder forms and focus).
