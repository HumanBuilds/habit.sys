'use server'

import { auth } from '@clerk/nextjs/server'
import { createNeonClient } from '@/lib/neon'
import { revalidatePath } from 'next/cache'

export async function queryProtocolStreak(habitId: string) {
    const { userId } = await auth()

    if (!userId) return 0

    const neonClient = await createNeonClient()

    const { data: logs } = await neonClient
        .from('habit_logs')
        .select('completed_at')
        .eq('habit_id', habitId)
        .order('completed_at', { ascending: false })

    if (!logs || logs.length === 0) return 0

    let streak = 0
    let lastDate = new Date()
    lastDate.setHours(0, 0, 0, 0)

    // If the most recent log isn't today or yesterday, streak is broken
    const mostRecent = new Date(logs[0].completed_at)
    mostRecent.setHours(0, 0, 0, 0)

    const diff = (lastDate.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24)
    if (diff > 1) return 0

    for (let i = 0; i < logs.length; i++) {
        const logDate = new Date(logs[i].completed_at)
        logDate.setHours(0, 0, 0, 0)

        if (i === 0) {
            streak = 1
            lastDate = logDate
            continue
        }

        const dateDiff = (lastDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
        if (dateDiff === 1) {
            streak++
            lastDate = logDate
        } else if (dateDiff === 0) {
            // Duplicate log? Skip
            continue
        } else {
            break
        }
    }

    return streak
}

export async function commitHabitLog(habitId: string, isCompleted: boolean) {
    const { userId } = await auth()

    if (!userId) return { error: 'Unauthorized' }

    const neonClient = await createNeonClient()

    // Define "today" in UTC boundaries
    const now = new Date()
    const startOfTodayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
    const startOfTomorrowUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1))

    try {
        if (isCompleted) {
            // Uncheck: delete any log for today (range match)
            const { error } = await neonClient
                .from('habit_logs')
                .delete()
                .eq('habit_id', habitId)
                .eq('user_id', userId)
                .gte('completed_at', startOfTodayUtc.toISOString())
                .lt('completed_at', startOfTomorrowUtc.toISOString())

            if (error) throw error
        } else {
            // Check: insert with a timestamp
            const { error } = await neonClient
                .from('habit_logs')
                .insert({
                    habit_id: habitId,
                    user_id: userId,
                    completed_at: new Date().toISOString(),
                })

            if (error) {
                if (error.code === '23505') {
                    // Duplicate insert attempt ignored (Idempotent fix)
                } else {
                    throw error
                }
            }
        }

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error: any) {
        console.error('Error toggling habit:', error)
        return { error: error?.message || 'An unknown error occurred', details: error }
    }
}


export async function checkProtocolEligibility() {
    const { userId } = await auth()

    if (!userId) return { eligible: false, error: 'Unauthorized' }

    const neonClient = await createNeonClient()

    // 1. Get the latest habit
    const { data: habits, error: habitError } = await neonClient
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)

    if (habitError) throw habitError
    if (!habits || habits.length === 0) {
        // No habits yet, so they are eligible to create their first one
        return { eligible: true }
    }

    const latestHabit = habits[0]

    // 2. Count completions (fetch minimal data and count in JS)
    const { data: logs, error: countError } = await neonClient
        .from('habit_logs')
        .select('id')
        .eq('habit_id', latestHabit.id)

    if (countError) throw countError
    const completionCount = logs?.length || 0

    // 3. Calculate total days since creation
    const createdDate = new Date(latestHabit.created_at)
    const today = new Date()
    // Reset hours to compare dates only
    createdDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    const diffTime = Math.abs(today.getTime() - createdDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 because first day counts

    const dedicationRate = diffDays > 0 ? (completionCount / diffDays) * 100 : 0

    // Eligibility check: 10 completions AND 90% dedication
    const eligible = completionCount >= 10 && dedicationRate >= 90

    return {
        eligible,
        stats: {
            completions: completionCount,
            dedication: Math.round(dedicationRate),
            totalDays: diffDays,
            requiredCompletions: 10,
            requiredDedication: 90
        },
        latestHabitTitle: latestHabit.title
    }
}

export async function forceResetProtocol(habitId: string) {
    const { userId } = await auth()

    if (!userId) return { error: 'Unauthorized' }

    const neonClient = await createNeonClient()

    try {
        const { error } = await neonClient
            .from('habit_logs')
            .delete()
            .eq('habit_id', habitId)
            .eq('user_id', userId)

        if (error) throw error

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error('Error resetting streak:', error)
        return { error: error instanceof Error ? error.message : 'An unknown error occurred' }
    }
}
