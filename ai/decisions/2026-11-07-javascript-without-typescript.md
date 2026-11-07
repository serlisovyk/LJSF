# JavaScript ESM, no TypeScript

Date: 2026-11-07 · Status: accepted

## Context

ljsf is a sugar layer over HTML and JS, meant to be read as plain JavaScript. TypeScript is the common
alternative and adds a compiler configuration, declarations and a layer of syntax to a small codebase.

## Decision

- JavaScript ESM in `.js` files in every package.
- No TypeScript, no `tsconfig.json`, no `.d.ts` files and no JSDoc types as a substitute (code has no
  comments).

## Consequences

- Contracts are kept by the public entry (`src/index.js`), by tests and by the rules.
- A request that implies TypeScript reverses this record and needs the author's explicit ask and a new
  dated record.
