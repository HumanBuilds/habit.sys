---
description: Git Operations - Called during Phase 5 of `feature-dev.md` or when the user asks to "save" or "commit"
---

## Pre-Commit Check
1.  Run `git status` to see what has changed.
2.  Ensure no `.env` files or secrets are being committed.

## Commit Message Convention
Use **Conventional Commits** format: `<type>(<scope>): <subject>`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting (missing semi-colons, etc)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests
- `chore`: Build process or aux tool changes

**Examples:**
- `feat(auth): add login form validation`
- `fix(navbar): resolve overlapping items on mobile`

## Execution
1.  Generate the commit command: `git commit -m "feat(scope): message"`
2.  Execute the command.