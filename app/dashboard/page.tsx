import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signout } from '../login/actions'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
            <h1 className="text-4xl font-bold text-cozy-primary">Your Habit Garden</h1>
            <p className="text-lg text-cozy-text">Welcome, {user.email}!</p>

            <a href="/dashboard/new" className="px-8 py-4 bg-cozy-primary text-white rounded-2xl font-bold text-lg shadow-lg hover:opacity-90 transition-opacity">
                + Plant a New Seed
            </a>

            <form action={signout}>
                <button className="px-6 py-2 rounded-full border-2 border-cozy-muted text-cozy-text hover:bg-cozy-muted/50 transition-colors">
                    Sign Out
                </button>
            </form>
        </div>
    )
}
