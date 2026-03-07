'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { MusicPlayerContent, MUSIC_TOAST_ID } from '@/components/MusicPlayerToast';
import { sidewaysFlashVariants } from '@/utils/animations';
import { StickerEditor } from './StickerEditor';

function StickerIcon() {
    return (
        <svg width="48" height="48" viewBox="0 0 256 256" fill="currentColor">
            <path d="M168,32H88A56.06,56.06,0,0,0,32,88v80a56.06,56.06,0,0,0,56,56h48a8.07,8.07,0,0,0,2.53-.41c26.23-8.75,76.31-58.83,85.06-85.06A8.07,8.07,0,0,0,224,136V88A56.06,56.06,0,0,0,168,32ZM48,168V88A40,40,0,0,1,88,48h80a40,40,0,0,1,40,40v40H184a56.06,56.06,0,0,0-56,56v24H88A40,40,0,0,1,48,168Zm96,35.14V184a40,40,0,0,1,40-40h19.14C191,163.5,163.5,191,144,203.14Z" />
        </svg>
    )
}

function SwapIcon() {
    return (
        <svg width="48" height="48" viewBox="0 0 256 256" fill="currentColor">
            <path d="M224,48V152a16,16,0,0,1-16,16H99.31l10.35,10.34a8,8,0,0,1-11.32,11.32l-24-24a8,8,0,0,1,0-11.32l24-24a8,8,0,0,1,11.32,11.32L99.31,152H208V48H96v8a8,8,0,0,1-16,0V48A16,16,0,0,1,96,32H208A16,16,0,0,1,224,48ZM168,192a8,8,0,0,0-8,8v8H48V104H156.69l-10.35,10.34a8,8,0,0,0,11.32,11.32l24-24a8,8,0,0,0,0-11.32l-24-24a8,8,0,0,0-11.32,11.32L156.69,88H48a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16H160a16,16,0,0,0,16-16v-8A8,8,0,0,0,168,192Z" />
        </svg>
    )
}

function SpeakerIcon() {
    return (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" shapeRendering="crispEdges">
            {/* Speaker body */}
            <rect x="4" y="16" width="8" height="16" fill="currentColor" />
            <rect x="12" y="12" width="4" height="24" fill="currentColor" />
            <rect x="16" y="8" width="4" height="32" fill="currentColor" />
            <rect x="20" y="4" width="4" height="40" fill="currentColor" />
            {/* Sound waves */}
            <rect x="28" y="20" width="4" height="8" fill="currentColor" />
            <rect x="34" y="14" width="4" height="20" fill="currentColor" />
            <rect x="40" y="8" width="4" height="32" fill="currentColor" />
        </svg>
    )
}

const THEME_STORAGE_KEY = 'habit-sys-primary-colour';
const DEFAULT_COLOUR = '#000000';

const COLOUR_PALETTE = [
    { hex: '#000000', name: 'BLACK' },
    { hex: '#1a1a2e', name: 'MIDNIGHT' },
    { hex: '#0f3460', name: 'ROYAL' },
    { hex: '#023e8a', name: 'OCEAN' },
    { hex: '#3a0ca3', name: 'INDIGO' },
    { hex: '#533483', name: 'PURPLE' },
    { hex: '#c9184a', name: 'CRIMSON' },
    { hex: '#b80000', name: 'DARK RED' },
    { hex: '#e94560', name: 'CORAL' },
    { hex: '#ff6600', name: 'ORANGE' },
    { hex: '#6b4226', name: 'BROWN' },
    { hex: '#4a4e69', name: 'SLATE' },
    { hex: '#1b4332', name: 'FOREST' },
    { hex: '#2d6a4f', name: 'SAGE' },
    { hex: '#065f46', name: 'TEAL' },
    { hex: '#374151', name: 'GRAPHITE' },
];

function applyThemeColour(hex: string) {
    document.documentElement.style.setProperty('--color-black', hex);
}

const INVENTORY_ITEMS: Record<string, { name: string; icon: () => ReactNode }> = {
    'sticker-1bit': { name: '1-BIT STICKER', icon: StickerIcon },
    'colour-swap': { name: 'COLOUR SWAP', icon: SwapIcon },
    'sound-pack': { name: 'SOUND PACK', icon: SpeakerIcon },
}

function CustomStickerIcon({ grid }: { grid: boolean[] }) {
    return (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" shapeRendering="crispEdges">
            {grid.map((filled, i) => {
                if (!filled) return null
                const x = i % 48
                const y = Math.floor(i / 48)
                return <rect key={i} x={x} y={y} width="1" height="1" fill="currentColor" />
            })}
        </svg>
    )
}

interface InventorySettingsProps {
    purchasedItemIds: string[];
    stickerGrid: boolean[] | null;
}

export function InventorySettings({ purchasedItemIds, stickerGrid: initialStickerGrid }: InventorySettingsProps) {
    const { showCustomToast, showToast } = useToast()
    const [showColourPicker, setShowColourPicker] = useState(false)
    const [showStickerEditor, setShowStickerEditor] = useState(false)
    const [stickerGrid, setStickerGrid] = useState<boolean[] | null>(initialStickerGrid)
    const [activeColour, setActiveColour] = useState(DEFAULT_COLOUR)

    useEffect(() => {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored) {
            setActiveColour(stored);
        }
    }, []);

    const ownedItems = purchasedItemIds
        .filter(id => id in INVENTORY_ITEMS)
        .map(id => ({ id, ...INVENTORY_ITEMS[id] }))

    const handleItemClick = (itemId: string) => {
        if (itemId === 'sticker-1bit') {
            setShowStickerEditor(prev => !prev)
            setShowColourPicker(false)
        } else if (itemId === 'colour-swap') {
            setShowColourPicker(prev => !prev)
            setShowStickerEditor(false)
        } else if (itemId === 'sound-pack') {
            showCustomToast(MUSIC_TOAST_ID, <MusicPlayerContent />)
        } else {
            showToast(`${INVENTORY_ITEMS[itemId]?.name || 'ITEM'} ACTIVATED`)
        }
    }

    const getItemIcon = (itemId: string) => {
        if (itemId === 'sticker-1bit' && stickerGrid && stickerGrid.some(Boolean)) {
            return () => <CustomStickerIcon grid={stickerGrid} />
        }
        return INVENTORY_ITEMS[itemId].icon
    }

    const handleColourSelect = (hex: string) => {
        setActiveColour(hex);
        applyThemeColour(hex);
        localStorage.setItem(THEME_STORAGE_KEY, hex);
    }

    const handleReset = () => {
        setActiveColour(DEFAULT_COLOUR);
        applyThemeColour(DEFAULT_COLOUR);
        localStorage.removeItem(THEME_STORAGE_KEY);
    }

    if (ownedItems.length === 0) {
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

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4">
                {ownedItems.map(item => {
                    const Icon = getItemIcon(item.id)
                    const isActive = (item.id === 'colour-swap' && showColourPicker) || (item.id === 'sticker-1bit' && showStickerEditor)
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleItemClick(item.id)}
                            className={`border-2 border-black p-4 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
                                isActive ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
                            }`}
                        >
                            <Icon />
                            <p className="text-xs font-bold tracking-wider text-center">{item.name}</p>
                        </button>
                    )
                })}
            </div>

            <AnimatePresence>
                {showStickerEditor && (
                    <motion.div
                        key="sticker-editor"
                        custom={1}
                        variants={sidewaysFlashVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="border-2 border-black p-4"
                    >
                        <StickerEditor
                            initialGrid={stickerGrid}
                            onSave={(grid) => setStickerGrid(grid)}
                        />
                    </motion.div>
                )}
                {showColourPicker && (
                    <motion.div
                        key="colour-picker"
                        custom={1}
                        variants={sidewaysFlashVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="border-2 border-black p-4"
                    >
                        <p className="text-sm font-bold tracking-widest mb-3">SELECT PRIMARY COLOUR</p>
                        <div className="grid grid-cols-8 gap-2">
                            {COLOUR_PALETTE.map(colour => (
                                <button
                                    key={colour.hex}
                                    onClick={() => handleColourSelect(colour.hex)}
                                    title={colour.name}
                                    className={`w-full aspect-square border-2 cursor-pointer transition-transform ${
                                        activeColour === colour.hex
                                            ? 'border-black scale-110 ring-2 ring-black ring-offset-2'
                                            : 'border-black hover:scale-110'
                                    }`}
                                    style={{ backgroundColor: colour.hex }}
                                />
                            ))}
                        </div>
                        {activeColour !== DEFAULT_COLOUR && (
                            <button
                                onClick={handleReset}
                                className="mt-3 text-xs font-bold tracking-widest hover:underline cursor-pointer"
                            >
                                [ RESET TO DEFAULT ]
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
