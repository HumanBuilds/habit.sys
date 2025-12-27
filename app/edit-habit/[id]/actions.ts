'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateProtocol(prevState: unknown, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to update a habit.' }
    }

    const id = formData.get('id') as string; // We'll need to pass this ID somehow or handle it via URL params/hidden field
    const title = formData.get('title') as string
    const identity = formData.get('identity') as string
    const cue = formData.get('cue') as string
    const frequencyStr = formData.get('frequency') as string

    // For update, ID is critical. However, `useActionState` doesn't easily let us pass arguments.
    // A common pattern is using bind, but here we might just ensure the ID is in the form (hidden input).
    if (!id) {
        return { error: 'Protocol ID missing.' }
    }

    if (!title || !identity || !cue) {
        return { error: 'Please fill in all fields.' }
    }

    let frequency = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    try {
        if (frequencyStr) {
            frequency = JSON.parse(frequencyStr);
        }
    } catch (e) {
        console.warn('Failed to parse frequency', e);
    }

    if (!frequency || frequency.length === 0) {
        return { error: 'At least one day must be selected.' }
    }

    const { error } = await supabase
        .from('habits')
        .update({
            title,
            identity,
            cue,
            frequency
        })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}
