'use client'

import { motion } from 'framer-motion'
import React from 'react'

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <>
            <motion.div
                initial={{ top: "-10vh" }}
                animate={{ top: "110vh" }}
                transition={{
                    duration: 0.8,
                    ease: "easeInOut"
                }}
                className="scanline-sweep scanline-flicker"
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {children}
            </motion.div>
        </>
    )
}
