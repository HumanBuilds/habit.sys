'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function initializeProtocol(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to create a habit.' }
    }

    const title = formData.get('title') as string
    const identity = formData.get('identity') as string
    const cue = formData.get('cue') as string

    if (!title || !identity || !cue) {
        return { error: 'Please fill in all fields.' }
    }

    const { error } = await supabase
        .from('habits')
        .insert({
            user_id: user.id,
            title,
            identity,
            cue,
            frequency: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] // Defaulting to daily for now
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}
