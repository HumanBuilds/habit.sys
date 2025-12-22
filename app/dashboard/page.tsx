import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { checkProtocolEligibility } from './actions'
import { Window } from '@/components/Window'
import { DashboardClient } from '@/components/Dashboard'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const today = new Date().toISOString().split('T')[0]

    // Fetch all habits
    const { data: habits } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    // Fetch ALL logs for the history visualization
    const { data: allLogs } = await supabase
        .from('habit_logs')
        .select('habit_id, completed_at')
        .eq('user_id', user.id)

    // Logs for today Specifically
    const todayLogs = allLogs?.filter(log => log.completed_at === today) || []
    const completedHabitIds = new Set(todayLogs.map(log => log.habit_id))

    // Group logs by habit_id for the punchcards
    const logsByHabit = allLogs?.reduce((acc, log) => {
        if (!acc[log.habit_id]) acc[log.habit_id] = []
        acc[log.habit_id].push(log.completed_at)
        return acc
    }, {} as Record<string, string[]>) || {}

    // Check protocol eligibility for new ones
    const eligibility = await checkProtocolEligibility()

    return (
        <div className="h-screen p-4 md:p-8 flex flex-col items-center overflow-hidden">
            <Window
                title="HABIT.SYS"
                className="w-full max-w-2xl flex-1 min-h-0"
                contentClassName="overflow-y-auto flex-1 custom-scrollbar"
            >
                <DashboardClient
                    user={{ email: user.email }}
                    habits={habits || []}
                    completedHabitIds={completedHabitIds}
                    eligibility={eligibility}
                    logsByHabit={logsByHabit}
                />
            </Window>
        </div>
    )
}
