---
description: Quality Assurance (QA) - Called during Phase 3 of feature-development workflow, or whenever the user asks to "check the code."
---

## Rule 1: The Verification Loop
You are strictly forbidden from saying "The code is fixed" without verifying it first.
1.  **Lint:** Run the project's lint command (e.g., `npm run lint` or `eslint .`).
2.  **Test:** Run relevant tests (e.g., `npm test` or `jest path/to/file`).

## Rule 2: Handling Failures
If the Lint or Test step fails:
1.  **Read:** Analyze the error message in the terminal output.
2.  **Think:** Determine if the error is a logic bug, a syntax error, or a false positive.
3.  **Fix:** Apply the fix.
4.  **Loop:** **GO TO RULE 1** (Re-run verification).
    * *Constraint:* Do not ask the user for help unless you fail the loop 3 times in a row.

## Rule 3: Writing Tests
If no tests exist for the new feature:
1.  Create a test file adjacent to the implementation (e.g., `Component.test.tsx`).
2.  Write a basic "happy path" test.
3.  Write one "edge case" test (e.g., null states, error states).