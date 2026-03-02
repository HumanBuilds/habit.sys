'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { sidewaysFlashVariants } from '@/utils/animations';
import { SettingsMenu } from './SettingsMenu';
import { SoundSettings } from './SoundSettings';

type SettingsPage = 'menu' | 'sound' | 'account' | 'shop' | 'notifications' | 'inventory';

const pageTitles: Record<SettingsPage, string> = {
    menu: 'SETTINGS',
    sound: 'SOUND',
    account: 'ACCOUNT',
    shop: 'SHOP',
    notifications: 'NOTIFICATIONS',
    inventory: 'INVENTORY',
};

interface SettingsClientProps {
    isAuthenticated: boolean;
}

function ComingSoon() {
    return (
        <div className="text-center py-8">
            <p className="text-sm opacity-60">COMING SOON</p>
        </div>
    );
}

export function SettingsClient({ isAuthenticated }: SettingsClientProps) {
    const [activePage, setActivePage] = useState<SettingsPage>('menu');
    const [direction, setDirection] = useState(1);
    const router = useRouter();

    const navigateTo = (page: SettingsPage) => {
        setDirection(1);
        setActivePage(page);
    };

    const goBack = () => {
        setDirection(-1);
        setActivePage('menu');
    };

    const handleExit = () => {
        router.back();
    };

    const renderPage = () => {
        switch (activePage) {
            case 'menu':
                return (
                    <SettingsMenu
                        isAuthenticated={isAuthenticated}
                        onNavigate={navigateTo}
                    />
                );
            case 'sound':
                return <SoundSettings />;
            case 'account':
                return <ComingSoon />;
            case 'shop':
                return <ComingSoon />;
            case 'notifications':
                return <ComingSoon />;
            case 'inventory':
                return <ComingSoon />;
        }
    };

    return (
        <div className="overflow-y-auto scrollbar-stable custom-scrollbar overflow-x-hidden mb-2">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                    key={activePage}
                    custom={direction}
                    variants={sidewaysFlashVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4">
                        <h1 className="text-4xl font-bold tracking-tighter">{pageTitles[activePage]}</h1>
                        {activePage === 'menu' ? (
                            <button
                                onClick={handleExit}
                                className="btn-retro-secondary text-xs"
                            >
                                [ <span>EXIT</span> ]
                            </button>
                        ) : (
                            <button
                                onClick={goBack}
                                className="btn-retro-secondary text-xs"
                            >
                                [ <span>BACK</span> ]
                            </button>
                        )}
                    </div>
                    {renderPage()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
