---
description: Analyze and Implement Tests - Analyze the JavaScript/TypeScript codebase for test coverage and implement appropriate unit and integration tests.
---



## Steps

1. **Detect test infrastructure**
   - Check for `vitest.config.*`, `jest.config.*`, or test dependencies in `package.json`
   - If none exists, ask user to choose between Vitest (recommended for Vite) or Jest (recommended for CRA)
   - Set up the chosen framework if needed

2. **Find untested code**
   - List source files: `find src -name "*.ts" -o -name "*.tsx" | grep -v ".test." | grep -v ".spec."`
   - List existing tests: `find src -name "*.test.*" -o -name "*.spec.*"`
   - Identify files without corresponding test files

3. **Prioritize what to test**
   - Utility functions (pure functions) - highest priority
   - Custom hooks
   - API/data layer functions
   - Business logic in components
   - Skip: pure UI components, config files, third-party wrappers

4. **Implement tests**
   - Match existing test patterns in the project
   - Use React Testing Library for components
   - Use `renderHook` for custom hooks
   - Mock external dependencies (API calls, services)
   - Follow Arrange → Act → Assert structure

5. **Run and verify**
   - Execute tests via CLI (`npm test` or `npx vitest run` or `npx jest`)
   - Fix any failing tests
   - Report coverage summary