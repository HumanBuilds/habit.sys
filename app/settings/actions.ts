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

const SHOP_CATALOG: Record<string, { name: string; cost: number }> = {
    'sticker-1bit': { name: '1-BIT STICKER', cost: 5 },
    'colour-swap': { name: 'COLOUR SWAP', cost: 15 },
    'sound-pack': { name: 'SOUND PACK', cost: 30 },
}

export async function redeemShopItem(itemId: string): Promise<{ success?: boolean; error?: string; newBalance?: number }> {
    const { userId } = await auth()
    if (!userId) return { error: 'Unauthorized' }

    const item = SHOP_CATALOG[itemId]
    if (!item) return { error: 'Item not found' }

    const neonClient = await createNeonClient()

    // Get current balance
    const { data: points } = await neonClient
        .from('user_points')
        .select('balance')
        .eq('user_id', userId)
        .maybeSingle()

    const currentBalance = points?.balance ?? 0
    if (currentBalance < item.cost) return { error: 'Insufficient credits' }

    // Deduct points
    const newBalance = currentBalance - item.cost
    await neonClient
        .from('user_points')
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq('user_id', userId)

    // Log the redemption event
    await neonClient.from('point_events').insert({
        user_id: userId,
        type: 'redemption',
        amount: -item.cost,
        metadata: { item_id: itemId, item_name: item.name },
    })

    revalidatePath('/settings')
    revalidatePath('/dashboard')
    return { success: true, newBalance }
}

export async function getPurchasedItemIds(): Promise<string[]> {
    const { userId } = await auth()
    if (!userId) return []

    const neonClient = await createNeonClient()
    const { data } = await neonClient
        .from('point_events')
        .select('metadata')
        .eq('user_id', userId)
        .eq('type', 'redemption')

    if (!data) return []
    return data
        .map((e: { metadata: { item_id?: string } | null }) => e.metadata?.item_id)
        .filter((id: string | undefined): id is string => !!id)
}

export async function getStickerGrid(): Promise<boolean[] | null> {
    const { userId } = await auth()
    if (!userId) return null

    const neonClient = await createNeonClient()
    const { data } = await neonClient
        .from('user_stickers')
        .select('grid')
        .eq('user_id', userId)
        .maybeSingle()

    if (!data?.grid) return null
    return data.grid as boolean[]
}

export async function saveStickerGrid(grid: boolean[]): Promise<{ success?: boolean; error?: string }> {
    const { userId } = await auth()
    if (!userId) return { error: 'Unauthorized' }

    if (!Array.isArray(grid) || grid.length !== 2304) {
        return { error: 'Invalid grid data' }
    }

    const neonClient = await createNeonClient()

    const { data: existing } = await neonClient
        .from('user_stickers')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle()

    if (existing) {
        const { error } = await neonClient
            .from('user_stickers')
            .update({ grid, updated_at: new Date().toISOString() })
            .eq('user_id', userId)
        if (error) return { error: error.message }
    } else {
        const { error } = await neonClient
            .from('user_stickers')
            .insert({ user_id: userId, grid })
        if (error) return { error: error.message }
    }

    revalidatePath('/settings')
    return { success: true }
}

export interface NotificationEvent {
    id: string
    type: string
    amount: number
    metadata: Record<string, unknown> | null
    created_at: string
    habit_title?: string
}

export async function getNotificationEvents(): Promise<NotificationEvent[]> {
    const { userId } = await auth()
    if (!userId) return []

    const neonClient = await createNeonClient()

    // Fetch milestone + redemption events
    const { data: events } = await neonClient
        .from('point_events')
        .select('id, type, amount, metadata, created_at, habit_id')
        .eq('user_id', userId)
        .in('type', ['streak_3', 'streak_10', 'streak_30', 'redemption'])
        .order('created_at', { ascending: false })

    if (!events || events.length === 0) return []

    // Get habit names for milestone events
    const habitIds = [...new Set(
        events
            .map((e: { habit_id?: string }) => e.habit_id)
            .filter((id: string | undefined): id is string => !!id)
    )]

    let habitMap: Record<string, string> = {}
    if (habitIds.length > 0) {
        const { data: habits } = await neonClient
            .from('habits')
            .select('id, title')
            .in('id', habitIds)

        if (habits) {
            habitMap = Object.fromEntries(
                habits.map((h: { id: string; title: string }) => [h.id, h.title])
            )
        }
    }

    return events.map((e: { id: string; type: string; amount: number; metadata: Record<string, unknown> | null; created_at: string; habit_id?: string }) => ({
        id: e.id,
        type: e.type,
        amount: e.amount,
        metadata: e.metadata,
        created_at: e.created_at,
        habit_title: e.habit_id ? habitMap[e.habit_id] : undefined,
    }))
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
