import { describe, it, expect } from 'vitest';
import { sortHabits, type Habit } from './utils';

describe('sortHabits', () => {
    const habits: Habit[] = [
        { id: '1', title: 'Habit 1' },
        { id: '2', title: 'Habit 2' },
        { id: '3', title: 'Habit 3' },
    ];

    it('should move completed habits to the bottom', () => {
        const completedHabitIds = new Set(['1']);
        const sorted = sortHabits(habits, completedHabitIds);

        expect(sorted[0].id).toBe('2');
        expect(sorted[1].id).toBe('3');
        expect(sorted[2].id).toBe('1');
    });

    it('should keep order if all or none are completed', () => {
        const noneCompleted = new Set<string>();
        const sortedNone = sortHabits(habits, noneCompleted);
        expect(sortedNone.map(h => h.id)).toEqual(['1', '2', '3']);

        const allCompleted = new Set(['1', '2', '3']);
        const sortedAll = sortHabits(habits, allCompleted);
        expect(sortedAll.map(h => h.id)).toEqual(['1', '2', '3']);
    });

    it('should handle multiple completed habits', () => {
        const completedHabitIds = new Set(['1', '2']);
        const sorted = sortHabits(habits, completedHabitIds);

        // '3' should be first as it's not completed
        expect(sorted[0].id).toBe('3');
        // '1' and '2' should be at the bottom (order preserved among completed)
        expect(sorted[1].id).toBe('1');
        expect(sorted[2].id).toBe('2');
    });
});
