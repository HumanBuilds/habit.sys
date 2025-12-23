import { Window } from '@/components/Window'
import Link from 'next/link'
import { getPatchVersion } from '@/utils/patch-version'

export default function Home() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <Window title={`HABIT.SYS v${getPatchVersion()}`} className="w-full max-w-2xl text-center">
        <main className="flex flex-col gap-8 items-center md:py-12 py-8">
          <h1 className="text-6xl font-bold tracking-tighter border-b-4 border-black pb-4">
            HABIT.SYS
          </h1>
          <p className="text-2xl font-bold max-w-md">
            ONE HABIT MODULE. SYSTEMATIC EXECUTION. OPTIMIZE_LOAD_STATE.
          </p>

          <div className="flex gap-6 md:mt-8">
            <Link href="/dashboard" scroll={false} className="btn-retro inverted text-2xl px-12 py-4">
              [ ACCESS_SYSTEM ]
            </Link>
          </div>
        </main>

        <div className="mt-8 border-t-2 border-black pt-4 text-sm font-bold tracking-widest">
          ERROR: INCONSISTENCY DETECTED. SYSTEMATIC REPETITION REQUIRED.
        </div>
      </Window>
    </div>
  );
}
