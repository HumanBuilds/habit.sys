'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface Toast {
    id: string
    message?: string
    type: 'milestone' | 'info' | 'custom'
    persistent?: boolean
    content?: ReactNode
}

interface ToastContextValue {
    toasts: Toast[]
    showToast: (message: string, type?: 'milestone' | 'info') => void
    showCustomToast: (id: string, content: ReactNode) => void
    dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const dismissToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const showToast = useCallback((message: string, type: 'milestone' | 'info' = 'info') => {
        const id = crypto.randomUUID()
        setToasts(prev => [...prev, { id, message, type }])

        setTimeout(() => {
            dismissToast(id)
        }, 4000)
    }, [dismissToast])

    const showCustomToast = useCallback((id: string, content: ReactNode) => {
        setToasts(prev => {
            // Replace if same id exists, otherwise add
            if (prev.some(t => t.id === id)) {
                return prev.map(t => t.id === id ? { id, type: 'custom' as const, persistent: true, content } : t)
            }
            return [...prev, { id, type: 'custom' as const, persistent: true, content }]
        })
    }, [])

    return (
        <ToastContext.Provider value={{ toasts, showToast, showCustomToast, dismissToast }}>
            {children}
        </ToastContext.Provider>
    )
}

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used within ToastProvider')
    return ctx
}
