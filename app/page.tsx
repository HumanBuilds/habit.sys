export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center sm:p-20">
      <main className="flex flex-col gap-8 items-center">
        <h1 className="text-4xl font-bold text-cozy-primary tracking-tight sm:text-6xl">
          Habit Garden
        </h1>
        <p className="text-lg text-cozy-text/80 max-w-md">
          Focus on one habit. Nurture it. Watch it grow.
        </p>

        <div className="flex gap-4 mt-8">
          <button className="px-6 py-3 rounded-full bg-cozy-primary text-white font-semibold hover:opacity-90 transition-opacity shadow-sm">
            Get Started
          </button>
          <button className="px-6 py-3 rounded-full bg-cozy-muted text-cozy-text font-semibold hover:bg-opacity-80 transition-opacity">
            Log In
          </button>
        </div>
      </main>
    </div>
  );
}
