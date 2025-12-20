
import { Window } from '@/components/Window'

export default function Home() {
  return (
    <div className="min-h-screen bg-white dither-50 flex items-center justify-center p-8">
      <Window title="HABIT_GARDEN_V1.0.EXE" className="w-full max-w-2xl text-center">
        <main className="flex flex-col gap-8 items-center py-12">
          <h1 className="text-6xl font-bold tracking-tighter border-b-4 border-black pb-4">
            HABIT GARDEN
          </h1>
          <p className="text-2xl font-bold max-w-md">
            FOCUS ON ONE HABIT. NURTURE IT. WATCH IT GROW.
          </p>

          <div className="flex gap-6 mt-8">
            <a href="/dashboard" className="btn-retro inverted text-2xl px-12 py-4">
              [ GET STARTED ]
            </a>
            <a href="/login" className="btn-retro text-2xl px-12 py-4">
              [ LOG IN ]
            </a>
          </div>
        </main>

        <div className="mt-8 border-t-2 border-black pt-4 text-sm font-bold tracking-widest">
          WARNING: PERSISTENCE IS REQUIRED FOR GROWTH.
        </div>
      </Window>
    </div>
  );
}
