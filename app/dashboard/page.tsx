import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signout } from '../login/actions'
import { checkProtocolEligibility } from './actions'
import { Window } from '@/components/Window'
import { HabitTaskList } from '@/components/HabitTaskList'
import { HabitPunchcard } from '@/components/HabitPunchcard'

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
        <div className="min-h-screen p-8  flex flex-col items-center">
            <Window title="HABIT.SYS" className="w-full max-w-2xl">
                <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tighter">HABIT.SYS</h1>
                        <p className="text-xl">OPERATOR: {user.email?.split('@')[0].toUpperCase()}</p>
                    </div>
                    <div className="flex gap-4">
                        <form action={signout}>
                            <button className="btn-retro-secondary">
                                [ EXIT ]
                            </button>
                        </form>
                    </div>
                </div>

                {habits && habits.length > 0 ? (
                    <>
                        <HabitTaskList
                            habits={habits}
                            completedHabitIds={completedHabitIds}
                            eligibility={eligibility}
                        />

                        <div className="mt-12 pt-8 border-t-4 border-black border-double">
                            <h2 className="text-xl font-bold tracking-widest mb-6 flex items-center gap-2">
                                <span className="bg-black text-white px-2">SYSTEM_DIAGNOSTICS:</span>
                                <span>STREAK_PUNCHCARDS.DB</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {habits.map((habit) => (
                                    <HabitPunchcard
                                        key={habit.id}
                                        title={habit.title}
                                        createdAt={habit.created_at}
                                        logs={logsByHabit[habit.id] || []}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-black">
                        <p className="text-2xl mb-8">NO PROTOCOLS INITIALIZED IN THIS NODE.</p>
                        <Link href="/create-habit" scroll={false} className="btn-retro">
                            + INITIALIZE FIRST MODULE
                        </Link>
                    </div>
                )}
            </Window>

            <footer className="mt-8 text-sm font-bold btn-retro">
                (C) 1984 HABIT.SYS // VERSION 1.1.0
            </footer>

        </div>
    )
}
