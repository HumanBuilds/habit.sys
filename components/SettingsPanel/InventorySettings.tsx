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
            <p className="text-sm opacity-60 max-w-[240px] leading-relaxed">
                ACQUIRED ITEMS AND REWARDS WILL APPEAR HERE. VISIT THE SHOP TO BROWSE.
            </p>
            <div className="mt-8 border-2 border-black border-dashed p-3 opacity-40">
                <div className="grid grid-cols-3 gap-2">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-6 h-6 border border-black opacity-30" />
                    ))}
                </div>
            </div>
        </div>
    );
}
