import { updateProtocol } from './actions'
import { HabitWizard } from '@/components/HabitWizard/HabitWizard'
import { auth } from '@clerk/nextjs/server'
import { createNeonClient } from '@/lib/neon'
import { redirect } from 'next/navigation'

export default async function EditHabitPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { userId } = await auth()

    if (!userId) {
        redirect('/login')
    }

    const neonClient = await createNeonClient()

    const { data: habit, error } = await neonClient
        .from('habits')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single()

    if (error || !habit) {
        redirect('/dashboard')
    }

    // Prepare initial data for the wizard
    const initialData = {
        identity: habit.identity,
        title: habit.title,
        cue: habit.cue,
        frequency: habit.frequency || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }

    return (
        <>
            <HabitWizard
                action={updateProtocol}
                initialData={initialData}
                id={id}
                mode="edit"
            />
        </>
    )
}
