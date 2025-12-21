---
description: Context Management - Called at the start and end of `feature-dev.md`
---

## Reading Context (Start)
Before writing code, check:
1.  `@tech-stack.md`: To ensure you use existing libraries (e.g., "Do we use Moment.js or date-fns?").
2.  `@project-guidelines.md`: for high-level architectural goals.

## Writing Context (End)
After a feature is verified and committed, update the following if applicable:

1.  **Todo List:** Mark items as done in `@todo.md`.
2.  **Tech Stack:** If a new npm package was installed, add it to `@tech-stack.md` with a justification.
3.  **Project Log:** Add a brief one-line entry to `@changelog.md` summarizing the session.

## Rules
- Do not hallucinate files that don't exist.
- If you are unsure about an architectural decision, ask the user to update `@project-guidelines.md` manually.