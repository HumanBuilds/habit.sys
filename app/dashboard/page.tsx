
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signout } from '../login/actions'
import HabitCheckIn from './habit-check-in'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const today = new Date().toISOString().split('T')[0]

    // Fetch the most recently created habit
    const { data: habits } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

    const activeHabit = habits?.[0] || null
    let isCompletedToday = false

    if (activeHabit) {
        const { data: logs } = await supabase
            .from('habit_logs')
            .select('*')
            .eq('habit_id', activeHabit.id)
            .eq('completed_at', today)
            .single()

        if (logs) {
            isCompletedToday = true
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-12 bg-cozy-bg">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-cozy-primary tracking-tight">Your Habit Garden</h1>
                <p className="text-lg text-cozy-text/60">Welcome back, {user.email?.split('@')[0]}</p>
            </div>

            {activeHabit ? (
                <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-cozy-muted/50">
                    <div className="flex flex-col items-center gap-8">
                        <div className="text-center space-y-1">
                            <span className="text-xs font-bold uppercase tracking-widest text-cozy-primary/60">Current Focus</span>
                            <h2 className="text-3xl font-bold text-cozy-text">{activeHabit.title}</h2>
                            <p className="text-cozy-text/50 font-medium italic">"{activeHabit.cue}"</p>
                        </div>

                        <HabitCheckIn
                            habitId={activeHabit.id}
                            habitTitle={activeHabit.title}
                            initialCompleted={isCompletedToday}
                        />
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-xl text-cozy-text/50 mb-8">You haven't planted anything yet.</p>
                    <a href="/dashboard/new" className="btn btn-primary btn-lg shadow-xl shadow-cozy-primary/20">
                        + Plant Your First Seed
                    </a>
                </div>
            )}

            {activeHabit && (
                <form action={signout}>
                    <button className="btn btn-ghost btn-sm">
                        Sign Out
                    </button>
                </form>
            )}
        </div>
    )
}

