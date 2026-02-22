'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { usePathname } from 'next/navigation'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

const PageTransitionContext = createContext(true)

export function usePageTransitionComplete() {
    return useContext(PageTransitionContext)
}

function FrozenRouter({
    children,
    targetPath,
}: {
    children: React.ReactNode
    targetPath: string
}) {
    const context = useContext(LayoutRouterContext)
    const pathname = usePathname()
    const [frozen, setFrozen] = useState(context)

    // Keep frozen in sync while we're still on the same route.
    useEffect(() => {
        if (pathname === targetPath) {
            setFrozen(context)
        }
    }, [pathname, targetPath, context])

    return (
        <LayoutRouterContext.Provider value={frozen}>
            {children}
        </LayoutRouterContext.Provider>
    )
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [isComplete, setIsComplete] = useState(false)
    const prevPath = useRef(pathname)

    useEffect(() => {
        if (prevPath.current !== pathname) {
            setIsComplete(false)
            prevPath.current = pathname
        }
    }, [pathname])

    const variants = {
        initial: { translateY: '100vh' },
        animate: { translateY: 0 },
        exit: { translateY: '-100vh' },
    }

    return (
        <PageTransitionContext.Provider value={isComplete}>
            <div className="absolute inset-0 overflow-hidden" data-stage>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{
                            duration: 1.6,
                            ease: (t) => Math.floor(t * 12) / 12,
                            delay: 0.2,
                        }}
                        onAnimationComplete={(definition) => {
                            if (definition === 'animate') setIsComplete(true)
                        }}
                        className="absolute inset-0"
                        style={{ willChange: 'transform, opacity' }}
                    >
                        <FrozenRouter targetPath={pathname}>{children}</FrozenRouter>
                    </motion.div>
                </AnimatePresence>
            </div>
        </PageTransitionContext.Provider>
    )
}
