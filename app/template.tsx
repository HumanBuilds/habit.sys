'use client'

import { motion } from 'framer-motion'
import React from 'react'

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <>
            <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1] // easeOutExpo
                }}
            >
                {children}
            </motion.div>
        </>
    )
}
