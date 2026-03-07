'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { createNeonClient } from '@/lib/neon'
import { revalidatePath } from 'next/cache'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
})

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
    'sound-pack': { name: 'BLACK FRAME', cost: 30 },
}

const PREMIUM_CATALOG: Record<string, { name: string; priceInCents: number; stripePriceId: string }> = {
    'bonus-track': { name: 'THE LITTLE BROTH', priceInCents: 99, stripePriceId: process.env.STRIPE_PRICE_BONUS_TRACK! },
    'secondary-colour': { name: 'SECONDARY COLOUR', priceInCents: 199, stripePriceId: process.env.STRIPE_PRICE_SECONDARY_COLOUR! },
    'mini-game': { name: 'MINI GAME', priceInCents: 299, stripePriceId: process.env.STRIPE_PRICE_MINI_GAME! },
}

export async function getPremiumCatalog() {
    return Object.entries(PREMIUM_CATALOG).map(([id, item]) => ({
        id,
        name: item.name,
        priceInCents: item.priceInCents,
    }))
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

export async function createCheckoutSession(itemId: string): Promise<{ url?: string; error?: string }> {
    const { userId } = await auth()
    if (!userId) return { error: 'Unauthorized' }

    const item = PREMIUM_CATALOG[itemId]
    if (!item) return { error: 'Item not found' }

    const neonClient = await createNeonClient()

    // Check if already purchased
    const { data: existing } = await neonClient
        .from('user_purchases')
        .select('id')
        .eq('user_id', userId)
        .eq('item_id', itemId)
        .maybeSingle()

    if (existing) return { error: 'Already purchased' }

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{ price: item.stripePriceId, quantity: 1 }],
        client_reference_id: userId,
        metadata: {
            app_id: process.env.NEXT_PUBLIC_DB_SCHEMA!,
            item_id: itemId,
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings?purchased=${itemId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings`,
    })

    return { url: session.url ?? undefined }
}

export async function getPurchasedItemIds(): Promise<string[]> {
    const { userId } = await auth()
    if (!userId) return []

    const neonClient = await createNeonClient()

    // Points-based purchases (from point_events)
    const { data: pointsPurchases } = await neonClient
        .from('point_events')
        .select('metadata')
        .eq('user_id', userId)
        .eq('type', 'redemption')

    const pointsIds = (pointsPurchases ?? [])
        .map((e: { metadata: { item_id?: string } | null }) => e.metadata?.item_id)
        .filter((id: string | undefined): id is string => !!id)

    // Stripe purchases (from user_purchases)
    const { data: stripePurchases } = await neonClient
        .from('user_purchases')
        .select('item_id')
        .eq('user_id', userId)

    const stripeIds = (stripePurchases ?? [])
        .map((e: { item_id: string }) => e.item_id)

    return [...new Set([...pointsIds, ...stripeIds])]
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

const PREMIUM_ITEM_NAMES: Record<string, string> = {
    'bonus-track': 'THE LITTLE BROTH',
    'secondary-colour': 'SECONDARY COLOUR',
    'mini-game': 'MINI GAME',
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

    // Fetch Stripe purchases
    const { data: purchases } = await neonClient
        .from('user_purchases')
        .select('id, item_id, purchased_at')
        .eq('user_id', userId)
        .order('purchased_at', { ascending: false })

    // Get habit names for milestone events
    const habitIds = [...new Set(
        (events ?? [])
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

    const pointEvents: NotificationEvent[] = (events ?? []).map((e: { id: string; type: string; amount: number; metadata: Record<string, unknown> | null; created_at: string; habit_id?: string }) => ({
        id: e.id,
        type: e.type,
        amount: e.amount,
        metadata: e.metadata,
        created_at: e.created_at,
        habit_title: e.habit_id ? habitMap[e.habit_id] : undefined,
    }))

    const purchaseEvents: NotificationEvent[] = (purchases ?? []).map((p: { id: string; item_id: string; purchased_at: string }) => ({
        id: `purchase-${p.id}`,
        type: 'purchase',
        amount: 0,
        metadata: { item_id: p.item_id, item_name: PREMIUM_ITEM_NAMES[p.item_id] || p.item_id },
        created_at: p.purchased_at,
    }))

    return [...pointEvents, ...purchaseEvents].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
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
    if (trimmed.length > 12) return { error: 'Alias must be 12 characters or fewer' }

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
        return { error: 'Failed to update email. Please try a different address.' }
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
