# Only the tooling files the project uses

Date: 2026-11-07 · Status: accepted

## Context

A new repo tends to collect generic files: `.editorconfig`, `.nvmrc`, `.gitattributes`, a `LICENSE`
file, tool settings inside `package.json`. Each is one more place to keep in sync.

## Decision

- Formatting is Prettier's job alone: no `.editorconfig`.
- The Node version is `engines` in `package.json`: no `.nvmrc`.
- The license is the `"license": "MIT"` field in `package.json`: no `LICENSE` file.
- Tool settings live in their own files (`.lintstagedrc.json`, `.prettierrc`, `.size-limit.json`), not
  in `package.json`.
- Editor and run settings (`.vscode/`, `.claude/launch.json`) are not committed.

## Consequences

- Adding one of these files needs the author's explicit ask.
- `package.json` keeps metadata, scripts and dependencies only.
