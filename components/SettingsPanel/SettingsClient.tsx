'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { sidewaysFlashVariants } from '@/utils/animations';
import { SettingsMenu } from './SettingsMenu';
import { SoundSettings } from './SoundSettings';
import { AccountSettings } from './AccountSettings';
import { NotificationsSettings } from './NotificationsSettings';
import { InventorySettings } from './InventorySettings';
import { ShopView } from './ShopView';
import { SnakeGame } from './SnakeGame';
import type { NotificationEvent } from '@/app/settings/actions';

type SettingsPage = 'menu' | 'sound' | 'account' | 'shop' | 'notifications' | 'inventory' | 'snake';

const pageTitles: Record<SettingsPage, string> = {
    menu: 'SETTINGS',
    sound: 'SOUND',
    account: 'ACCOUNT',
    shop: 'SHOP',
    notifications: 'NOTIFICATIONS',
    inventory: 'INVENTORY',
    snake: 'SNAKE.SYS',
};

const pageParent: Partial<Record<SettingsPage, SettingsPage>> = {
    snake: 'inventory',
};

interface UserData {
    email: string | null;
    alias: string | null;
    hasPassword: boolean;
}

interface SettingsClientProps {
    isAuthenticated: boolean;
    userData: UserData | null;
    pointsBalance: number;
    purchasedItemIds: string[];
    notificationEvents: NotificationEvent[];
    stickerGrid: boolean[] | null;
    justPurchased?: string;
}

export function SettingsClient({ isAuthenticated, userData, pointsBalance, purchasedItemIds, notificationEvents, stickerGrid, justPurchased }: SettingsClientProps) {
    const [activePage, setActivePage] = useState<SettingsPage>('menu');
    const [direction, setDirection] = useState(1);
    const router = useRouter();
    const { showToast } = useToast();

    useEffect(() => {
        if (justPurchased) {
            const names: Record<string, string> = {
                'bonus-track': 'THE LITTLE BROTH',
                'secondary-colour': 'SECONDARY COLOUR',
                'mini-game': 'MINI GAME',
            };
            const name = names[justPurchased];
            if (name) {
                showToast(`ACQUIRED: ${name}`, 'milestone');
            }
            window.history.replaceState({}, '', '/settings');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const navigateTo = (page: SettingsPage) => {
        setDirection(1);
        setActivePage(page);
    };

    const goBack = () => {
        setDirection(-1);
        setActivePage(pageParent[activePage] || 'menu');
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
                return <AccountSettings userData={userData} />;
            case 'shop':
                return <ShopView balance={pointsBalance} purchasedItemIds={purchasedItemIds} />;
            case 'notifications':
                return <NotificationsSettings events={notificationEvents} />;
            case 'inventory':
                return <InventorySettings purchasedItemIds={purchasedItemIds} stickerGrid={stickerGrid} onNavigate={(page) => navigateTo(page as SettingsPage)} />;
            case 'snake':
                return <SnakeGame />;
        }
    };

    return (
        <div className="overflow-y-auto scrollbar-stable custom-scrollbar overflow-x-hidden mb-2 pb-1">
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
