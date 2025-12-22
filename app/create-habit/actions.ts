'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function initializeProtocol(prevState: unknown, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to create a habit.' }
    }

    const title = formData.get('title') as string
    const identity = formData.get('identity') as string
    const cue = formData.get('cue') as string
    const frequencyStr = formData.get('frequency') as string

    if (!title || !identity || !cue) {
        return { error: 'Please fill in all fields.' }
    }

    let frequency = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; // Default
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
        .insert({
            user_id: user.id,
            title,
            identity,
            cue,
            frequency
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}
