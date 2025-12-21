import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signout } from '../login/actions'
import { checkProtocolEligibility } from './actions'
import { Window } from '@/components/Window'
import { HabitTaskList } from '@/components/HabitTaskList'

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

    // Fetch logs for today for all habits
    const { data: logs } = await supabase
        .from('habit_logs')
        .select('habit_id')
        .eq('user_id', user.id)
        .eq('completed_at', today)

    const completedHabitIds = new Set(logs?.map(log => log.habit_id) || [])

    // Check protocol eligibility for new ones
    const eligibility = await checkProtocolEligibility()

    return (
        <div className="min-h-screen p-8 bg-white dither-50 flex flex-col items-center">
            <Window title="ATKINSON_PROTOCOL.OS" className="w-full max-w-2xl">
                <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tighter">ATKINSON PROTOCOL</h1>
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
                    <HabitTaskList
                        habits={habits}
                        completedHabitIds={completedHabitIds}
                        eligibility={eligibility}
                    />
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-black">
                        <p className="text-2xl mb-8">NO PROTOCOLS INITIALIZED IN THIS NODE.</p>
                        <a href="/dashboard/new" className="btn-retro">
                            + INITIALIZE FIRST MODULE
                        </a>
                    </div>
                )}
            </Window>

            <footer className="mt-8 text-sm font-bold btn-retro">
                (C) 1984 ATKINSON PROTOCOL // VERSION 1.1.0
            </footer>

        </div>
    )
}
