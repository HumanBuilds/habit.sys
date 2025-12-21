---
description: UI & CSS Standards - Called when writing HTML, CSS, React Components, or Vue templates.
---

## Core Principles
1.  **Mobile First:** Write default styles for mobile. Use `@media (min-width: ...)` for larger screens.
2.  **Accessibility (a11y):** All interactive elements must have `aria-label` or semantic HTML (e.g., `<button>` not `<div onClick>`).

## Styling Rules
1.  **Methodology:** Follow the project's chosen styling method (e.g., Tailwind, CSS Modules, or Styled Components).
    * *If Tailwind:* Keep class strings sorted and readable.
    * *If CSS Modules:* Use `camelCase` for class names.
2.  **Variables:** Use CSS variables/tokens for colors and spacing. Do not hardcode hex values (e.g., use `var(--color-primary)` instead of `#0000FF`).

## File Structure
When creating a component named `Example`:
- `Example/index.ts` (Export)
- `Example/Example.tsx` (Logic & View)
- `Example/Example.module.css` (Styles - if using modules)
- `Example/Example.test.tsx` (Tests)