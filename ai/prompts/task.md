# Task session prompt template

Fill in `{ISSUE}` and send it as the session's first message. The orchestrator
(`ai/prompts/orchestrator.md`) sends the same prompt to each subagent, with the worktree already chosen.

---

Pick up Linear issue MY-**{ISSUE}** in the ljsf repo.

First, set up the environment:

- Fetch the issue from Linear. Check its "blocked by" relations: if a blocker is not `Done`, stop and
  say so. Read its «Порядок» section and its «Решения автора» section if there is one: those answers are
  final.
- Work on branch `my-{ISSUE}-<slug>` off the latest `main`: lowercase issue id, your own short English
  slug (do not use Linear's `gitBranchName`: it prepends a username and transliterates the Russian
  title).
- If you were given a worktree, work only inside it. If other tasks may run in parallel, create one:
  `git worktree add .claude/worktrees/my-{ISSUE}-<slug> -b my-{ISSUE}-<slug> main`, enter it
  (`EnterWorktree` with that `path` in Claude Code), and run `pnpm install` there.

Then follow `ai/workflow.md` end to end for this issue, from `In Progress` to the author-approval gate.
In particular:

- Read `AGENTS.md`, orient via `ai/map.md`, the rules of the area you touch, the decision records of what
  you touch (index in `ai/decisions/README.md`) and the matching skill (`framework-module` or
  `shelf-feature`).
- Write spec (if behavior changes) + plan under `ai/superpowers/` and commit them together, one commit,
  before any code, with the author's answers in the plan. If something is still to be decided in the plan
  («решить в плане») and has no answer yet, stop after that commit and report the plan with the open
  questions: do not implement until the author approves.
- Implement test-first (`ai/rules/testing.md`): a failing test committed on its own as `test:`, then the
  code, then the refactor; a bug starts with a test that reproduces it.
- Implement in logical commits (Conventional Commits, English). Every commit message ends with a blank
  line and `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Update docs in the same change: only what the change made wrong, within the limits of
  `ai/rules/docs.md`.
- Verify: the checks under "Verification" in `AGENTS.md`; a change to Shelf or an example is used in
  `pnpm dev` at desktop width and at 390 px, with keyboard and mouse.
- Walk `ai/rules/definition-of-done.md` point by point, then self-review as `ai/workflow.md` step 10
  says: the `review` skill and the whole diff, line by line, against `ai/rules/`.

Constraints:

- Chat with the author in Russian. Spec, plan, code, and commits stay in English.
- Touch only what this issue needs.
- Keep the tests green and write the ones the change needs before its code; keep `pnpm size` green.
- Stop at the author-approval gate (workflow step 11): do not merge, do not push `main`, do not mark the
  issue `Done`.
- Never use `--no-verify`: the pre-commit hook runs ESLint, Stylelint and Prettier on the staged files;
  fix what it reports.
- If the scope is ambiguous or conflicts with a rule or decision record, stop and ask in a plain message,
  the way `ai/workflow.md` step 1 says: do not guess.

Report back at the end, in Russian, as in `ai/workflow.md` step 12:

- **what was done**: a short plain-language bullet list, readable without opening the diff;
- branch and worktree path;
- commit list, what each one does;
- check output, the size of the core, and what was checked by hand in the browser;
- self-review findings and what was done about each;
- anything deliberately left out of scope.
