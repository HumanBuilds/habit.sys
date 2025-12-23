export interface Habit {
    id: string;
    title: string;
    frequency?: string[];
}

/**
 * Sorts habits such that completed ones are at the bottom.
 * Returns a new array.
 */
export function sortHabits(habits: Habit[], completedHabitIds: Set<string>): Habit[] {
    return [...habits].sort((a, b) => {
        const aDone = completedHabitIds.has(a.id);
        const bDone = completedHabitIds.has(b.id);
        if (aDone === bDone) return 0;
        return aDone ? 1 : -1;
    });
}
