# Settings Panel (System Config) — Brainstorm

**Date:** 2026-03-02
**Status:** Draft

---

## What We're Building

A floating settings cog button in the top-right corner of every screen. Clicking it opens an animated Window panel (overlay with dim backdrop) that serves as the app's control center. Inside the panel, a menu list leads to detail views for:

1. **Sound Settings** — mute/unmute sound effects (infrastructure already exists via `soundEngine.setMuted()`)
2. **Account** — view/edit email, password (via Clerk flows), and custom operator alias (stored in DB, replaces email prefix as OPERATOR name)
3. **Shop** — browse and purchase cosmetic items (visual themes + sound packs) using points earned from habit completions
4. **Notifications** — hub showing streak milestone celebrations and purchase confirmations
5. **Purchased Items** — manage/equip owned cosmetics and sound packs

## Why This Approach

- **Floating overlay vs. dedicated route**: An overlay keeps the user in context — they don't lose their place on the dashboard. The cog is always accessible without cluttering navigation.
- **Menu → detail view navigation**: Fits the retro OS aesthetic (like navigating a file system). Simpler than tabs for 5+ sections, and the sideways slide animation already exists in the codebase (`sidewaysFlashVariants`).
- **Points per completion**: Simplest model to implement and understand. Every habit check-off earns points. No complex streak math needed for the MVP.
- **Cosmetics only (no gameplay advantages)**: Keeps the core habit system fair and unaffected by purchases. Themes and sounds are fun rewards without distorting behavior.

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Cog visibility | All screens (including landing, login) | Consistent UI landmark; shows limited options (just sound) when logged out |
| Open animation | Scale up from cog position | Feels like opening a window from an icon — fits the desktop OS metaphor |
| Internal navigation | Menu list → detail view + back button | Retro file-explorer feel; reuses `sidewaysFlashVariants` for sub-page transitions |
| Overlay behavior | Dim backdrop, click-outside-to-close | Standard modal UX; prevents accidental interaction with background |
| Panel sizing | Matches standard Window component | Consistent with every other view in the app (`w-full max-w-2xl` pattern) |
| Points model | Flat points per habit completion | Simple, predictable, easy to implement |
| Shop inventory | Visual themes + sound packs | Cosmetic-only; no functional upgrades that affect habit tracking |
| Operator alias | Custom name stored in DB | Replaces email prefix across the app; not managed by Clerk |
| Notifications | Streak milestones + purchase confirmations | Lightweight; no push notifications or reminders — just an in-app log |

## Sub-Page Breakdown

### Menu (Landing View)
- List of menu items with retro bracket labels: `[ SOUND ]`, `[ ACCOUNT ]`, `[ SHOP ]`, `[ NOTIFICATIONS ]`, `[ INVENTORY ]`
- Shows point balance at top when logged in
- When logged out: only `[ SOUND ]` is available; others show as locked/greyed

### Sound Settings
- Single toggle: mute/unmute all sound effects
- Persisted to `localStorage` so it survives sessions
- When sound packs are purchased: option to select active sound pack

### Account
- Display current email (read-only, with link to Clerk-managed email change)
- Display/edit operator alias (text input, saved to DB)
- Password change link (redirects to Clerk's password flow)
- `[ EXIT SYSTEM ]` sign-out button (mirrors existing dashboard sign-out)

### Shop
- Grid or list of purchasable items with point costs
- Items grouped by category: `VISUAL_THEMES` and `SOUND_PACKS`
- Each item shows: name, preview, cost, owned/not-owned status
- Purchase confirmation before spending points

### Notifications
- Reverse-chronological feed of events:
  - Streak milestones (7-day, 30-day, etc.)
  - Purchase confirmations
- Unread indicator on the cog button or notification menu item
- Mark-as-read behavior (tap to dismiss or "clear all")

### Purchased Items (Inventory)
- List of all owned items
- Toggle to equip/activate themes and sound packs
- Only one theme and one sound pack active at a time
- Preview before activating

## Database Considerations

New tables/columns needed:
- `user_profiles` — `user_id`, `alias`, `points_balance`, `active_theme`, `active_sound_pack`
- `shop_items` — `id`, `name`, `category` (theme/sound), `cost`, `description`, `preview_data`
- `user_purchases` — `user_id`, `item_id`, `purchased_at`
- `notifications` — `user_id`, `type`, `message`, `read`, `created_at`
- Points earning: increment `points_balance` in the existing `commitHabitLog` action

## Resolved Questions

1. **Points per completion** — Separate feature doc exists for the points spec. Points system design is out of scope for this brainstorm; the settings panel will consume whatever the points system provides.
2. **Initial shop inventory** — Build the shop UI first, add items later. Decouples the work.
3. **Notification persistence** — Database-backed. Stored in a `notifications` table with RLS. Persistent across devices and sessions.
4. **Theme preview** — SVG thumbnail with a title for each shop item. No live preview.

## Open Questions

_(None remaining)_
