"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useClerk } from '@clerk/nextjs';
import { HabitTaskList } from '@/components/HabitTaskList';
import { HabitPunchcard } from '@/components/HabitPunchcard';
import { ViewToggle } from './ViewToggle';
import { sidewaysFlashVariants } from '@/utils/animations';

interface DashboardClientProps {
    user: {
        email: string | undefined;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    habits: any[];
    completedHabitIds: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eligibility: any;
    logsByHabit: Record<string, string[]>;
}

export const DashboardClient: React.FC<DashboardClientProps> = ({
    user,
    habits,
    completedHabitIds,
    eligibility,
    logsByHabit,
}) => {
    const [viewMode, setViewMode] = useState<'detailed' | 'simplified'>(() => {
        if (typeof window !== 'undefined') {
            const stored = sessionStorage.getItem('viewToggle');
            if (stored === 'detailed' || stored === 'simplified') return stored;
        }
        return 'simplified';
    });
    const [direction, setDirection] = useState(1);

    const handleViewToggle = (mode: 'detailed' | 'simplified') => {
        setDirection(mode === 'detailed' ? -1 : 1);
        setViewMode(mode);
        sessionStorage.setItem('viewToggle', mode);
    };
    const router = useRouter();
    const { signOut } = useClerk();

    const handleExit = () => {
        // Navigate first so FrozenRouter preserves dashboard content during exit animation,
        // then sign out in the background without triggering its own redirect
        router.push('/login');
        signOut({ redirectUrl: '/login' });
    };

    return (
        <>
            <div className='overflow-y-auto scrollbar-stable custom-scrollbar overflow-x-hidden mb-2'>
                <div className="flex justify-between items-start mb-8 border-b-2 border-black pb-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tighter">HABIT.SYS</h1>
                        <div className="flex items-center gap-6 mt-2">
                            <p className="text-xl">OPERATOR: {user.email?.split('@')[0].toUpperCase()}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleExit}
                            className="btn-retro-secondary text-xs"
                        >
                            [ <span>EXIT</span> ]
                        </button>
                    </div>
                </div>
                {habits && habits.length > 0 ? (
                    <>
                        <HabitTaskList
                            habits={habits}
                            completedHabitIds={completedHabitIds}
                            eligibility={eligibility}
                            viewMode={viewMode}
                            direction={direction}
                        />

                        <AnimatePresence mode="wait" custom={direction}>
                            {viewMode === 'detailed' && (
                                <motion.div
                                    key="detailed-diagnostics"
                                    custom={direction}
                                    variants={sidewaysFlashVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="mt-4 pt-4 border-t-4 border-black border-double"
                                >
                                    <h2 className="text-sm font-bold tracking-[0.2em] bg-black text-white px-2 py-1 mb-4 flex justify-between items-center" id="system-diagnostics-header">
                                        <span>SYSTEM_DIAGNOSTICS</span>
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="punchcards-grid">
                                        {habits.map((habit) => (
                                            <HabitPunchcard
                                                key={habit.id}
                                                id={habit.id}
                                                title={habit.title}
                                                createdAt={habit.created_at}
                                                logs={logsByHabit[habit.id] || []}
                                                frequency={habit.frequency}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-black">
                        <p className="text-2xl mb-8">NO PROTOCOLS INITIALIZED.</p>
                        <Link href="/create-habit" scroll={false} className="btn-retro">
                            + INITIALIZE FIRST PROTOCOL
                        </Link>
                    </div>
                )}


            </div >

            {habits && habits.length > 0 ? (
                <>
                    {/* View Toggle - Sticky at bottom of scroll container */}
                    <div className="flex justify-center sticky -bottom-4 -mb-4 py-2 bg-white ">
                        <ViewToggle viewMode={viewMode} onToggle={handleViewToggle} />
                    </div>
                </>
            ) : null}

        </>
    );
};
