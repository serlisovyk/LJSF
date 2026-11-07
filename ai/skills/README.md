# Skills

Repo-local skill playbooks. Plain Markdown: any AI agent reads them directly. Each file has `name` +
`description` frontmatter so it maps to a matching skill entry when a tool supports one. A skill is a
recipe; what must hold is in `ai/rules/`. The other docs are listed in `AGENTS.md`.

- [framework-module](framework-module.md): how a framework feature flows through its module, the public
  entry, tests, the size budget and `docs/`; recipes for a directive, a lifecycle hook and a module.
- [shelf-feature](shelf-feature.md): how a Shelf feature flows through api, store, service, page,
  component and test; recipes for a screen, a component and a persisted setting.
- [review](review.md): self-review of a diff: regressions, leaks, size, scope creep, accessibility, tests
  and docs drift.
