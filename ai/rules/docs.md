# Docs Rules

Every task starts by reading the docs, so they stay short. The code is the source of **how**; agent docs
answer **where** (`ai/map.md`), **what must hold** (`ai/rules/`) and **why** (`ai/decisions/`). `docs/`
is the framework's public documentation: how to use ljsf, for a reader of the repo.

- **One fact, one home.** Grep before adding a fact; link instead of copying. A doc does not retell the
  code or another doc.
- **No history in current docs.** No task numbers, "since MY-...", measurements or check logs: they
  belong to commits and Linear. A rule says what holds now; a decision says why.
- **No other projects.** A doc never cites or compares with another of the author's projects; a rule or
  a decision stands on its own reasons.
- **Name modules, components and functions, not file paths,** where that is enough: paths change, names
  last.
- **Limits.** `ai/map.md`: at most 150 lines and 12 KB, a list item at most about 150 characters, a
  table cell at most 80. A rules file: about 150 lines. A decision record: about 30 lines. README:
  Features at most 10 one-line items. A `docs/` page: one module or topic.
- **A task adds a line or two per doc, and cuts when a limit is crossed**: in the same change, from the
  doc that went over.
- **Update only what the change made wrong:** a package, module, folder or script added, renamed or
  removed → the map; a pattern reshaped → the rule; a durable decision → a record (criteria in
  `ai/decisions/README.md`); a public API added or changed → its `docs/` page; what a user sees, the
  scripts or the structure → a short line in `README.md`.
- **Language.** Everything in `ai/`, `docs/`, `AGENTS.md` and `CLAUDE.md` is English; Linear issues are
  Russian.
