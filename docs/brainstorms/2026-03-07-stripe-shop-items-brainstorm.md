# Brainstorm: Stripe-Powered Premium Shop Items

**Date:** 2026-03-07
**Status:** Draft

## What We're Building

Add 3 premium items to the existing shop that are purchased with real money via Stripe Checkout, alongside the current 3 points-based items. The paid items are:

1. **BONUS TRACK** (~$0.99) — A second music track for the sound pack player
2. **SECONDARY COLOUR** (~$1.99) — Unlocks changing the white (`--color-white`) property in addition to the existing primary colour swap
3. **MINI GAME** (~$2.99) — A standalone retro arcade game (1-bit aesthetic) accessible from inventory

## Why This Approach

### Stripe Checkout (redirect flow) over embedded/custom forms

- **Simplest integration**: No need to collect card details, handle PCI compliance, or build payment UI
- **Already scaffolded**: The webhook at `app/api/webhooks/route.ts` already has Stripe signature verification and hub & spoke `app_id` filtering — just needs real fulfillment logic
- **One-time purchases**: These are all one-off unlocks, not subscriptions. Stripe Checkout handles this natively with `mode: 'payment'`

### Flow

```
User clicks "BUY" on a paid shop item
  → Server action creates a Stripe Checkout Session
    (with client_reference_id = userId, metadata.app_id = schema, metadata.item_id = item)
  → User redirected to Stripe-hosted checkout
  → After payment, Stripe fires checkout.session.completed webhook
  → Webhook reads metadata.item_id, inserts into user_purchases table
  → User redirected back to /settings with the item now in inventory
```

### Purchase tracking: `user_purchases` table vs `point_events`

Currently, points-based purchases are tracked as `point_events` rows with `type: 'redemption'`. For Stripe purchases, a proper `user_purchases` table makes more sense:

- Cleaner separation between "spent points" and "paid real money"
- Can store Stripe session ID for refund reference
- Existing `getPurchasedItemIds()` can query both tables and merge results
- Eventually migrate points purchases here too (but not now — YAGNI)

## Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Payment flow | Stripe Checkout redirect | Already scaffolded, PCI-free, simplest |
| Purchase storage | New `user_purchases` table | Clean separation from points events |
| Product creation | Stripe API via code (not dashboard) | Reproducible, can create products in server action or seed script |
| Price IDs | Stored as env vars or hardcoded constants | Only 3 items, no need for a DB catalog |
| Fulfillment | Webhook inserts `user_purchases` row | Standard Stripe pattern |
| Item display in shop | Same `ShopView` component, split into "CREDITS" and "PREMIUM" sections | Keep it unified |

## Resolved Questions

1. **Success/cancel redirect URLs**: Redirect to `/settings?purchased=<item-id>` and show a confirmation toast on arrival.
2. **Stripe products**: Create programmatically for reproducibility across dev/prod.
3. **Mini game**: Stub for now — wire up the Stripe purchase, show "COMING SOON" in inventory. Build the actual game as a separate task later.

## Technical Context

### Existing infrastructure to reuse
- `app/api/webhooks/route.ts` — Stripe webhook with signature verification + app_id guard
- `app/settings/actions.ts` — `getPurchasedItemIds()` for reading owned items
- `components/SettingsPanel/ShopView.tsx` — shop UI with balance + item grid
- `lib/neon.ts` — Neon PostgREST client factory
- Stripe SDK already installed (`stripe@^20.1.0`)

### New pieces needed
- `user_purchases` table (Neon migration or direct DDL)
- Server action: `createCheckoutSession(itemId)` in `app/settings/actions.ts`
- API route or redirect handler for Stripe success URL
- Webhook fulfillment logic (replace `unlockPremium` mock)
- Updated `getPurchasedItemIds()` to also query `user_purchases`
- Updated `ShopView` to show premium items with "BUY" buttons instead of points cost
