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

const PRIMARY_STORAGE_KEY = 'habit-sys-primary-colour';
const SECONDARY_STORAGE_KEY = 'habit-sys-secondary-colour';
const DEFAULT_PRIMARY = '#000000';
const DEFAULT_SECONDARY = '#FFFFFF';

const PRIMARY_PALETTE = [
    { hex: '#000000', name: 'BLACK' },
    { hex: '#1a1a2e', name: 'MIDNIGHT' },
    { hex: '#023e8a', name: 'OCEAN' },
    { hex: '#3a0ca3', name: 'INDIGO' },
    { hex: '#c9184a', name: 'CRIMSON' },
    { hex: '#ff6600', name: 'ORANGE' },
    { hex: '#1b4332', name: 'FOREST' },
    { hex: '#374151', name: 'GRAPHITE' },
];

const SECONDARY_PALETTE = [
    { hex: '#FFFFFF', name: 'WHITE' },
    { hex: '#f5f5f0', name: 'CREAM' },
    { hex: '#fdf6e3', name: 'SOLARIZED' },
    { hex: '#f0f8ff', name: 'ALICE' },
    { hex: '#fce4ec', name: 'ROSE' },
    { hex: '#e8f5e9', name: 'MINT' },
    { hex: '#f3e5f5', name: 'LILAC' },
    { hex: '#e0e0e0', name: 'SILVER' },
];

function applyPrimaryColour(hex: string) {
    document.documentElement.style.setProperty('--color-black', hex);
}

function applySecondaryColour(hex: string) {
    document.documentElement.style.setProperty('--color-white', hex);
}

function MusicNoteIcon() {
    return (
        <svg width="48" height="48" viewBox="0 0 256 256" fill="currentColor">
            <path d="M212.92,17.69a8,8,0,0,0-6.86-1.45l-128,32A8,8,0,0,0,72,56V166.08A36,36,0,1,0,88,196V102.25l112-28v62.83A36,36,0,1,0,216,172V24A8,8,0,0,0,212.92,17.69ZM52,216a20,20,0,1,1,20-20A20,20,0,0,1,52,216ZM88,86.75V62.25l112-28v24.5ZM180,192a20,20,0,1,1,20-20A20,20,0,0,1,180,192Z" />
        </svg>
    )
}

function SecondaryColourIcon() {
    return (
        <svg width="48" height="48" viewBox="0 0 256 256" fill="currentColor">
            <path d="M200.77,53.89A103.27,103.27,0,0,0,128,24h-1.07A104,104,0,0,0,24,128c0,43.41,16.22,71.2,27.76,86.27C60.89,226.18,71.58,232,80,232a27.77,27.77,0,0,0,5-.44,28.11,28.11,0,0,0,22.78-19.89A48.09,48.09,0,0,1,154.24,176H176A104.12,104.12,0,0,0,200.77,53.89ZM68,140a12,12,0,1,1,12-12A12,12,0,0,1,68,140Zm20-44a12,12,0,1,1,12-12A12,12,0,0,1,88,96Zm48-16a12,12,0,1,1,12-12A12,12,0,0,1,136,80Zm40,16a12,12,0,1,1,12-12A12,12,0,0,1,176,96Z" />
        </svg>
    )
}

function GameIcon() {
    return (
        <svg width="48" height="48" viewBox="0 0 256 256" fill="currentColor">
            <path d="M176,112H152a8,8,0,0,1,0-16h24a8,8,0,0,1,0,16ZM104,96H96V88a8,8,0,0,0-16,0v8H72a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0v-8h8a8,8,0,0,0,0-16ZM241.48,200.65a36,36,0,0,1-60.1,14.17,36.26,36.26,0,0,1-8.41-14.42L160.74,160H95.26L83,200.4a36.12,36.12,0,0,1-8.41,14.42,36,36,0,0,1-60.1-14.17,36.59,36.59,0,0,1-1.28-18.27L30.6,77.59A60,60,0,0,1,90,32h76a60,60,0,0,1,59.4,45.59l17.43,104.79A36.59,36.59,0,0,1,241.48,200.65Z" />
        </svg>
    )
}

const INVENTORY_ITEMS: Record<string, { name: string; icon: () => ReactNode }> = {
    'sticker-1bit': { name: '1-BIT STICKER', icon: StickerIcon },
    'colour-swap': { name: 'COLOUR SWAP', icon: SwapIcon },
    'sound-pack': { name: 'BLACK FRAME', icon: SpeakerIcon },
    'bonus-track': { name: 'THE LITTLE BROTH', icon: MusicNoteIcon },
    'secondary-colour': { name: 'SECONDARY COLOUR', icon: SecondaryColourIcon },
    'mini-game': { name: 'MINI GAME', icon: GameIcon },
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
    onNavigate?: (page: string) => void;
}

export function InventorySettings({ purchasedItemIds, stickerGrid: initialStickerGrid, onNavigate }: InventorySettingsProps) {
    const { showCustomToast, showToast } = useToast()
    const [showColourPicker, setShowColourPicker] = useState(false)
    const [showSecondaryPicker, setShowSecondaryPicker] = useState(false)
    const [showStickerEditor, setShowStickerEditor] = useState(false)
    const [stickerGrid, setStickerGrid] = useState<boolean[] | null>(initialStickerGrid)
    const [activeColour, setActiveColour] = useState(DEFAULT_PRIMARY)
    const [activeSecondary, setActiveSecondary] = useState(DEFAULT_SECONDARY)

    useEffect(() => {
        const storedPrimary = localStorage.getItem(PRIMARY_STORAGE_KEY);
        if (storedPrimary) setActiveColour(storedPrimary);
        const storedSecondary = localStorage.getItem(SECONDARY_STORAGE_KEY);
        if (storedSecondary) setActiveSecondary(storedSecondary);
    }, []);

    const ownedItems = purchasedItemIds
        .filter(id => id in INVENTORY_ITEMS)
        .map(id => ({ id, ...INVENTORY_ITEMS[id] }))

    const closeAllPanels = () => {
        setShowStickerEditor(false)
        setShowColourPicker(false)
        setShowSecondaryPicker(false)
    }

    const handleItemClick = (itemId: string) => {
        if (itemId === 'sticker-1bit') {
            const wasOpen = showStickerEditor
            closeAllPanels()
            if (!wasOpen) setShowStickerEditor(true)
        } else if (itemId === 'colour-swap') {
            const wasOpen = showColourPicker
            closeAllPanels()
            if (!wasOpen) setShowColourPicker(true)
        } else if (itemId === 'secondary-colour') {
            const wasOpen = showSecondaryPicker
            closeAllPanels()
            if (!wasOpen) setShowSecondaryPicker(true)
        } else if (itemId === 'sound-pack' || itemId === 'bonus-track') {
            showCustomToast(MUSIC_TOAST_ID, <MusicPlayerContent />)
        } else if (itemId === 'mini-game') {
            onNavigate?.('snake')
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

    const handlePrimarySelect = (hex: string) => {
        setActiveColour(hex);
        applyPrimaryColour(hex);
        localStorage.setItem(PRIMARY_STORAGE_KEY, hex);
    }

    const handlePrimaryReset = () => {
        setActiveColour(DEFAULT_PRIMARY);
        applyPrimaryColour(DEFAULT_PRIMARY);
        localStorage.removeItem(PRIMARY_STORAGE_KEY);
    }

    const handleSecondarySelect = (hex: string) => {
        setActiveSecondary(hex);
        applySecondaryColour(hex);
        localStorage.setItem(SECONDARY_STORAGE_KEY, hex);
    }

    const handleSecondaryReset = () => {
        setActiveSecondary(DEFAULT_SECONDARY);
        applySecondaryColour(DEFAULT_SECONDARY);
        localStorage.removeItem(SECONDARY_STORAGE_KEY);
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
                    const isActive = (item.id === 'colour-swap' && showColourPicker) || (item.id === 'secondary-colour' && showSecondaryPicker) || (item.id === 'sticker-1bit' && showStickerEditor)
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
                            {PRIMARY_PALETTE.map(colour => (
                                <button
                                    key={colour.hex}
                                    onClick={() => handlePrimarySelect(colour.hex)}
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
                        {activeColour !== DEFAULT_PRIMARY && (
                            <button
                                onClick={handlePrimaryReset}
                                className="mt-3 text-xs font-bold tracking-widest hover:underline cursor-pointer"
                            >
                                [ RESET TO DEFAULT ]
                            </button>
                        )}
                    </motion.div>
                )}
                {showSecondaryPicker && (
                    <motion.div
                        key="secondary-picker"
                        custom={1}
                        variants={sidewaysFlashVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="border-2 border-black p-4"
                    >
                        <p className="text-sm font-bold tracking-widest mb-3">SELECT SECONDARY COLOUR</p>
                        <div className="grid grid-cols-8 gap-2">
                            {SECONDARY_PALETTE.map(colour => (
                                <button
                                    key={colour.hex}
                                    onClick={() => handleSecondarySelect(colour.hex)}
                                    title={colour.name}
                                    className={`w-full aspect-square border-2 cursor-pointer transition-transform ${
                                        activeSecondary === colour.hex
                                            ? 'border-black scale-110 ring-2 ring-black ring-offset-2'
                                            : 'border-black hover:scale-110'
                                    }`}
                                    style={{ backgroundColor: colour.hex }}
                                />
                            ))}
                        </div>
                        {activeSecondary !== DEFAULT_SECONDARY && (
                            <button
                                onClick={handleSecondaryReset}
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
