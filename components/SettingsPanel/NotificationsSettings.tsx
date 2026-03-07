'use client';

import { Bell } from 'lucide-react';

export function NotificationsSettings() {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 border-3 border-black flex items-center justify-center mb-6">
                <Bell size={32} strokeWidth={2} />
            </div>
            <p className="text-xl mb-2">NO MESSAGES RECEIVED</p>
            <p className="text-sm max-w-[240px] leading-relaxed">
                CONTINUE EXECUTING PROTOCOLS. STATUS UPDATES WILL ARRIVE.
            </p>
        </div>
    );
}
