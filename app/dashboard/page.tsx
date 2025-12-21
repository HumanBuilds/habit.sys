
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signout } from '../login/actions'
import { queryProtocolStreak, commitHabitLog } from './actions'
import { Window } from '@/components/Window'
import { HabitCard } from '@/components/HabitCard'

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

    return (
        <div className="min-h-screen p-8 bg-white dither-50 flex flex-col items-center">
            <Window title="HABIT_GARDEN.EXE" className="w-full max-w-5xl">
                <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tighter">HABIT GARDEN</h1>
                        <p className="text-xl">USER: {user.email?.split('@')[0].toUpperCase()}</p>
                    </div>
                    <div className="flex gap-4">
                        <a href="/dashboard/new" className="btn-retro">
                            + NEW HABIT
                        </a>
                        <form action={signout}>
                            <button className="btn-retro">
                                SIGN OUT
                            </button>
                        </form>
                    </div>
                </div>

                {habits && habits.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {habits.map(async (habit) => {
                            const isCompleted = completedHabitIds.has(habit.id)
                            const streak = await queryProtocolStreak(habit.id)

                            return (
                                <div key={habit.id} className="flex flex-col gap-2">
                                    <HabitCard
                                        name={habit.title}
                                        icon={habit.icon || '🌱'}
                                        isCompleted={isCompleted}
                                    />
                                    <div className="flex justify-between px-2 font-bold text-sm">
                                        <span>STREAK: {streak}D</span>
                                        <div className="flex gap-2">
                                            <form action={async () => {
                                                'use server'
                                                await commitHabitLog(habit.id, isCompleted)
                                            }}>
                                                <button className="hover:underline">
                                                    [{isCompleted ? 'UNCHECK' : 'CHECK'}]
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-black">
                        <p className="text-2xl mb-8">NO SEEDS PLANTED IN THIS GARDEN.</p>
                        <a href="/dashboard/new" className="btn-retro">
                            + PLANT FIRST SEED
                        </a>
                    </div>
                )}
            </Window>

            <footer className="mt-8 text-sm font-bold btn-retro">
                (C) 1984 ATKINSON PROTOCOL // VERSION 1.0.4
            </footer>

        </div>
    )
}
