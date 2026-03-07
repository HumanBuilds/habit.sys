'use client'

import { createContext, useContext, useState, useCallback } from 'react'

export interface Toast {
    id: string
    message: string
    type: 'milestone' | 'info'
}

interface ToastContextValue {
    toasts: Toast[]
    showToast: (message: string, type?: Toast['type']) => void
    dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const dismissToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
        const id = crypto.randomUUID()
        setToasts(prev => [...prev, { id, message, type }])

        setTimeout(() => {
            dismissToast(id)
        }, 4000)
    }, [dismissToast])

    return (
        <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
            {children}
        </ToastContext.Provider>
    )
}

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used within ToastProvider')
    return ctx
}
