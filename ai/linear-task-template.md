# Linear task template (ljsf)

Every Linear issue for this repo follows the structure below. **The issue itself is written in Russian**:
the title, the section headings exactly as shown, the body, and the checklist lines. This file explains
each section in English. The `linear-tasks` skill uses it as the source of structure when creating
issues.

Drop empty or irrelevant sections: no placeholders. Sections marked _(optional)_ are added only when
there is something to say.

Issue metadata: project **ljsf**, team `MY`, a type label (`Feature` / `Improvement` / `Bug` / `UI` /
`Infra` / `AI`), the milestone matching the area of work (1. Фундамент, 2. Ядро ljsf, 3. Роутер, store,
query, 4. Shelf, 5. Документация и полировка), state `Todo`. Use a "blocked by" relation only for a real
technical dependency; otherwise "related".

The title stays short; specifics go into the body. A framework issue names the module; a Shelf issue
names the screen or layer.

---

## Порядок _(optional)_

Which issues (`MY-<n>`) this one comes after and why, and which issues build on it.

## Зачем

The problem or gap today and what should change. One or two paragraphs, grounded in the code (module,
component, page, current behavior): for the framework, what an app cannot do yet; for Shelf, what a user
sees.

## Что сделать

A numbered list of concrete steps:

- which framework modules or Shelf layers, components and pages are touched, and what goes into the
  public API (`src/index.js`);
- states and edge cases: disposal and leaks, empty and error states, a failed request, keyboard and
  touch, 390 px width, every theme;
- anything to be decided in the plan: phrase it as «решить в плане»; the assignee then stops after the
  plan and waits for the author's approval.

## Решения автора (<date>) _(optional)_

The author's answers given before the work starts: final for the assignee.

## Готово когда

Observable criteria that can be checked: not "done", but "when X, the framework or the app does Y".

## Риски и крайние случаи _(optional)_

What can break, the cost in the size budget, and which other issues it affects.

## Вне скоупа _(optional)_

What is deliberately excluded; adjacent work goes into separate issues, linked.

## Обязательно проверить и обновить

Keep the relevant lines, delete the rest. Copy them into the issue as-is:

- [ ] `ai/superpowers/` — план (+ спека, если меняется поведение) одним коммитом до кода
- [ ] Тест до кода: падающий тест отдельным коммитом `test:`, баг — сначала тест, который его воспроизводит
- [ ] `README.md` — фичи, скрипты, структура
- [ ] `docs/` — страница публичного API, если он добавлен или изменён
- [ ] `ai/map.md` — если добавлен, переименован или удалён пакет, модуль, папка или скрипт
- [ ] `ai/rules/*`, `ai/skills/*` — если изменился паттерн
- [ ] `ai/decisions/` — датированная запись, если зафиксировано долгоживущее решение
- [ ] Доки в пределах лимитов `ai/rules/docs.md`; если лимит превышен — сократить

## Проверка

Copy into the issue, one line per check under "Verification" in `AGENTS.md`, plus the manual line for
Shelf and examples:

- [ ] `pnpm format:check`
- [ ] `pnpm lint`
- [ ] `pnpm lint:css`
- [ ] `pnpm test`
- [ ] `pnpm build`
- [ ] `pnpm size`
- [ ] Прогнано руками в `pnpm dev`: десктоп и 390px, клавиатура и мышь
