import { auth, currentUser } from '@clerk/nextjs/server'
import { createNeonClient } from '@/lib/neon'
import { redirect } from 'next/navigation'
import { checkProtocolEligibility } from './actions'
import { Window } from '@/components/Window'
import { DashboardClient } from '@/components/Dashboard'

export default async function DashboardPage() {
    const { userId } = await auth()

    if (!userId) {
        redirect('/login')
    }
    const user = await currentUser()
    const neonClient = await createNeonClient()

    const today = new Date().toISOString().split('T')[0]
    // Fetch all habits
    const { data: habits } = await neonClient
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    // Fetch ALL logs for the history visualization
    const { data: allLogs } = await neonClient
        .from('habit_logs')
        .select('habit_id, completed_at')
        .eq('user_id', userId)

    // Logs for today
    const todayLogs = allLogs?.filter(log => log.completed_at && log.completed_at.startsWith(today)) || []
    const completedHabitIds = todayLogs.map(log => log.habit_id)

    // Group logs by habit_id for the punchcards
    const logsByHabit = allLogs?.reduce((acc, log) => {
        if (!acc[log.habit_id]) acc[log.habit_id] = []
        acc[log.habit_id].push(log.completed_at)
        return acc
    }, {} as Record<string, string[]>) || {}

    // Check protocol eligibility for new ones
    const eligibility = await checkProtocolEligibility()

    return (
        <div className="h-full p-4 md:p-8 !pb-0 flex flex-col items-center justify-center">
            <Window
                title="HABIT.SYS"
                className="w-full max-w-2xl min-h-0"
                contentClassName="overflow-y-auto scrollbar-stable custom-scrollbar overflow-x-hidden"
            >
                <DashboardClient
                    user={{ email: user?.emailAddresses[0]?.emailAddress }}
                    habits={habits || []}
                    completedHabitIds={completedHabitIds}
                    eligibility={eligibility}
                    logsByHabit={logsByHabit}
                />
            </Window>
        </div>
    )
}
