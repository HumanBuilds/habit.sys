'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useToast } from '@/context/ToastContext'
import { steppedEase } from '@/utils/animations'

const toastVariants = {
    initial: {
        opacity: 0,
        y: -20,
        scale: 0.95,
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: steppedEase(6),
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.95,
        transition: {
            duration: 0.3,
            ease: steppedEase(4),
        },
    },
}

export function ToastContainer() {
    const { toasts, dismissToast } = useToast()

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
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
                        <button
                            onClick={() => dismissToast(toast.id)}
                            className="bg-white border-3 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm tracking-wider font-bold whitespace-nowrap"
                        >
                            {toast.message}
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
