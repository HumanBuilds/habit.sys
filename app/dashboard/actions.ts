'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleHabitCompletion(habitId: string, isCompleted: boolean) {
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
    } catch (error: any) {
        console.error('Error toggling habit:', error)
        return { error: error.message }
    }
}
