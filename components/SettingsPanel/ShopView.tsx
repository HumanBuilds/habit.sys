'use client'

import { Lock } from 'lucide-react'

const SHOP_ITEMS = [
    { id: 'sticker-1bit', name: '1-BIT STICKER', cost: 5, category: 'STICKER' },
    { id: 'colour-swap', name: 'COLOUR SWAP', cost: 15, category: 'THEME' },
    { id: 'sound-pack', name: 'SOUND PACK', cost: 30, category: 'SOUND' },
]

interface ShopViewProps {
    balance: number
}

export function ShopView({ balance }: ShopViewProps) {
    return (
        <div className="flex flex-col">
            {/* Balance Display */}
            <div className="pb-4 mb-4 border-b border-black">
                <label className="text-sm font-bold uppercase tracking-widest">SYSTEM CREDITS</label>
                <p className="text-4xl font-bold tracking-tight mt-1">{balance} PTS</p>
            </div>

            {/* Shop Items */}
            <div className="flex flex-col gap-3">
                {SHOP_ITEMS.map(item => (
                    <div
                        key={item.id}
                        className="border-2 border-black p-3 flex justify-between items-center opacity-60"
                    >
                        <div className="flex items-center gap-3">
                            <Lock size={14} strokeWidth={3} />
                            <div>
                                <p className="font-bold text-sm tracking-wider">{item.name}</p>
                                <p className="text-xs tracking-widest opacity-70">{item.category}</p>
                            </div>
                        </div>
                        <span className="text-sm font-bold">{item.cost} PTS</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
