# Class components and HTML templates

Date: 2026-11-07 · Status: accepted

## Context

ljsf is a thin layer over HTML and JS in the spirit of Alpine.js and Stimulus, not a React clone.
Function components with JSX need a compiler and push markup into JavaScript.

## Decision

- A component is a class that `extends Component`: methods, getters as computed values, `mounted()` and
  `destroyed()` for the lifecycle.
- Markup lives in a separate `*.template.html` file, styles in `*.module.css`, next to the class.
- Nested components are registered explicitly in `static components`, not found by `constructor.name`
  (minification renames classes).

## Consequences

- No JSX, no template compiler: a template is parsed at runtime once per component class.
- Templates are valid HTML that editors and Prettier handle without plugins.
- Rejected: function components with hooks (a different mental model and a compiler), templates as
  template-literal strings (no HTML tooling, easy XSS through interpolation).
