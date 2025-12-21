---
description: Feature Development Cycle - When the user asks to implement a new feature, fix a bug, or refactor code.
---

## Phase 1: Context & Planning
1.  **Ingest Context:** Read `@context-manager.md` to understand the project structure and rules.
2.  **Analysis:** briefly analyze the request. If the request involves UI changes, read `@ui-standards.md`.
3.  **Plan:** Propose a step-by-step plan in bullet points.
    * Identify which files need creation or modification.
    * Identify necessary packages (check against `@tech-stack.md` to avoid duplicates).
4.  **Confirmation:** **STOP** and ask the user to confirm the plan before writing code.

## Phase 2: Implementation
1.  **Scaffold:** Create necessary files following the directory structure defined in `@context-manager.md`.
2.  **Code:** Implement the logic.
    * Write small, testable functions.
    * Add comments for complex logic only.

## Phase 3: Verification (Crucial)
1.  **Switch Workflow:** Execute the rules defined in `@qa-standards.md`.
    * *You must not proceed to Phase 4 until Phase 3 passes.*

## Phase 4: Documentation & Cleanup
1.  **Meta-Data:** Update project meta-files using `@context-manager.md` (e.g., check off todo items).
2.  **Refactor:** Look at the code you just wrote. Is it DRY? Is it readable? Optimize if necessary.

## Phase 5: Finalization
1.  **Commit:** Prepare the code for version control using `@git-ops.md`.