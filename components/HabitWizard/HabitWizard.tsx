'use client'

import { useActionState, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ProgressBar } from '@/components/ProgressBar'
import Link from 'next/link'
import { sidewaysFlashVariants } from '@/utils/animations'
import { usePageTransitionComplete } from '@/components/PageTransition'

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

const steps = [
    {
        id: 'identity',
        title: 'IDENTITY PROTOCOL',
        subtitle: 'WHO DO YOU WANT TO BECOME?',
        field: 'identity',
        placeholder: 'E.G., A RUNNER, A WRITER',
        prefix: 'I WANT TO BECOME A...',
        type: 'text'
    },
    {
        id: 'behavior',
        title: 'BEHAVIOR SPECIFICATION',
        subtitle: 'WHAT IS THE CORE HABIT?',
        field: 'title',
        placeholder: 'E.G., RUN 1 MILE, WRITE 500 WORDS',
        prefix: 'I WILL...',
        type: 'text'
    },
    {
        id: 'cue',
        title: 'CUE INITIALIZATION',
        subtitle: 'WHEN WILL YOU DO IT?',
        field: 'cue',
        placeholder: 'E.G., AFTER I BRUSH MY TEETH',
        prefix: 'TIME / LOCATION...',
        type: 'text'
    },
    {
        id: 'frequency',
        title: 'FREQUENCY PROTOCOL',
        subtitle: 'WHICH CYCLES TO ACTIVATE?',
        field: 'frequency',
        placeholder: '',
        prefix: 'ACTIVE CYCLES:',
        type: 'frequency'
    }
]

const initialState = {
    error: '',
}

type HabitData = {
    identity: string;
    title: string;
    cue: string;
    frequency: string[];
}

interface HabitWizardProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: (prevState: any, formData: FormData) => Promise<any>;
    initialData?: HabitData;
    id?: string;
    mode: 'create' | 'edit';
}

export function HabitWizard({ action, initialData, id, mode }: HabitWizardProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [displayStep, setDisplayStep] = useState(0)
    const [direction, setDirection] = useState(1)
    const [formData, setFormData] = useState<HabitData>({
        identity: initialData?.identity || '',
        title: initialData?.title || '',
        cue: initialData?.cue || '',
        frequency: initialData?.frequency || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] // Default: All days
    })
    const [validationError, setValidationError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const transitionComplete = usePageTransitionComplete()
    const router = useRouter()

    const [state, formAction, isPending] = useActionState(action, initialState)

    const step = steps[currentStep]
    const isLastStep = currentStep === steps.length - 1

    // Navigate client-side on success so the wizard holds its state during exit animation
    useEffect(() => {
        if (state?.success) {
            router.push('/dashboard')
        }
    }, [state, router])

    const focusInput = () => {
        if (transitionComplete && step.type === 'text') {
            inputRef.current?.focus()
        }
    }

    // Focus when page transition completes (initial navigation)
    useEffect(() => {
        if (transitionComplete) focusInput()
    }, [transitionComplete])

    const headerTitle = mode === 'create' ? "INITIALIZE_PROTOCOL" : "MODIFY_PROTOCOL"
    const submitLabel = mode === 'create' ? "INITIALIZE MODULE" : "UPDATE PROTOCOL"
    const loadingLabel = mode === 'create' ? "INITIALIZING..." : "UPDATING..."

    // Helper validation function (moved inside or could be imported)
    const isInputInvalid = (value: string) => !value || value.trim().length === 0;

    const handleNext = () => {
        const currentValue = formData[step.field as keyof typeof formData]

        if (step.id === 'frequency') {
            if ((currentValue as string[]).length === 0) {
                setValidationError('AT_LEAST_ONE_CYCLE_REQUIRED')
                return
            }
        } else if (isInputInvalid(currentValue as string)) {
            setValidationError('INPUT_REQUIRED.SYS')
            return
        }

        if (currentStep < steps.length - 1) {
            setValidationError(null)
            setDirection(1)
            setCurrentStep(c => c + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setValidationError(null)
            setDirection(-1)
            setCurrentStep(c => c - 1)
        }
    }

    const toggleDay = (day: string) => {
        // Convert display day (MON) to value day (Mon)
        const valueDay = day.charAt(0) + day.slice(1).toLowerCase();

        const currentDays = formData.frequency;
        let newDays;

        if (currentDays.includes(valueDay)) {
            newDays = currentDays.filter(d => d !== valueDay);
        } else {
            newDays = [...currentDays, valueDay];
        }

        setFormData({ ...formData, frequency: newDays });
        if (validationError) setValidationError(null);
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-4">
                <span className="text-xl font-bold tracking-widest">{headerTitle}</span>
                <Link href="/dashboard" scroll={false} className="btn-retro-secondary">
                    [ <span >EXIT</span> ]
                </Link>
            </div>

            <div className="mb-8">
                <ProgressBar currentStep={displayStep + 1} totalSteps={steps.length} />
                <div className="flex justify-between font-bold text-sm tracking-widest">
                    <span>STEP {displayStep + 1} / {steps.length}</span>
                    <span>STATUS: {isPending ? 'PROCESSING...' : 'AWAITING INPUT'}</span>
                </div>
            </div>

            <form
                action={formAction}

                onSubmit={(e) => {
                    const currentValue = formData[step.field as keyof typeof formData]
                    let isValid = true;

                    if (step.id === 'frequency') {
                        if ((currentValue as string[]).length === 0) {
                            setValidationError('AT_LEAST_ONE_CYCLE_REQUIRED')
                            isValid = false;
                        }
                    } else if (isInputInvalid(currentValue as string)) {
                        setValidationError('INPUT_REQUIRED.SYS')
                        isValid = false;
                    }

                    if (!isValid) {
                        e.preventDefault()
                        return
                    }

                    if (!isLastStep) {
                        // If not the last step, prevent form submission (server action)
                        // and move to next step manually instead.
                        e.preventDefault()
                        handleNext()
                    }
                }}
            >
                {id && <input type="hidden" name="id" value={id} />}
                <input type="hidden" name="identity" value={formData.identity} />
                <input type="hidden" name="title" value={formData.title} />
                <input type="hidden" name="cue" value={formData.cue} />
                <input type="hidden" name="frequency" value={JSON.stringify(formData.frequency)} />

                <div className="overflow-hidden">
                    <AnimatePresence mode="wait" initial={false} custom={direction}>
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            variants={sidewaysFlashVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            onAnimationComplete={(def) => {
                                if (def === 'animate') {
                                    setDisplayStep(currentStep)
                                    focusInput()
                                }
                            }}
                            className=" border-2 border-black p-6 bg-white shadow-[4px_4px_0_0_#000]"
                        >
                            <div className="space-y-4">
                                <h1 className="text-3xl font-bold tracking-tighter border-b-2 border-black pb-2">
                                    {step.title}
                                </h1>
                                <p className="text-lg font-bold">
                                    {step.subtitle}
                                </p>
                            </div>

                            <div className="mt-4 space-y-2">
                                <label className="text-sm font-bold uppercase tracking-widest">{step.prefix}{step.type === 'frequency' && ` ${formData.frequency.length} / 7`}</label>

                                {step.type === 'frequency' ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                                        {DAYS.map((day) => {
                                            const valueDay = day.charAt(0) + day.slice(1).toLowerCase();
                                            const isSelected = formData.frequency.includes(valueDay);
                                            return (
                                                <div
                                                    key={day}
                                                    className="flex items-center gap-4 cursor-pointer group select-none"
                                                    onClick={() => toggleDay(day)}
                                                >
                                                    <div className="relative w-8 h-8 border-3 border-black bg-white flex items-center justify-center shrink-0 transition-transform active:scale-95">
                                                        <AnimatePresence>
                                                            {isSelected && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 0.8 }}
                                                                    exit={{ scale: 0 }}
                                                                    className="w-full h-full bg-black"
                                                                />
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                    <span className={`text-xl font-bold tracking-tighter ${isSelected ? 'text-black' : 'text-black/40'} transition-colors`}>
                                                        {day}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        ref={inputRef}
                                        value={formData[step.field as keyof typeof formData] as string}
                                        onChange={(e) => {
                                            setFormData({ ...formData, [step.field]: e.target.value.toUpperCase() })
                                            if (validationError) setValidationError(null)
                                        }}
                                        placeholder={step.placeholder}
                                        className="input-retro w-full text-2xl"
                                    />
                                )}

                                {validationError && (
                                    <div className="text-red-600 font-bold text-sm mt-1 animate-pulse">
                                        &gt;&gt; ERROR: {validationError}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex justify-between items-center mt-4">
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
                            key="submit-btn"
                            type="submit"
                            disabled={isPending}
                            className="btn-retro inverted"
                        >
                            {isPending ? loadingLabel : `[ ${submitLabel} ]`}
                        </button>
                    ) : (
                        <button
                            key="next-btn"
                            type="button"
                            onClick={handleNext}
                            className="btn-retro"
                        >
                            [ NEXT ]
                        </button>
                    )}
                </div>

                {
                    state?.error && (
                        <div className="mt-6 p-4 border-2 border-black bg-black text-white font-bold text-center">
                            ERROR: {state.error.toUpperCase()}
                        </div>
                    )
                }
            </form>
        </>
    )
}
