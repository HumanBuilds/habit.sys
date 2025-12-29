import { describe, it, expect } from 'vitest';
import { sortHabits, Habit } from './utils';

describe('sortHabits', () => {
    const mockHabits: Habit[] = [
        { id: '1', title: 'Wake up', frequency: ['Mon'] },
        { id: '2', title: 'Run', frequency: ['Mon'] },
        { id: '3', title: 'Sleep', frequency: ['Mon'] },
    ];

    it('should push completed habits to the bottom', () => {
        const completedIds = new Set(['1']); // 'Wake up' is done

        const sorted = sortHabits(mockHabits, completedIds);

        // Expected: Uncompleted first (2 or 3), Completed last (1)
        expect(sorted[2].id).toBe('1');
        expect(sorted.length).toBe(3);

        // First two should be 2 and 3 (stable sort preserves order if engine supports it, 
        // logic says aDone === bDone returns 0)
        expect([sorted[0].id, sorted[1].id]).toContain('2');
        expect([sorted[0].id, sorted[1].id]).toContain('3');
    });

    it('should keep order if completion status is same', () => {
        const completedIds = new Set<string>(); // None done

        const sorted = sortHabits(mockHabits, completedIds);

        // Should match original order logic (return 0)
        // Note: Array.prototype.sort is stable in modern JS/Node
        expect(sorted[0].id).toBe('1');
        expect(sorted[1].id).toBe('2');
        expect(sorted[2].id).toBe('3');
    });

    it('should handle all completed', () => {
        const completedIds = new Set(['1', '2', '3']);
        const sorted = sortHabits(mockHabits, completedIds);

        expect(sorted[0].id).toBe('1');
        expect(sorted[1].id).toBe('2');
        expect(sorted[2].id).toBe('3');
    });
});
