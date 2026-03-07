'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useToast } from '@/context/ToastContext'
import { steppedEase } from '@/utils/animations'

const toastTransition = {
    duration: 0.5,
    ease: steppedEase(8),
}

const toastVariants = {
    initial: {
        x: '100%',
        opacity: 0,
    },
    animate: {
        x: 0,
        opacity: 1,
        transition: toastTransition,
    },
    exit: {
        x: '100%',
        opacity: 0,
        transition: toastTransition,
    },
}

export function ToastContainer() {
    const { toasts, dismissToast } = useToast()

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map(toast => (
                    <motion.div
                        key={toast.id}
                        variants={toastVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="pointer-events-auto"
                    >
                        {toast.type === 'custom' && toast.content ? (
                            <div className="bg-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                {toast.content}
                            </div>
                        ) : (
                            <button
                                onClick={() => dismissToast(toast.id)}
                                className="bg-white border-3 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm tracking-wider font-bold whitespace-nowrap"
                            >
                                {toast.message}
                            </button>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
