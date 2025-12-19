'use client'

import { Check } from 'lucide-react'
import { toggleHabitCompletion } from './actions'
import { useState, useTransition } from 'react'

interface HabitCheckInProps {
    habitId: string
    initialCompleted: boolean
    habitTitle: string
}

export default function HabitCheckIn({ habitId, initialCompleted, habitTitle }: HabitCheckInProps) {
    const [isCompleted, setIsCompleted] = useState(initialCompleted)
    const [isPending, startTransition] = useTransition()

    const handleToggle = () => {
        // Optimistic update
        setIsCompleted(!isCompleted)

        startTransition(async () => {
            const result = await toggleHabitCompletion(habitId, isCompleted)
            if (result.error) {
                // Revert on error
                setIsCompleted(initialCompleted)
                alert('Failed to update habit: ' + result.error)
            }
        })
    }

    return (
        <div className="flex flex-col items-center gap-6">
            <button
                onClick={handleToggle}
                disabled={isPending}
                className={`relative group flex items-center justify-center w-32 h-32 rounded-full transition-all duration-500 ease-out shadow-xl
                    ${isCompleted
                        ? 'bg-cozy-primary scale-100 ring-4 ring-cozy-primary/20'
                        : 'bg-white border-4 border-cozy-muted hover:border-cozy-primary/50 hover:scale-105 active:scale-95'
                    }
                `}
            >
                <div className={`transition-all duration-500 ${isCompleted ? 'scale-100 opacity-100 text-white' : 'scale-50 opacity-0 text-transparent'}`}>
                    <Check size={64} strokeWidth={4} />
                </div>

                {!isCompleted && (
                    <span className="absolute text-sm font-bold text-cozy-text/20 uppercase tracking-widest group-hover:text-cozy-primary/50 transition-colors">
                        Check In
                    </span>
                )}
            </button>

            <div className="text-center space-y-2">
                <p className={`text-2xl font-bold transition-colors duration-500 ${isCompleted ? 'text-cozy-primary' : 'text-cozy-text'}`}>
                    {isCompleted ? 'Nice work!' : habitTitle}
                </p>
                {isCompleted && (
                    <div className="text-sm font-medium text-cozy-text/50 animate-in fade-in slide-in-from-bottom-2 duration-700">
                        See you tomorrow!
                    </div>
                )}
            </div>
        </div>
    )
}
