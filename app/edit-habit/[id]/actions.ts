'use server'

import { auth } from '@clerk/nextjs/server'
import { createNeonClient } from '@/lib/neon'
import { revalidatePath } from 'next/cache'

export async function updateProtocol(prevState: unknown, formData: FormData) {
    const { userId } = await auth()

    if (!userId) {
        return { error: 'You must be logged in to update a habit.' }
    }

    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const identity = formData.get('identity') as string
    const cue = formData.get('cue') as string
    const frequencyStr = formData.get('frequency') as string

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

    const neonClient = await createNeonClient()

    const { error } = await neonClient
        .from('habits')
        .update({
            title,
            identity,
            cue,
            frequency
        })
        .eq('id', id)
        .eq('user_id', userId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
}
