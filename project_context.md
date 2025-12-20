# Habit Garden: Project Context & Roadmap

Habit Garden is a mechanical, 1-bit habit tracking interface focused on the philosophy of **one habit at a time**. It leverages Atomic Habits methodology to ensure habits are small, specific, and identity-based.

## 🌿 Current State

### Architecture & Tech Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- **Database/Auth**: [Supabase](https://supabase.com/) (SSR, Postgres)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with the **Atkinson Protocol** (1-bit Design System)
- **Design Strategy**: 1-bit (Black & White) aesthetic, dithered backgrounds, pixel-perfect borders.
- **Typography**: [VT323](https://fonts.google.com/specimen/VT323) (Pixel-bitmap font)
- **Icons**: Simplified pixel-art / high-contrast glyphs via [Lucide React](https://lucide.dev/)

### Core Features
- **One Habit Focus**: The dashboard prioritizes the most recently created habit, keeping the user focused on a single change.
- **Identity-First Creation**: The habit creation flow asks "Who do you want to become?" before "What will you do?", aligning with Atomic Habits.
- **Retro Windows**: Content is organized inside draggable-style "Windows" with striped title bars.
- **Habit Matrix**: A high-contrast grid of "Habit Cards" that invert colors when a protocol is completed.

### Database Schema
- `habits`: Stores the identity goal, habit title, cue, and pixel-icon identifier.
- `habit_logs`: Tracks daily completions.

---

## 🚀 Feature Roadmap

### 1. Streaks & Protocol Stability
- **System Growth**: A visual representation of a pixelated garden that matures as users maintain their "Protocol Stability" (streak).
- **Protocol Milestones**: Hard-edge visual rewards for 7, 30, and 100-day uptime.

### 2. Atomic Habit Enhancements
- **"Matrix Cues"**: Browser notifications at the specific "Cue" time to trigger habit execution.
- **"Fallback Mode"**: A "Two-Minute Version" toggle for emergency habit maintenance when the full protocol cannot be executed.
- **"Mechanical Feedback"**: Sound effects on check-in (mechanical clicks) and visual glitches on milestone achievement.

### 3. Archive & Reflection
- **The Archives**: View past protocols that were successfully integrated into the user's permanent identity state.
- **Identity Synthesis**: A visual timeline showing the sequence of identities the user has adopted.

---

## 🎨 Atkinson Protocol (Design System)
- **Layout**: Fluid grid inside solid-bordered containers.
- **Solid Borders**: 2px or 3px solid black.
- **Hard Shadows**: `box-shadow: 4px 4px 0px 0px #000;`
- **Dithering**: SVG-based checkerboards (50%) and stippling (25%) for depth without grays.

---

## 🧪 Testing Strategy

### 1. Protocol Verification
- **Vitest**: Test server actions (e.g., `commitHabitLog`) and protocol math logic.
- **Browser Subagent**: Verify 1-bit aesthetic adherence and pixel-perfect rendering across steps.

### 2. End-to-End (E2E)
- **Playwright**: Automate the "Happy Path":
  1. System Login.
  2. Protocol Initialization (New Habit).
  3. Daily Check-In Execution.
  4. Verify Stability Upshift (Streak Update).
