# Habit Garden: Project Context & Roadmap

Habit Garden is a satisfying habit tracking app focused on the philosophy of **one habit at a time**. It leverages Atomic Habits methodology to ensure habits are small, specific, and identity-based.

## 🌿 Current State

### Architecture & Tech Stack
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- **Database/Auth**: [Supabase](https://supabase.com/) (SSR, Postgres)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with a custom "Cozy" design system
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Core Features
- **One Habit Focus**: The dashboard prioritizes the most recently created habit, keeping the user focused on a single change.
- **Identity-First Creation**: The habit creation flow asks "Who do you want to become?" before "What will you do?", aligning with Atomic Habits.
- **Simple Check-In**: A large, satisfying check-in button with micro-animations and optimistic updates.
- **Themes**: Dark/Light mode support via a CSS-variable driven "Cozy" theme.

### Database Schema
- `habits`: Stores the identity goal, habit title, and cue.
- `habit_logs`: Tracks daily completions.

---

## 🚀 Feature Roadmap

### 1. Streaks & Progress
- **Garden Growth**: A visual representation of a plant (the garden) that grows as the user maintains their streak.
- **Milestone Rewards**: Subtle visual "blooms" for 7-day, 30-day, and 100-day streaks.

### 2. Atomic Habit Enhancements
- **"Make it Obvious"**: Browser notifications or email reminders at the specific "Cue" time.
- **"Make it Easy"**: Optional "Two-Minute Version" toggle to track even if the full habit wasn't done.
- **"Make it Satisfying"**: Sound effects on check-in and confetti on steak milestones.

### 3. Habit History & Reflection
- **The Archives**: View past habits that were successfully integrated into the user's identity.
- **Identity Shift**: A visual timeline showing the sequence of identities the user has adopted.

---

## 🎨 Styling & Design Plan
- **Standardized Components**: Move from ad-hoc classes to a robust component library (e.g., `app/ui/Button.tsx`, `app/ui/Card.tsx`).
- **Cozy Design System**: Standardize the use of:
  - **Colors**: Sage green (`--cozy-primary`), Terracotta (`--cozy-accent`), Cream (`--cozy-bg`).
  - **Radius**: Heavy rounding (2xl/3xl) for a soft, friendly feel.
  - **Typography**: Nunito/Geist for readability and character.
- **Mobile Perfection**: Ensure the multi-step form and dashboard are fully responsive with tactile-friendly touch targets.

---

## 🧪 Testing Strategy

### 1. Unit & Integration
- **Vitest**: Test server actions (e.g., `toggleHabitCompletion`) and utility functions.
- **React Testing Library**: Verify component rendering and interactivity (e.g., identity-to-behavior step transition).

### 2. End-to-End (E2E)
- **Playwright**: Automate the "Happy Path":
  1. Login/Sign up.
  2. Create a new habit (Multi-step flow).
  3. Perform a daily check-in.
  4. Verify streak update.

### 3. Manual Verification
- Use the `/verify_feature` workflow for browser-based smoke tests after major changes.
