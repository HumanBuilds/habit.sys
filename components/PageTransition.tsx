'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence
            mode="wait"
            onExitComplete={() => {
                window.scrollTo(0, 0);
            }}
        >
            <motion.div
                key={pathname}
                initial={{ y: "100%", opacity: 1 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 1 }}
                transition={{
                    duration: 1,
                    ease: [0.5, 1, 0.3, 1], // easeOutExpo
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
                {children}
            </motion.div>
        </AnimatePresence>
    );
}