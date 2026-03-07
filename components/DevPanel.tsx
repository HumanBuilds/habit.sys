'use client'

import { useState, useTransition } from 'react'
import { devAddPoints, devResetPoints, devResetMilestones, devGetPointsInfo, queryProtocolStreak } from '@/app/dashboard/actions'
import { useToast } from '@/context/ToastContext'
import { soundEngine } from '@/utils/sound-engine'

interface DevPanelProps {
    habits: { id: string; title: string }[]
    initialBalance: number
}

export function DevPanel({ habits, initialBalance }: DevPanelProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [info, setInfo] = useState<{ balance: number; events: unknown[] } | null>(null)
    const [streaks, setStreaks] = useState<Record<string, number>>({})
    const { showToast } = useToast()

    const run = (fn: () => Promise<unknown>) => {
        startTransition(async () => {
            await fn()
        })
    }

    const refreshInfo = () => run(async () => {
        const result = await devGetPointsInfo()
        if ('balance' in result && typeof result.balance === 'number') {
            setInfo({ balance: result.balance, events: result.events })
        }
    })

    const fetchStreaks = () => run(async () => {
        const results: Record<string, number> = {}
        for (const h of habits) {
            results[h.id] = await queryProtocolStreak(h.id)
        }
        setStreaks(results)
    })

    if (!open) {
        return (
            <button
                onClick={() => { setOpen(true); refreshInfo(); fetchStreaks(); }}
                className="text-[10px] uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity mt-4"
            >
                [ DEV ]
            </button>
        )
    }

    const balance = info?.balance ?? initialBalance

    return (
        <div className="mt-4 border-2 border-dashed border-black p-3 opacity-80 text-xs">
            <div className="flex justify-between items-center mb-3">
                <span className="font-bold tracking-widest">DEV_PANEL</span>
                <button onClick={() => setOpen(false)} className="opacity-60 hover:opacity-100">[ CLOSE ]</button>
            </div>

            {/* Balance */}
            <div className="mb-3 pb-3 border-b border-dashed border-black">
                <span className="font-bold">BALANCE: {balance} PTS</span>
                {isPending && <span className="ml-2 animate-pulse">...</span>}
            </div>

            {/* Points Controls */}
            <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-dashed border-black">
                {[10, 50, 100].map(amt => (
                    <button
                        key={amt}
                        disabled={isPending}
                        onClick={() => run(async () => { await devAddPoints(amt); await refreshInfo() })}
                        className="btn-retro text-[10px] px-2 py-1"
                    >
                        +{amt} PTS
                    </button>
                ))}
                <button
                    disabled={isPending}
                    onClick={() => run(async () => { await devResetPoints(); setInfo({ balance: 0, events: [] }) })}
                    className="btn-retro-secondary text-[10px] px-2 py-1"
                >
                    RESET PTS
                </button>
            </div>

            {/* Toast Test */}
            <div className="mb-3 pb-3 border-b border-dashed border-black">
                <button
                    onClick={() => {
                        soundEngine.playConfirm()
                        showToast('STREAK PROTOCOL: 3-DAY CHAIN // +3 PTS', 'milestone')
                    }}
                    className="btn-retro text-[10px] px-2 py-1"
                >
                    TEST TOAST
                </button>
            </div>

            {/* Per-habit controls */}
            <div className="flex flex-col gap-2">
                <span className="font-bold tracking-widest mb-1">HABITS</span>
                {habits.map(h => (
                    <div key={h.id} className="flex items-center justify-between gap-2 py-1 border-b border-dotted border-black last:border-0">
                        <span className="truncate flex-1">{h.title}</span>
                        <span className="font-bold min-w-[60px] text-right">
                            {streaks[h.id] !== undefined ? `${streaks[h.id]}d streak` : '—'}
                        </span>
                        <button
                            disabled={isPending}
                            onClick={() => run(async () => { await devResetMilestones(h.id); refreshInfo() })}
                            className="btn-retro-secondary text-[10px] px-2 py-0.5 whitespace-nowrap"
                        >
                            RST MILES
                        </button>
                    </div>
                ))}
                <button
                    disabled={isPending}
                    onClick={fetchStreaks}
                    className="btn-retro-secondary text-[10px] px-2 py-1 mt-1 self-start"
                >
                    REFRESH STREAKS
                </button>
            </div>

            {/* Event log */}
            {info?.events && info.events.length > 0 && (
                <div className="mt-3 pt-3 border-t border-dashed border-black">
                    <span className="font-bold tracking-widest">RECENT EVENTS ({info.events.length})</span>
                    <div className="mt-1 max-h-[120px] overflow-y-auto">
                        {(info.events as { type: string; amount: number; created_at: string }[]).slice(0, 20).map((e, i) => (
                            <div key={i} className="flex justify-between opacity-70">
                                <span>{e.type}</span>
                                <span>{e.amount > 0 ? '+' : ''}{e.amount}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
