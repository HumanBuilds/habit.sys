'use client';

import { Package } from 'lucide-react';

export function InventorySettings() {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="relative w-16 h-16 border-3 border-black flex items-center justify-center mb-6">
                <Package size={32} strokeWidth={2} />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-2 border-black bg-white" />
            </div>
            <p className="text-xl mb-2">INVENTORY EMPTY</p>
            <p className="text-sm max-w-[240px] leading-relaxed">
                ACQUIRED ITEMS AND REWARDS WILL APPEAR HERE. VISIT THE SHOP TO BROWSE.
            </p>
        </div>
    );
}
