'use client';

import { Bell, Award } from 'lucide-react';
import type { NotificationEvent } from '@/app/settings/actions';

const MILESTONE_LABELS: Record<string, string> = {
    streak_3: '3-DAY STREAK',
    streak_10: '10-DAY STREAK',
    streak_30: '30-DAY STREAK',
};

function StickerIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
            <path d="M168,32H88A56.06,56.06,0,0,0,32,88v80a56.06,56.06,0,0,0,56,56h48a8.07,8.07,0,0,0,2.53-.41c26.23-8.75,76.31-58.83,85.06-85.06A8.07,8.07,0,0,0,224,136V88A56.06,56.06,0,0,0,168,32ZM48,168V88A40,40,0,0,1,88,48h80a40,40,0,0,1,40,40v40H184a56.06,56.06,0,0,0-56,56v24H88A40,40,0,0,1,48,168Zm96,35.14V184a40,40,0,0,1,40-40h19.14C191,163.5,163.5,191,144,203.14Z" />
        </svg>
    )
}

function SwapIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
            <path d="M224,48V152a16,16,0,0,1-16,16H99.31l10.35,10.34a8,8,0,0,1-11.32,11.32l-24-24a8,8,0,0,1,0-11.32l24-24a8,8,0,0,1,11.32,11.32L99.31,152H208V48H96v8a8,8,0,0,1-16,0V48A16,16,0,0,1,96,32H208A16,16,0,0,1,224,48ZM168,192a8,8,0,0,0-8,8v8H48V104H156.69l-10.35,10.34a8,8,0,0,0,11.32,11.32l24-24a8,8,0,0,0,0-11.32l-24-24a8,8,0,0,0-11.32,11.32L156.69,88H48a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16H160a16,16,0,0,0,16-16v-8A8,8,0,0,0,168,192Z" />
        </svg>
    )
}

function MusicNoteIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
            <path d="M212.92,17.69a8,8,0,0,0-6.86-1.45l-128,32A8,8,0,0,0,72,56V166.08A36,36,0,1,0,88,196V102.25l112-28v62.83A36,36,0,1,0,216,172V24A8,8,0,0,0,212.92,17.69ZM52,216a20,20,0,1,1,20-20A20,20,0,0,1,52,216ZM88,86.75V62.25l112-28v24.5ZM180,192a20,20,0,1,1,20-20A20,20,0,0,1,180,192Z" />
        </svg>
    )
}

function GameIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
            <path d="M176,112H152a8,8,0,0,1,0-16h24a8,8,0,0,1,0,16ZM104,96H96V88a8,8,0,0,0-16,0v8H72a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0v-8h8a8,8,0,0,0,0-16ZM241.48,200.65a36,36,0,0,1-60.1,14.17,36.26,36.26,0,0,1-8.41-14.42L160.74,160H95.26L83,200.4a36.12,36.12,0,0,1-8.41,14.42,36,36,0,0,1-60.1-14.17,36.59,36.59,0,0,1-1.28-18.27L30.6,77.59A60,60,0,0,1,90,32h76a60,60,0,0,1,59.4,45.59l17.43,104.79A36.59,36.59,0,0,1,241.48,200.65Z" />
        </svg>
    )
}

const ITEM_ICONS: Record<string, () => React.ReactNode> = {
    'sticker-1bit': StickerIcon,
    'colour-swap': SwapIcon,
    'sound-pack': MusicNoteIcon,
    'bonus-track': MusicNoteIcon,
    'secondary-colour': SwapIcon,
    'mini-game': GameIcon,
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
                                (() => {
                                    const itemId = (event.metadata as { item_id?: string })?.item_id || '';
                                    const Icon = ITEM_ICONS[itemId];
                                    return Icon ? <Icon /> : <Award size={20} strokeWidth={2.5} />;
                                })()
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
