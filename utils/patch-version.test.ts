// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getPatchVersion } from './patch-version';

const mocks = vi.hoisted(() => ({
    execSync: vi.fn(),
}));

vi.mock('child_process', () => ({
    execSync: mocks.execSync,
    default: { execSync: mocks.execSync },
}));

describe('getPatchVersion', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should calculate version from git commit count', () => {
        // Mock git returning "123" commits
        mocks.execSync.mockReturnValue('123');

        const version = getPatchVersion();

        // 123 / 100 = 1.23 -> floor + 1 = 2 (Major)
        // (123 % 100) = 23 -> 23 / 10 = 2.3 -> floor = 2 (Minor)
        // 123 % 10 = 3 (Patch)
        // Expected: 2.2.3
        expect(version).toBe('2.2.3');
    });

    it('should fallback to hardcoded value when git fails', () => {
        // Mock git throwing an error
        mocks.execSync.mockImplementation(() => {
            throw new Error('git not found');
        });

        const version = getPatchVersion();

        // Hardcoded value in source is 65
        // 65 / 100 = 0.65 -> floor + 1 = 1 (Major)
        // (65 % 100) = 65 -> 65 / 10 = 6.5 -> floor = 6 (Minor)
        // 65 % 10 = 5 (Patch)
        // Expected: 1.6.5
        expect(version).toBe('1.6.5');
    });
});
