'use client';

import { Volume2, User, ShoppingBag, Bell, Package } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type SettingsPage = 'menu' | 'sound' | 'account' | 'shop' | 'notifications' | 'inventory';

interface MenuItem {
    label: string;
    page: SettingsPage;
    icon: LucideIcon;
    requiresAuth: boolean;
}

const menuItems: MenuItem[] = [
    { label: 'SOUND', page: 'sound', icon: Volume2, requiresAuth: false },
    { label: 'ACCOUNT', page: 'account', icon: User, requiresAuth: true },
    { label: 'SHOP', page: 'shop', icon: ShoppingBag, requiresAuth: true },
    { label: 'NOTIFICATIONS', page: 'notifications', icon: Bell, requiresAuth: true },
    { label: 'INVENTORY', page: 'inventory', icon: Package, requiresAuth: true },
];

interface SettingsMenuProps {
    isAuthenticated: boolean;
    onNavigate: (page: SettingsPage) => void;
}

export function SettingsMenu({ isAuthenticated, onNavigate }: SettingsMenuProps) {
    const visibleItems = menuItems.filter(
        item => !item.requiresAuth || isAuthenticated
    );

    return (
        <div className="flex flex-col">
            {visibleItems.map((item, i) => {
                const Icon = item.icon;
                return (
                    <button
                        key={item.page}
                        onClick={() => onNavigate(item.page)}
                        className={`w-full flex items-center gap-3 py-3 px-3 text-xl text-left cursor-pointer hover:bg-black hover:text-white transition-colors ${
                            i < visibleItems.length - 1 ? 'border-b border-black' : ''
                        }`}
                    >
                        <Icon size={18} strokeWidth={2.5} />
                        <span className="flex-1">{item.label}</span>
                        <span className="text-2xl font-bold">&rarr;</span>
                    </button>
                );
            })}
        </div>
    );
}
