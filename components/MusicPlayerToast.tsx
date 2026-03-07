'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useToast } from '@/context/ToastContext'

const BAR_COUNT = 5
const TOAST_ID = 'music-player'

function WaveformBars({ isPlaying }: { isPlaying: boolean }) {
    return (
        <div className="flex items-end gap-[3px] h-[16px]">
            {Array.from({ length: BAR_COUNT }).map((_, i) => (
                <div
                    key={i}
                    className="w-[3px] bg-black origin-bottom"
                    style={{
                        height: isPlaying ? undefined : `${4 + (i % 2) * 4}px`,
                        animation: isPlaying
                            ? `waveform-bar 0.8s steps(4) ${i * 0.15}s infinite alternate`
                            : 'none',
                    }}
                />
            ))}
        </div>
    )
}

function PlayIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" shapeRendering="crispEdges">
            <rect x="3" y="1" width="2" height="12" fill="currentColor" />
            <rect x="5" y="2" width="2" height="10" fill="currentColor" />
            <rect x="7" y="3" width="2" height="8" fill="currentColor" />
            <rect x="9" y="4" width="2" height="6" fill="currentColor" />
            <rect x="11" y="5" width="2" height="4" fill="currentColor" />
        </svg>
    )
}

function PauseIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" shapeRendering="crispEdges">
            <rect x="2" y="1" width="4" height="12" fill="currentColor" />
            <rect x="8" y="1" width="4" height="12" fill="currentColor" />
        </svg>
    )
}

function CloseIcon() {
    return (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" shapeRendering="crispEdges">
            <rect x="0" y="0" width="2" height="2" fill="currentColor" />
            <rect x="2" y="2" width="2" height="2" fill="currentColor" />
            <rect x="4" y="4" width="2" height="2" fill="currentColor" />
            <rect x="6" y="6" width="2" height="2" fill="currentColor" />
            <rect x="8" y="8" width="2" height="2" fill="currentColor" />
            <rect x="8" y="0" width="2" height="2" fill="currentColor" />
            <rect x="6" y="2" width="2" height="2" fill="currentColor" />
            <rect x="2" y="6" width="2" height="2" fill="currentColor" />
            <rect x="0" y="8" width="2" height="2" fill="currentColor" />
        </svg>
    )
}

function MusicPlayerContent() {
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const { dismissToast } = useToast()

    useEffect(() => {
        const audio = new Audio('/black_frame.mp3')
        audioRef.current = audio

        audio.addEventListener('ended', () => setIsPlaying(false))

        return () => {
            audio.pause()
            audio.removeEventListener('ended', () => setIsPlaying(false))
            audio.src = ''
        }
    }, [])

    const togglePlay = useCallback(() => {
        const audio = audioRef.current
        if (!audio) return

        if (isPlaying) {
            audio.pause()
            setIsPlaying(false)
        } else {
            audio.play()
            setIsPlaying(true)
        }
    }, [isPlaying])

    const handleClose = useCallback(() => {
        audioRef.current?.pause()
        dismissToast(TOAST_ID)
    }, [dismissToast])

    return (
        <div className="flex items-center gap-3 px-4 py-3 pr-3">
            <WaveformBars isPlaying={isPlaying} />
            <a
                href="https://freemusicarchive.org/music/Rolemusic/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-0 hover:opacity-70 transition-opacity"
            >
                <p className="font-bold text-sm tracking-wider leading-tight">THE BLACK FRAME</p>
                <p className="text-xs tracking-widest opacity-60 leading-tight">ROLEMUSIC</p>
            </a>
            <button
                onClick={togglePlay}
                className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors shrink-0"
            >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button
                onClick={handleClose}
                className="w-6 h-6 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity shrink-0"
            >
                <CloseIcon />
            </button>
        </div>
    )
}

export { MusicPlayerContent, TOAST_ID as MUSIC_TOAST_ID }
