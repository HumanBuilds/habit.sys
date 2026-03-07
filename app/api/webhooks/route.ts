import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { neon } from '@neondatabase/serverless';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

async function fulfillPurchase(userId: string, itemId: string, sessionId: string) {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`
        INSERT INTO user_purchases (user_id, item_id, stripe_session_id)
        VALUES (${userId}, ${itemId}, ${sessionId})
        ON CONFLICT (user_id, item_id) DO NOTHING
    `;
    console.log(`[Webhook] Fulfilled purchase: ${itemId} for user ${userId}`);
}

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error(`Webhook signature verification failed.`, message);
        return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;

        // CRITICAL: Hub & Spoke Guard
        if (metadata?.app_id !== process.env.NEXT_PUBLIC_DB_SCHEMA) {
            console.log(`[Webhook] Ignoring event for app_id: ${metadata?.app_id}`);
            return NextResponse.json({ received: true, ignored: true });
        }

        const userId = session.client_reference_id;
        const itemId = metadata?.item_id;

        if (userId && itemId) {
            await fulfillPurchase(userId, itemId, session.id);
        } else {
            console.warn('[Webhook] Missing userId or itemId in session');
        }
    }

    return NextResponse.json({ received: true });
}
