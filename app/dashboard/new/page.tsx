'use client'

import { useActionState, useState } from 'react'
import { initializeProtocol } from './actions'
import { Window } from '@/components/Window'
import { ProgressBar } from '@/components/ProgressBar'

const steps = [
    {
        id: 'identity',
        title: 'IDENTITY PROTOCOL',
        subtitle: 'WHO DO YOU WANT TO BECOME?',
        field: 'identity',
        placeholder: 'E.G., A RUNNER, A WRITER',
        prefix: 'I WANT TO BECOME A...'
    },
    {
        id: 'behavior',
        title: 'BEHAVIOR SPECIFICATION',
        subtitle: 'WHAT IS THE CORE HABIT?',
        field: 'title',
        placeholder: 'E.G., RUN 1 MILE, WRITE 500 WORDS',
        prefix: 'I WILL...'
    },
    {
        id: 'cue',
        title: 'CUE INITIALIZATION',
        subtitle: 'WHEN WILL YOU DO IT?',
        field: 'cue',
        placeholder: 'E.G., AFTER I BRUSH MY TEETH',
        prefix: 'TIME / LOCATION...'
    }
]

const initialState = {
    error: '',
}

export default function NewHabitPage() {
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState({
        identity: '',
        title: '',
        cue: ''
    })

    const [state, formAction, isPending] = useActionState(initializeProtocol, initialState)

    const step = steps[currentStep]
    const isLastStep = currentStep === steps.length - 1

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(c => c + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(c => c - 1)
        }
    }

    return (
        <div className="min-h-screen bg-white dither-50 flex items-center justify-center p-6">
            <Window title="NEW_HABIT_WIZARD.EXE" className="w-full max-w-2xl">
                <div className="mb-8">
                    <ProgressBar currentStep={currentStep + 1} totalSteps={steps.length} />
                    <div className="flex justify-between font-bold text-sm tracking-widest">
                        <span>STEP {currentStep + 1} / {steps.length}</span>
                        <span>STATUS: {isPending ? 'PROCESSING...' : 'AWAITING INPUT'}</span>
                    </div>
                </div>

                <form action={formAction} className="space-y-8">
                    <input type="hidden" name="identity" value={formData.identity} />
                    <input type="hidden" name="title" value={formData.title} />
                    <input type="hidden" name="cue" value={formData.cue} />

                    <div className="min-h-[250px] border-2 border-black p-6 bg-white shadow-[4px_4px_0_0_#000]">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold tracking-tighter border-b-2 border-black pb-2">
                                {step.title}
                            </h1>
                            <p className="text-lg font-bold">
                                {step.subtitle}
                            </p>
                        </div>

                        <div className="mt-8 space-y-2">
                            <label className="text-sm font-bold uppercase tracking-widest">{step.prefix}</label>
                            <input
                                type="text"
                                autoFocus
                                value={formData[step.field as keyof typeof formData]}
                                onChange={(e) => setFormData({ ...formData, [step.field]: e.target.value.toUpperCase() })}
                                placeholder={step.placeholder}
                                className="input-retro w-full text-2xl"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        if (!isLastStep && formData[step.field as keyof typeof formData]) handleNext()
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-12">
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className={`btn-retro ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            [ BACK ]
                        </button>

                        {isLastStep ? (
                            <button
                                type="submit"
                                disabled={isPending || !formData[step.field as keyof typeof formData]}
                                className="btn-retro inverted"
                            >
                                {isPending ? 'PLANTING...' : '[ PLANT SEED ]'}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={!formData[step.field as keyof typeof formData]}
                                className="btn-retro"
                            >
                                [ NEXT ]
                            </button>
                        )}
                    </div>

                    {state?.error && (
                        <div className="mt-6 p-4 border-2 border-black bg-black text-white font-bold text-center">
                            ERROR: {state.error.toUpperCase()}
                        </div>
                    )}
                </form>
            </Window>
        </div>
    )
}
