'use client'

import { useState, useTransition } from 'react'
import { Lock } from 'lucide-react'
import { redeemShopItem } from '@/app/settings/actions'
import { useToast } from '@/context/ToastContext'
import { soundEngine } from '@/utils/sound-engine'

function CartIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" shapeRendering="crispEdges">
            <path d="M1 1H3L4 8H11L13 3H5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <rect x="5" y="10" width="2" height="2" fill="currentColor" />
            <rect x="9" y="10" width="2" height="2" fill="currentColor" />
        </svg>
    )
}

const SHOP_ITEMS = [
    { id: 'sticker-1bit', name: '1-BIT STICKER', cost: 5, category: 'STICKER' },
    { id: 'colour-swap', name: 'COLOUR SWAP', cost: 15, category: 'THEME' },
    { id: 'sound-pack', name: 'SOUND PACK', cost: 30, category: 'SOUND' },
]

interface ShopViewProps {
    balance: number
    purchasedItemIds: string[]
}

export function ShopView({ balance: initialBalance, purchasedItemIds: initialPurchased }: ShopViewProps) {
    const [balance, setBalance] = useState(initialBalance)
    const [purchased, setPurchased] = useState<Set<string>>(new Set(initialPurchased))
    const [isPending, startTransition] = useTransition()
    const { showToast } = useToast()

    const handleRedeem = (itemId: string, itemName: string, cost: number) => {
        startTransition(async () => {
            const result = await redeemShopItem(itemId)
            if (result.success && result.newBalance !== undefined) {
                setBalance(result.newBalance)
                setPurchased(prev => new Set(prev).add(itemId))
                soundEngine.playConfirm()
                showToast(`ACQUIRED: ${itemName}`, 'info')
            } else if (result.error) {
                showToast(`ERROR: ${result.error}`, 'info')
            }
        })
    }

    return (
        <div className="flex flex-col">
            {/* Balance Display */}
            <div className="pb-4 mb-4 border-b border-black">
                <label className="text-sm font-bold uppercase tracking-widest">SYSTEM CREDITS</label>
                <p className="text-4xl font-bold tracking-tight mt-1">{balance} PTS</p>
                <p className="text-xs tracking-widest opacity-60 mt-1">CHECK INVENTORY TO USE ITEMS</p>
            </div>

            {/* Shop Items */}
            <div className="flex flex-col gap-3">
                {SHOP_ITEMS.map(item => {
                    const owned = purchased.has(item.id)
                    const canAfford = !owned && balance >= item.cost
                    return (
                        <button
                            key={item.id}
                            disabled={owned || !canAfford || isPending}
                            onClick={() => handleRedeem(item.id, item.name, item.cost)}
                            className={`border-2 border-black p-3 flex justify-between items-center text-left transition-colors ${
                                owned
                                    ? 'opacity-60'
                                    : canAfford
                                        ? 'cursor-pointer hover:bg-black hover:text-white'
                                        : 'pointer-events-none'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {!owned && !canAfford && <Lock size={14} strokeWidth={3} />}
                                <div>
                                    <p className="font-bold text-sm tracking-wider">{item.name}</p>
                                    <p className="text-xs tracking-widest opacity-70">{item.category}</p>
                                </div>
                            </div>
                            {owned ? (
                                <span className="text-sm font-bold tracking-wider">PURCHASED</span>
                            ) : (
                                <div className="flex items-center gap-2">
                                    {canAfford && <CartIcon />}
                                    <span className="text-sm font-bold">{item.cost} PTS</span>
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
