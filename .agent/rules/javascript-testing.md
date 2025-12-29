---
trigger: always_on
---

# JS/TS Testing Guidelines

## Test Infrastructure Detection
- Check for `vitest.config.ts/js` → use Vitest patterns
- Check for `jest.config.ts/js/json` → use Jest patterns
- Check `package.json` devDependencies for `vitest` or `jest`
- If no test infrastructure exists, recommend Vitest for Vite projects, Jest for CRA/existing setups

## Test File Conventions
- Co-locate tests: `Button.tsx` → `Button.test.tsx` (preferred)
- Or use `__tests__/` folder: `src/components/Button.tsx` → `__tests__/Button.test.tsx`
- Match existing project patterns when present

## Test Structure
```typescript
describe('ComponentOrFunction', () => {
  describe('specificBehavior', () => {
    it('should do expected thing when condition', () => {
      // Arrange → Act → Assert
    });
  });
});
```

## Priority Targets (test these first)
1. Utility functions - pure functions, easy to test
2. Custom hooks - important logic, moderate complexity
3. API/data layer functions - critical paths
4. Business logic extracted from components

## What to Skip
- Pure UI components with no logic
- Third-party library wrappers with no custom logic
- Configuration files

## Component Testing (React Testing Library)
- Use `screen.getByRole()`, `getByLabelText()`, `getByText()` for queries
- Use `userEvent.setup()` for user interactions, not `fireEvent`
- Use `findBy*` for async elements, `waitFor` for assertions
- Mock API calls with MSW (Mock Service Worker)

## Mocking Patterns
- Vitest: `vi.mock()`, `vi.fn()`, `vi.mocked()`
- Jest: `jest.mock()`, `jest.fn()`, `as jest.MockedFunction`
- Use `beforeEach` to clear mocks between tests
- Mock fetch with `vi.stubGlobal('fetch', vi.fn())` or `global.fetch = jest.fn()`

## Hook Testing
- Use `renderHook()` from `@testing-library/react`
- Wrap state updates in `act()`
- For hooks with context, provide a wrapper component

## CLI Verification
- Run tests: `npm test`, `npx vitest run`, `npx jest`
- Watch mode: `npx vitest`, `npx jest --watch`
- Coverage: `npx vitest run --coverage`, `npx jest --coverage`

## Setup (when no infrastructure exists)
### Vitest
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### Jest
```bash
npm install -D jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```