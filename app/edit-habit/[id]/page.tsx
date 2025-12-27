import { updateProtocol } from './actions'
import { HabitWizard } from '@/components/HabitWizard/HabitWizard'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function EditHabitPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: habit, error } = await supabase
        .from('habits')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
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
            {/* Simple hidden input to pass ID, though the action handles it via formData if we put it in the wizard.
                 NOTE: The wizard doesn't currently put arbitrary hidden fields. 
                 We'll need to wrap the action or modify the wizard to accept children/extra fields. 
                 OR, simpler: The wizard's form includes children? No.
                 Let's modify the bind.
             */}
            <HabitWizard
                action={updateProtocol}
                initialData={initialData}
                id={id}
                mode="edit"
            />
            {/* 
                Reviewing HabitWizard: It iterates inputs. It doesn't have a slot for the ID.
                We need to ensure the ID is passed to the action. 
                Best way: Bind the ID to the action.
            */}
        </>
    )
}
