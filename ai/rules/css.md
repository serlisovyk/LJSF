# CSS Rules

Plain CSS, checked by Stylelint (`stylelint-config-standard`) and formatted by Prettier. No
preprocessor, no CSS-in-JS, no utility framework (decision `css-modules`).

## Where styles live

- A component's styles live in its own `*.module.css`; the template uses the plain class names and the
  framework swaps them for the module's hashed names once per component.
- Global styles live only in `apps/shelf/src/styles/`: tokens, themes, reset, base. Nothing else is
  global.
- The cascade is ordered with `@layer` (reset, base, components, utilities), declared once in the global
  entry; a component never relies on file order or on `!important`.
- Class names are kebab-case (`.book-card`, `.is-active` for a state). No ids and no element selectors
  inside a module except for its own markup.

## Tokens and themes

- Colours, spacing, radii, font sizes and durations come from custom properties in the tokens file;
  a module never holds a raw hex value or a one-off size when a token fits.
- Colour tokens are named by role (`--color-surface`, `--color-text-muted`), not by hue. A theme
  redefines the role tokens; components never check the theme.
- A new colour gets a value in every theme and a contrast check: 4.5:1 for text, 3:1 for controls and
  borders.

## Layout and states

- Mobile first: base rules are the narrowest layout, `@media (width >= ...)` adds width. Check 390 px.
- States use selectors and attributes (`:hover`, `:focus-visible`, `:disabled`, `[aria-expanded="true"]`).
- Never remove a focus indicator without a visible replacement.
- A transition names its property, never `all`; motion is turned off under
  `prefers-reduced-motion: reduce`.
- Text for assistive technology only uses a visually-hidden class, not `display: none`.
