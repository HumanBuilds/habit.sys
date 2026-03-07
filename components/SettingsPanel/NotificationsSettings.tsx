'use client';

import { Bell, Award, ShoppingBag } from 'lucide-react';
import type { NotificationEvent } from '@/app/settings/actions';

const MILESTONE_LABELS: Record<string, string> = {
    streak_3: '3-DAY STREAK',
    streak_10: '10-DAY STREAK',
    streak_30: '30-DAY STREAK',
};

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(2);
    return `${day}.${month}.${year}`;
}

interface NotificationsSettingsProps {
    events: NotificationEvent[];
}

export function NotificationsSettings({ events }: NotificationsSettingsProps) {
    if (events.length === 0) {
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

    return (
        <div className="flex flex-col gap-2">
            {events.map(event => {
                const isMilestone = event.type.startsWith('streak_');
                const isPurchase = event.type === 'purchase';
                const itemName = (event.metadata as { item_name?: string })?.item_name || 'ITEM';

                let label: string;
                let subtitle: string;
                let badge: string;

                if (isMilestone) {
                    label = MILESTONE_LABELS[event.type] || event.type.toUpperCase();
                    subtitle = event.habit_title?.toUpperCase() || 'PROTOCOL';
                    badge = `+${event.amount} PTS`;
                } else if (isPurchase) {
                    label = `ACQUIRED: ${itemName}`;
                    subtitle = 'PREMIUM PURCHASE';
                    badge = 'PAID';
                } else {
                    label = `ACQUIRED: ${itemName}`;
                    subtitle = `${Math.abs(event.amount)} PTS REDEEMED`;
                    badge = `${Math.abs(event.amount)} PTS`;
                }

                return (
                    <div
                        key={event.id}
                        className="border-2 border-black p-3 flex items-center gap-3"
                    >
                        <div className="w-10 h-10 border-2 border-black flex items-center justify-center shrink-0">
                            {isMilestone ? (
                                <Award size={20} strokeWidth={2.5} />
                            ) : (
                                <ShoppingBag size={20} strokeWidth={2.5} />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm tracking-wider truncate">{label}</p>
                            <p className="text-xs tracking-widest opacity-60 truncate">{subtitle}</p>
                        </div>
                        <div className="shrink-0 text-right">
                            <p className="font-bold text-sm tracking-tight">{badge}</p>
                            <p className="text-xs tracking-widest opacity-60">{formatDate(event.created_at)}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
