'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function queryProtocolStreak(habitId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return 0

    const { data: logs } = await supabase
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
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const today = new Date().toISOString().split('T')[0]

    try {
        if (isCompleted) {
            // If currently completed, we want to un-complete it (delete the log)
            const { error } = await supabase
                .from('habit_logs')
                .delete()
                .eq('habit_id', habitId)
                .eq('user_id', user.id)
                .eq('completed_at', today)

            if (error) throw error
        } else {
            // Not completed, so insert a log
            const { error } = await supabase
                .from('habit_logs')
                .insert({
                    habit_id: habitId,
                    user_id: user.id,
                    completed_at: today
                })

            if (error) throw error
        }

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error('Error toggling habit:', error)
        return { error: error instanceof Error ? error.message : 'An unknown error occurred' }
    }
}

export async function forceResetProtocol(habitId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    try {
        const { error } = await supabase
            .from('habit_logs')
            .delete()
            .eq('habit_id', habitId)
            .eq('user_id', user.id)

        if (error) throw error

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error('Error resetting streak:', error)
        return { error: error instanceof Error ? error.message : 'An unknown error occurred' }
    }
}
