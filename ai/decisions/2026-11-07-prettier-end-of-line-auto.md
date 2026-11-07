# Prettier `endOfLine: auto`

Date: 2026-11-07 · Status: accepted

## Context

On Windows git checks files out as CRLF (`core.autocrlf`), while Linux CI and hosting see LF.
`endOfLine: "lf"` makes `pnpm format:check` fail on every file of a Windows checkout.

## Decision

- `.prettierrc` sets `endOfLine: "auto"`: Prettier keeps the endings a file already has, so the check
  passes on a CRLF checkout and on an LF one.
- No `.gitattributes`; git's own `core.autocrlf` stays each machine's setting.

## Consequences

- Prettier does not normalise endings, so a mixed-ending file passes the check. The repository holds LF
  (git converts on commit), so nothing mixed reaches `main`.
- Rejected: `.gitattributes` with `* text=auto eol=lf` and `endOfLine: "lf"` (one more file to keep, and
  it rewrites every working copy's endings to fix a check that `auto` already makes pass).
