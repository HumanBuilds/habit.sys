'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { createNeonClient } from '@/lib/neon'
import { revalidatePath } from 'next/cache'

export async function getPointsBalance(): Promise<{ balance: number; error?: string }> {
    const { userId } = await auth()
    if (!userId) return { balance: 0, error: 'Unauthorized' }

    const neonClient = await createNeonClient()
    const { data, error } = await neonClient
        .from('user_points')
        .select('balance')
        .eq('user_id', userId)
        .maybeSingle()

    if (error) return { balance: 0, error: error.message }
    return { balance: data?.balance ?? 0 }
}

export async function getAlias(): Promise<{ alias: string | null; error?: string }> {
    const { userId } = await auth()
    if (!userId) return { alias: null, error: 'Unauthorized' }

    const neonClient = await createNeonClient()
    const { data, error } = await neonClient
        .from('user_profiles')
        .select('alias')
        .eq('user_id', userId)
        .maybeSingle()

    if (error) return { alias: null, error: error.message }
    return { alias: data?.alias ?? null }
}

export async function updateAlias(alias: string): Promise<{ success?: boolean; error?: string }> {
    const { userId } = await auth()
    if (!userId) return { error: 'Unauthorized' }

    const trimmed = alias.trim()
    if (trimmed.length > 20) return { error: 'Alias must be 20 characters or fewer' }

    const neonClient = await createNeonClient()

    const { data: existing } = await neonClient
        .from('user_profiles')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle()

    if (existing) {
        const { error } = await neonClient
            .from('user_profiles')
            .update({ alias: trimmed || null, updated_at: new Date().toISOString() })
            .eq('user_id', userId)
        if (error) return { error: error.message }
    } else {
        const { error } = await neonClient
            .from('user_profiles')
            .insert({ user_id: userId, alias: trimmed || null })
        if (error) return { error: error.message }
    }

    revalidatePath('/dashboard')
    revalidatePath('/settings')
    return { success: true }
}

export async function updateEmail(newEmail: string): Promise<{ success?: boolean; error?: string }> {
    const { userId } = await auth()
    if (!userId) return { error: 'Unauthorized' }

    const trimmed = newEmail.trim().toLowerCase()
    if (!trimmed) return { error: 'Email is required' }

    try {
        const client = await clerkClient()
        const user = await client.users.getUser(userId)
        const oldPrimaryEmailId = user.primaryEmailAddressId

        // Create new email as verified + primary (Backend API bypasses reverification)
        await client.emailAddresses.createEmailAddress({
            userId,
            emailAddress: trimmed,
            verified: true,
            primary: true,
        })

        // Remove old primary email
        if (oldPrimaryEmailId) {
            await client.emailAddresses.deleteEmailAddress(oldPrimaryEmailId)
        }

        revalidatePath('/settings')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (err: unknown) {
        const clerkErr = err as { errors?: { longMessage?: string }[] }
        return { error: clerkErr?.errors?.[0]?.longMessage || 'Failed to update email' }
    }
}

export async function updatePassword(
    newPassword: string,
    currentPassword?: string
): Promise<{ success?: boolean; error?: string }> {
    const { userId } = await auth()
    if (!userId) return { error: 'Unauthorized' }

    if (!newPassword || newPassword.length < 8) {
        return { error: 'Password must be at least 8 characters' }
    }

    try {
        const client = await clerkClient()

        // If user has a current password, verify it first
        if (currentPassword) {
            const { verified } = await client.users.verifyPassword({
                userId,
                password: currentPassword,
            })
            if (!verified) return { error: 'Current password is incorrect' }
        }

        await client.users.updateUser(userId, { password: newPassword })
        return { success: true }
    } catch (err: unknown) {
        const clerkErr = err as { errors?: { longMessage?: string }[] }
        return { error: clerkErr?.errors?.[0]?.longMessage || 'Failed to update password' }
    }
}
