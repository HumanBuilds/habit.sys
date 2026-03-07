'use client'

import { useState, useRef, useCallback, useTransition } from 'react'
import { saveStickerGrid } from '@/app/settings/actions'
import { useToast } from '@/context/ToastContext'
import { soundEngine } from '@/utils/sound-engine'

const GRID_SIZE = 48
const CELL_COUNT = GRID_SIZE * GRID_SIZE

interface StickerEditorProps {
    initialGrid: boolean[] | null
    onSave: (grid: boolean[]) => void
}

export function StickerEditor({ initialGrid, onSave }: StickerEditorProps) {
    const [grid, setGrid] = useState<boolean[]>(
        () => initialGrid ?? new Array(CELL_COUNT).fill(false)
    )
    const [isPending, startTransition] = useTransition()
    const { showToast } = useToast()

    // Drawing state refs (no re-render needed)
    const isDrawing = useRef(false)
    const drawMode = useRef<boolean>(true) // true = fill, false = erase

    const toggleCell = useCallback((index: number, mode: boolean) => {
        setGrid(prev => {
            if (prev[index] === mode) return prev
            const next = [...prev]
            next[index] = mode
            return next
        })
    }, [])

    const handlePointerDown = useCallback((index: number) => {
        isDrawing.current = true
        // First cell determines fill vs erase
        drawMode.current = !grid[index]
        toggleCell(index, drawMode.current)
    }, [grid, toggleCell])

    const handlePointerEnter = useCallback((index: number) => {
        if (!isDrawing.current) return
        toggleCell(index, drawMode.current)
    }, [toggleCell])

    const handlePointerUp = useCallback(() => {
        isDrawing.current = false
    }, [])

    const handleSave = () => {
        startTransition(async () => {
            const result = await saveStickerGrid(grid)
            if (result.success) {
                soundEngine.playConfirm()
                showToast('STICKER SAVED', 'info')
                onSave(grid)
            } else if (result.error) {
                showToast(`ERROR: ${result.error}`, 'info')
            }
        })
    }

    const handleClear = () => {
        setGrid(new Array(CELL_COUNT).fill(false))
    }

    const handleDownload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = GRID_SIZE
        canvas.height = GRID_SIZE
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const primaryColour = getComputedStyle(document.documentElement).getPropertyValue('--color-black').trim() || '#000000'
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, GRID_SIZE, GRID_SIZE)
        ctx.fillStyle = primaryColour

        grid.forEach((filled, i) => {
            if (filled) {
                const x = i % GRID_SIZE
                const y = Math.floor(i / GRID_SIZE)
                ctx.fillRect(x, y, 1, 1)
            }
        })

        const link = document.createElement('a')
        link.download = 'sticker.png'
        link.href = canvas.toDataURL('image/png')
        link.click()
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <p className="text-sm font-bold tracking-widest">DRAW YOUR STICKER</p>
                <button
                    onClick={handleDownload}
                    className="btn-retro-secondary text-xs"
                >
                    [ DOWNLOAD ]
                </button>
            </div>
            <div
                className="border-2 border-black select-none touch-none"
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                <div
                    className="grid"
                    style={{
                        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                        aspectRatio: '1',
                    }}
                >
                    {grid.map((filled, i) => (
                        <div
                            key={i}
                            onPointerDown={(e) => {
                                e.preventDefault()
                                handlePointerDown(i)
                            }}
                            onPointerEnter={() => handlePointerEnter(i)}
                            className="border-[0.5px] border-black/10"
                            style={{
                                backgroundColor: filled ? 'var(--color-black, #000)' : 'var(--color-white, #fff)',
                            }}
                        />
                    ))}
                </div>
            </div>
            <div className="flex gap-3">
                <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="btn-retro text-xs flex-1"
                >
                    [ {isPending ? 'SAVING...' : 'SAVE'} ]
                </button>
                <button
                    onClick={handleClear}
                    disabled={isPending}
                    className="btn-retro-secondary text-xs"
                >
                    [ CLEAR ]
                </button>
            </div>
        </div>
    )
}
