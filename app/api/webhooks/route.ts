import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover', // Updated to match installed library version
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Mock function to unlock premium features
async function unlockPremium(userId: string) {
    console.log(`[Mock] Unlocking premium features for user: ${userId}`);
    // implementation would go here
    return true;
}

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed.`, err.message);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;

        // CRITICAL: Hub & Spoke Guard
        // We only care about events for this specific "Spoke" (App ID)
        if (metadata?.app_id !== process.env.NEXT_PUBLIC_DB_SCHEMA) {
            console.log(`[Webhook] Ignoring event for app_id: ${metadata?.app_id}`);
            return NextResponse.json({ received: true, ignored: true });
        }

        const userId = session.client_reference_id; // Assuming client_reference_id is the user ID

        if (userId) {
            await unlockPremium(userId);
            console.log(`[Webhook] Processed premium unlock for user ${userId}`);
        } else {
            console.warn('[Webhook] No user ID found in session');
        }
    }

    return NextResponse.json({ received: true });
}
