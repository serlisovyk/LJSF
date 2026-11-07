# Task Workflow

End-to-end sequence for taking a Linear task in this repo. `AGENTS.md` states the non-negotiable
rules; this file is the full flow.

## 1. Pick up the task

- Read the Linear issue (`MY-<n>`) in full, including its checklists, its «Порядок» section, its
  «Решения автора» section and its "blocked by" relations. Do not start a task whose blockers are not
  `Done`.
- Check `ai/decisions/` for anything the task would contradict. If it reverses a decision, say so
  before starting.
- If the scope is ambiguous or conflicts with a rule or decision record, ask **before** writing
  anything, and put every question in a plain chat message too, not only in a question tool: a restart
  of the session loses what only the tool showed.

## 2. Branch

- Branch off the latest `main`, named `my-<n>-<slug>` (e.g. `my-344-reactivity`): lowercase issue id,
  short English slug.
- Do not use Linear's `gitBranchName` as-is: it prepends a username and its slug is a transliteration
  of the Russian title.
- Never commit task work directly on `main`.
- Several tasks at once: one `git worktree` per branch, see "Parallel work" below.

## 3. Move the task to In Progress

Set the Linear issue state to `In Progress` when work actually starts, not when it is merely planned.

## 4. Orient

Read in this order, stopping once you have what the task needs:

1. `ai/map.md`: where things live and what the project deliberately lacks.
2. The `ai/rules/*` of the area you touch, and the decision records of what you touch (index in
   `ai/decisions/README.md`).
3. The matching skill in `ai/skills/`: `framework-module` for anything in `packages/ljsf`,
   `shelf-feature` for anything in `apps/shelf`.

Do not explore the code from scratch when the map answers the question. `ai/superpowers/` is the
archive of past tasks: read only the plan or spec of the feature you change.

## 5. Spec + plan, one commit, before code

- **Plan**: for anything touching more than one or two files, or with more than one reasonable
  approach. Say what will change, what it costs in the size budget and how it will be verified; cite
  decision records, do not retell them (`ai/rules/docs.md`).
- **Spec**: when the task changes observable behavior: a public API of the framework (what a component,
  a directive or a module does), or what a Shelf screen shows and how it reacts to keyboard, errors and
  empty data.
- Write them under `ai/superpowers/plans/` and `ai/superpowers/specs/` as `<YYYY-MM-DD>-<slug>.md`,
  reusing the branch slug so spec, plan, branch and issue pair up.
- Commit spec + plan together as a **single commit**, before any implementation commit.
- If the issue says something is to be "decided in the plan" (`решить в плане`), stop after the plan
  commit and hand the plan to the author. Continue only after approval, updating the plan with the
  author's answers.
- A trivial, single-file, single-approach change does not need a plan file: use judgment, do not
  manufacture ceremony.

## 6. Implement

- Follow the plan; commit in logical units, not one giant snapshot. Inspect `git status` and
  `git diff` before each commit.
- **Test first (TDD, `ai/rules/testing.md`).** Write the failing test, run it and see it fail for the
  right reason, and commit it on its own as `test:`. Then the code that passes it (`feat:`, `fix:`), then
  the refactor with the tests green. A bug starts with a test that reproduces it.
- Never bypass a git hook with `--no-verify`; fix what it reports. The pre-commit hook runs ESLint,
  Stylelint and Prettier on the staged files.
- Conventional Commit messages in English (`feat:`, `fix:`, `refactor:`, `docs:`, `style:`, `test:`,
  `build:`, `ci:`, `chore:`): specific, never `update` or `changes`.
- Use the matching skill instead of improvising a pattern that already exists.
- If reality diverges from the plan, update the plan file in the same change.

## 7. Keep docs in the same change

Only what the change made wrong, within the limits of `ai/rules/docs.md`:

- `README.md`: when what a user sees, the scripts or the structure changed.
- `docs/`: when a public API of the framework was added or changed.
- `ai/map.md`: when a package, module, folder or script was added, removed, renamed or moved.
- `ai/rules/*` or `ai/skills/*`: when the change reshaped a pattern.
- `ai/decisions/`: a new dated record when the change meets the criteria in its `README.md`.
- A doc that crosses its size limit is trimmed in this same change.

## 8. Verify

- The checks in `AGENTS.md` (Verification): format check, lint, CSS lint, tests, build, size.
- A change to Shelf or an example is used in the browser (`pnpm dev`): desktop width and 390 px wide,
  keyboard and mouse, the loading, empty and error states of what you touched. A green build does not
  prove a UI change works.
- If the built-in browser refuses `localhost`, use headless Chrome over the DevTools protocol: the
  browser check is not skipped.
- Tests are part of the change: new behavior comes with a test written before the code, and a changed
  behavior updates the test that described it.

## 9. Definition of Done gate

Walk `ai/rules/definition-of-done.md` point by point. Fix what fails before moving on.

## 10. Self-review

Run the `review` skill over the diff, then read the whole `git diff main..HEAD` line by line against
`ai/rules/style.md` and `ai/rules/css.md`. A subagent does both before it reports; the orchestrator
reads the diff again before the author sees the branch. Fix what you find, or state plainly why a
finding is being left alone.

## 11. Author approval: required stop

Nothing is merged and nothing is marked done without the author's explicit approval. Hand over the
report (step 12) and stop: silence or a neutral reply is not a yes. «Продолжай» ("carry on") is a
neutral reply, not an approval; an approval names the branch, and a yes to one branch does not cover the
next. Requested changes go back through steps 6 to 10; fold a small fix into the commit that introduced
it (`--fixup` + autosquash) rather than always adding a new commit.

## 12. Report

In Russian (it is chat, not a file):

- **what was done**: plain language, point by point, readable without opening the diff or the plan;
- branch (and worktree path, if any) and the commit list;
- verification output, the size of the core, and what was checked by hand in the browser;
- self-review findings and what was done about each;
- anything deliberately left out of scope.

## 13. Merge: locally, no pull request

After approval:

```bash
git switch main
git pull --ff-only
git switch my-<n>-<slug>
git rebase main            # re-run the checks if the rebase brought in new commits
git switch main
git merge --ff-only my-<n>-<slug>
pnpm format:check && pnpm lint && pnpm lint:css && pnpm test && pnpm build && pnpm size
git push origin main
git branch -d my-<n>-<slug>
```

- After a rebase that brings in another branch's work, check the combined result in the browser too.
- History stays linear: rebase onto `main`, then fast-forward. Never force-push `main`.
- If the branch was pushed, delete it on the remote too (`git push origin --delete my-<n>-<slug>`).
- Remove the worktree if one was used (`git worktree remove <path>`).
- If CI runs on `main`, wait for the pushed run to go green, polling a few minutes apart; a red `main`
  is fixed right away with a follow-up commit.
- If `main` deploys to hosting, check the live site read-only after the push; agents never recreate or
  reconnect the hosting project.
- Move the Linear issue to `Done` once the checks on `main` are green, and comment with the merged commit
  SHAs, the author's decisions, what was checked and what was not.

## Parallel work

- One task per worktree: `git worktree add .claude/worktrees/my-<n>-<slug> -b my-<n>-<slug> main`, then
  `pnpm install` inside it. In Claude Code, enter it with `EnterWorktree` (`path`).
- Run at most three tasks at a time, and only when they touch different areas: different framework
  modules, Shelf layers or screens, tooling. Two tasks that change the same module, component or store
  never run together.
- The files both tasks will still touch (usually `src/index.js`, the docs and `ai/map.md`) are named up
  front, in the brief of each, so the branch merged second expects the conflict.
- A batch is run by the orchestrator (`ai/prompts/orchestrator.md`).
- Merge one branch at a time; the branch merged second rebases onto the updated `main` before its merge.
- Repo-wide changes (lint or format config, file moves or renames) run alone, never alongside other
  branches.
