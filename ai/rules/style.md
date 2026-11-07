# Style Rules

Prettier decides the formatting (`.prettierrc`); these are the rules it does not.

## General

- **No comments in code**: JavaScript, HTML templates, CSS and the root configs. Names and small
  functions say what the code does; a durable "why" goes to a rule or a decision record, public API
  usage to `docs/`.
- Early `return` instead of nested `if` / `else`; no nested ternaries.
- **A clean `return`:** a name, a literal, one call or a boolean of names. A `map`, a comparison or a
  ternary is computed into a `const` first.
- **Named conditions:** a long condition becomes named `const`s or early returns, one idea per line.
- Booleans start with `is`, `has`, `can` or `should` (`isOpen`, `hasError`).
- No magic numbers or strings: shared values are named constants.
- **Blank lines group steps** (read, compute, write). A guard is its own paragraph; a block of one or two
  lines has no blank line inside.
- Destructure in callbacks (`({ id, title }) =>`), not a repeated `book.id`.
- Parameter names say what they are (`bookId`, `isDisabled`), not a bare `x` or `data`.

## Classes and functions

- A component is a class that `extends Component`: state in `this.reactive({...})`, derived values as
  getters, handlers as methods, lifecycle in `mounted()` and `destroyed()`.
- Nested components are listed in `static components`; never rely on `constructor.name`.
- Private framework internals use `#private` fields, not an underscore convention.
- Module-level helpers are `function` declarations; a callback inside a method is an arrow function.

## Files, names and imports

- Files and folders are kebab-case. A component is a folder with its parts side by side:
  `book-card/book-card.js`, `book-card.template.html`, `book-card.module.css`.
- Names in code: classes PascalCase, functions and methods camelCase verbs, constants
  `UPPER_SNAKE_CASE`.
- Named exports only.
- **Import order:** packages (`ljsf` first), then project modules, then the template, then styles.
- One component per file.

## Templates

- A template is plain HTML; directives are attributes: `:text`, `:html`, `:attr`, `:class.x`,
  `:style.x`, `:show`, `:model`, `@event.mod`, `ref`, `:each` with `key`.
- A directive value is a property path, optionally negated (`!isOpen`); a computation is a getter on the
  component, never an expression in the template.
- Interface texts are English; one action has one name wherever it shows.
- Controls are real elements (`<button>`, `<a>`, `<input>`, `<form>`) with an accessible name.
