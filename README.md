# 📟 Habit.sys OS

Habit.sys OS is a mechanical, 1-bit habit tracking interface designed for **systematic self-optimization**. It treats habits as core system modules that must be stabilized before further expansion.

## 💾 System Specs

- **Engine**: [Next.js 16](https://nextjs.org/) (App Router)
- **Data Terminal**: [Supabase](https://supabase.com/) (Auth & Postgres)
- **Visual Interface**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animation Layer**: [Framer Motion](https://www.framer.com/motion/)
- **Visual Standards**: **Atkinson Protocol** (1-bit dithering, high-contrast B&W)
- **Testing**: [Vitest](https://vitest.dev/) (Unit) & [Playwright](https://playwright.dev/) (E2E)

## 🛠️ Quick Start

### 1. Clone & Install
```bash
git clone <repository-url>
cd habit_garden
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Initialization
This project uses Supabase. Run migrations to set up the schema:
```bash
npx supabase migration up
```

### 4. Boot System
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the terminal.

## 📂 Project Structure

- `app/`: Routing and page components (Next.js App Router).
- `components/`: Reusable UI modules (Windows, Progress Bars, Glitch effects).
- `supabase/`: Database migrations and configuration.
- `utils/`: Server actions, client helpers, and shared logic.
- `public/`: Static assets and dithering patterns.

## 🎨 Atkinson Protocol (Visual Guidelines)

To maintain the 1-bit mechanical aesthetic:
- **High Contrast**: Use only pure black (`#000`) and pure white (`#fff`).
- **Containerization**: Everything lives inside a `Window` component with a 3px solid border.
- **Dithering**: Use CSS patterns or masks to simulate depth/shades.
- **Typography**: VT323 (System Bitmap) is the primary protocol font.

## 🧪 Verification Commands

- `npm run test`: Run unit tests with Vitest.
- `npm run test:e2e`: Run end-to-end tests with Playwright.
- `npm run lint`: Check for code style protocol violations.

---
*System maintained by the Fiery Pioneer.*
