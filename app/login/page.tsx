'use client'

import { useActionState } from 'react'
import { login, signup, signInWithGoogle } from './actions'

const initialState = {
    error: '',
}

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const actionType = formData.get('action')
        if (actionType === 'signup') {
            return await signup(prevState, formData)
        }
        return await login(prevState, formData)
    }, initialState)

    return (
        <div className="min-h-screen flex items-center justify-center bg-cozy-muted p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-cozy-primary">Welcome Back</h1>
                    <p className="mt-2 text-cozy-text/60">Continue your growth journey</p>
                </div>

                <form action={formAction} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-cozy-text">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-cozy-primary focus:ring-2 focus:ring-cozy-primary/20 outline-none transition-all placeholder:text-gray-400"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-cozy-text">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-cozy-primary focus:ring-2 focus:ring-cozy-primary/20 outline-none transition-all placeholder:text-gray-400"
                            placeholder="••••••••"
                        />
                    </div>

                    {state?.error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                            {state.error}
                        </div>
                    )}

                    <div className="flex gap-4 pt-2">
                        <button
                            type="submit"
                            name="action"
                            value="login"
                            disabled={isPending}
                            className="flex-1 bg-cozy-primary text-white py-3 px-4 rounded-xl font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm disabled:opacity-50"
                        >
                            {isPending ? 'Loading...' : 'Log In'}
                        </button>
                        <button
                            type="submit"
                            name="action"
                            value="signup"
                            disabled={isPending}
                            className="flex-1 bg-white text-cozy-text border-2 border-cozy-muted py-3 px-4 rounded-xl font-semibold hover:bg-cozy-muted/50 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                </div>

                <form>
                    <button formAction={signInWithGoogle} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                        {/* Google Icon SVG */}
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                    </button>
                </form>

            </div>
        </div>
    )
}
