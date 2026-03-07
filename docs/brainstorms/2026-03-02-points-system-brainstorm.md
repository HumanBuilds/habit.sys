# Points & Rewards System Brainstorm

**Date:** 2026-03-02
**Status:** Draft

## What We're Building

A points economy for habit.sys where users earn credits through habit completions and streak milestones, then spend them in a shop for visual and audio customizations.

### Points Earning Rules

| Event | Points | Trigger |
|---|---|---|
| Habit completion | +1 | Each time a habit is checked off |
| 3-day streak | +3 | First time a habit reaches 3 consecutive days |
| 10-day streak | +5 | First time a habit reaches 10 consecutive days |
| 30-day streak | +10 | First time a habit reaches 30 consecutive days |
| Uncheck habit | -1 | Toggling off a completion done today |

- Streak bonuses are **one-time per habit** (not repeatable, not per-streak)
- Milestone bonuses are **never revoked** even if the streak breaks or the habit is unchecked
- **Fresh start** — no retroactive points for existing logs

### Milestone Notifications

- Toast notification appears when a streak milestone is hit
- Milestone data (date, streak count, habit) is stored for a future notification hub
- Highest-ever streak per habit should be tracked

### Shop

- Separate `/shop` route, accessed via temp button on dashboard
- Points balance displayed in the shop window
- **Placeholder items only** for v1 — infrastructure first
- Future items: window border styles, dither patterns, sound packs, animations

## Why This Approach

### Data Architecture: Balance Column + Event Log

Two new tables:

**`user_points`** — O(1) balance reads
- `user_id` (PK), `balance` (integer), `updated_at`

**`point_events`** — audit trail + future notification hub data
- `id`, `user_id`, `habit_id`, `type` (completion/streak_3/streak_10/streak_30/redemption), `amount`, `metadata` (JSONB), `created_at`
- Partial unique index on `(user_id, habit_id, type)` for milestone types only — prevents double-awarding at DB level

**Why not pure event sourcing (SUM of transactions)?**
The `@neondatabase/postgrest-js` alpha client cannot do SQL aggregates. All existing code fetches rows and counts in JS. A SUM query over an ever-growing transactions table would be untenable. The balance column gives O(1) reads for the shop page.

### Mutation Flow (inside `commitHabitLog`)

**On check (completion):**
1. Insert habit_log (existing)
2. Insert point_event (type: 'completion', amount: +1)
3. Increment user_points.balance by 1
4. Call `queryProtocolStreak(habitId)` — already exists, reuse it
5. Check streak against thresholds [3, 10, 30]
6. For each threshold: try insert point_event with milestone type (23505 = already awarded, skip)
7. If milestone inserted: increment balance by bonus amount
8. Return milestone data in response for toast display

**On uncheck:**
1. Delete habit_log (existing)
2. Decrement user_points.balance by 1
3. Do NOT reverse milestones

## Key Decisions

1. **One-time per habit** — streak bonuses are permanent achievements, awarded once
2. **Fresh start** — simpler than retroactive calculation, fairer UX
3. **Balance column + event log** — O(1) reads for shop, full audit trail for notification hub
4. **Partial unique index** — DB-level idempotency for milestones without constraining completions
5. **Placeholder shop items** — build the infrastructure, real items come later
6. **Toast notifications** — retro-styled, triggered by milestone data in server action response
7. **Uncheck deducts 1 point** — milestones stay, only the completion point is reversed

## Resolved Questions

- Streak bonuses: one-time per habit (not repeatable)
- Retroactive points: fresh start
- Celebration style: toast notification (future notification hub will use stored milestone data)
- Points display: in the shop window only (for now)
- Shop location: /shop route, temp dashboard button
- Shop items: placeholders only for v1
- Uncheck behavior: -1 point, milestones kept
