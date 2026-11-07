# A monorepo, `ljsf` is not published to npm

Date: 2026-11-07 · Status: accepted

## Context

The framework exists to be used by Shelf and the examples, and to be read. Publishing would bring
versioning, a changelog, a public API promise and a build-only package.

## Decision

- The framework and its users live in one repo; `ljsf` is consumed only through the workspace.
- `packages/ljsf` stays `private`; its `exports` point at `src/index.js`, so apps run the source and
  Vite handles it like their own code.
- `vite build` in library mode produces `dist/ljsf.js` for the size budget, not for distribution.

## Consequences

- A breaking change to the framework API is fixed in Shelf and the examples in the same change.
- No semver, changelog or release process.
- Publishing to npm reverses this record and needs the author's explicit ask and a new record.
