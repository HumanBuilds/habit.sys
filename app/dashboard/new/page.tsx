'use client'

import { useActionState, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createHabit } from './actions'
import { ArrowLeft, ArrowRight, Check, Leaf } from 'lucide-react'

const steps = [
    {
        id: 'identity',
        title: 'Who do you want to become?',
        subtitle: 'Every action is a vote for the type of person you wish to become.',
        field: 'identity',
        placeholder: 'e.g., A runner, A writer, A healthy eater',
        prefix: 'I want to become a...'
    },
    {
        id: 'behavior',
        title: 'What is the core habit?',
        subtitle: 'Make it specific. Avoid vague goals.',
        field: 'title',
        placeholder: 'e.g., Run 1 mile, Write 500 words, Eat an apple',
        prefix: 'I will...'
    },
    {
        id: 'cue',
        title: 'When will you do it?',
        subtitle: 'Implementation intention: I will [BEHAVIOR] at [TIME] in [LOCATION].',
        field: 'cue',
        placeholder: 'e.g., After I brush my teeth, At 7am in the kitchen',
        prefix: 'Time / Location...'
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

    const [state, formAction, isPending] = useActionState(createHabit, initialState)

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
        <div className="min-h-screen bg-cozy-bg flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="mb-12 flex items-center justify-between px-2">
                    <div className="flex gap-2">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-2 w-12 rounded-full transition-colors duration-500 ${i <= currentStep ? 'bg-cozy-primary' : 'bg-cozy-muted'}`}
                            />
                        ))}
                    </div>
                    <span className="text-sm font-medium text-cozy-text/50">Step {currentStep + 1} of {steps.length}</span>
                </div>

                <form action={formAction}>
                    {/* Hidden inputs to submit all data at the end */}
                    <input type="hidden" name="identity" value={formData.identity} />
                    <input type="hidden" name="title" value={formData.title} />
                    <input type="hidden" name="cue" value={formData.cue} />

                    <div className="relative min-h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <motion.h1
                                        className="text-4xl font-bold text-cozy-text tracking-tight"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        {step.title}
                                    </motion.h1>
                                    <motion.p
                                        className="text-xl text-cozy-text/60"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {step.subtitle}
                                    </motion.p>
                                </div>

                                <motion.div
                                    className="space-y-4"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <label className="text-sm font-bold uppercase tracking-wider text-cozy-primary">{step.prefix}</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        value={formData[step.field as keyof typeof formData]}
                                        onChange={(e) => setFormData({ ...formData, [step.field]: e.target.value })}
                                        placeholder={step.placeholder}
                                        className="w-full bg-transparent border-b-2 border-cozy-muted py-4 text-3xl font-medium text-cozy-text placeholder:text-cozy-text/20 focus:outline-none focus:border-cozy-primary transition-colors"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                if (!isLastStep) handleNext()
                                            }
                                        }}
                                    />
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-between items-center mt-8">
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-cozy-text/60 hover:bg-cozy-muted'}`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back
                        </button>

                        {isLastStep ? (
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex items-center gap-2 bg-cozy-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-cozy-primary/20"
                            >
                                {isPending ? 'Planting...' : 'Plant Seed'}
                                <Leaf className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={!formData[step.field as keyof typeof formData]}
                                className="flex items-center gap-2 bg-cozy-text text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {state?.error && (
                        <div className="mt-4 p-4 text-center text-red-500 bg-red-50 rounded-xl">
                            {state.error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}
