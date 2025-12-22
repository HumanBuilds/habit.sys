'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { usePathname } from 'next/navigation';
import { useContext, useState } from 'react';
function FrozenRouter({ children }: { children: React.ReactNode }) {
    const context = useContext(LayoutRouterContext);
    const [frozen] = useState(context);

    return (
        <LayoutRouterContext.Provider value={frozen}>
            {children}
        </LayoutRouterContext.Provider>
    );
}
export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence
            mode="popLayout"
            onExitComplete={() => {
                window.scrollTo(0, 0);
            }}
        >
            <motion.div
                key={pathname}
                initial={{ y: "100vh", opacity: 1 }}
                animate={{ y: "0", opacity: 1 }}
                exit={{ y: "-100vh", opacity: 1 }}
                transition={{
                    duration: 1.6,
                    ease: (t) => Math.floor(t * 12) / 12,
                    delay: 0.2
                }}
                onAnimationStart={() => {
                    document.documentElement.style.overflow = 'hidden';
                    document.body.classList.add('transitioning');
                }}
                onAnimationComplete={() => {
                    document.documentElement.style.overflow = '';
                    document.body.classList.remove('transitioning');
                }}
                className="min-h-screen w-full relative z-10"
                style={{ willChange: 'transform, opacity' }}
            >
                <FrozenRouter>{children}</FrozenRouter>
            </motion.div>
        </AnimatePresence>
    );
}