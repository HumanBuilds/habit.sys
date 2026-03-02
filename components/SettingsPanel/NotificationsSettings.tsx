'use client';

import { Bell } from 'lucide-react';

export function NotificationsSettings() {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 border-3 border-black flex items-center justify-center mb-6">
                <Bell size={32} strokeWidth={2} />
            </div>
            <p className="text-xl mb-2">NO SIGNALS CONFIGURED</p>
            <p className="text-sm opacity-60 max-w-[240px] leading-relaxed">
                NOTIFICATION ROUTING WILL BE AVAILABLE IN A FUTURE SYSTEM UPDATE.
            </p>
            <div className="mt-8 flex gap-2 items-center opacity-40">
                <div className="w-2 h-2 bg-black" />
                <div className="w-2 h-2 bg-black" />
                <div className="w-2 h-2 bg-black" />
            </div>
        </div>
    );
}
