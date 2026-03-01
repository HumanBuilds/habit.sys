'use client'

import { useEffect, useState } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Window } from '@/components/Window'

export default function LoginPage() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()
    const [error, setError] = useState('')
    const [isPending, setIsPending] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        if (isLoaded) {
            document.fonts.ready.then(() => {
                document.body.offsetHeight
            })
        }
    }, [isLoaded])

    async function handleGoogleAuth() {
        if (!isLoaded || !signIn) return
        try {
            await signIn.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/dashboard',
            })
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Could not authenticate with Google'
            setError(message)
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!isLoaded || !signIn) return

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        setError('')
        setIsPending(true)

        try {
            const result = await signIn.create({ identifier: email, password })
            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId })
                router.push('/dashboard')
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Authentication failed'
            setError(message)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="h-full flex items-center justify-center p-4">
            <Window title="SYSTEM_ACCESS.EXE" className="w-full max-w-md">
                <div className="text-center mb-8 border-b-2 border-black pb-4">
                    <h1 className="text-4xl font-bold tracking-tighter">WELCOME BACK</h1>
                    <p className="mt-2 text-xl font-bold">PLEASE IDENTIFY YOURSELF</p>
                </div>

                <button onClick={handleGoogleAuth} className="w-full btn-retro flex items-center justify-center gap-4">
                    [ GOOGLE AUTH ]
                </button>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t-2 border-black" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-4 font-bold">OR USE EMAIL</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-bold uppercase tracking-widest">EMAIL ADDRESS</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="input-retro w-full"
                            placeholder="USER@EXAMPLE.COM"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-bold uppercase tracking-widest">PASSWORD</label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                className="input-retro w-full pr-16"
                                placeholder="********"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-0 h-full px-3 flex items-center"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" shapeRendering="crispEdges">
                                    <path d="M2 10C2 10 6 4 10 4C14 4 18 10 18 10C18 10 14 16 10 16C6 16 2 10 2 10Z" stroke="black" strokeWidth="2" strokeLinejoin="round" />
                                    <circle cx="10" cy="10" r="3" fill="black" />
                                    {showPassword && <line x1="3" y1="3" x2="17" y2="17" stroke="black" strokeWidth="2" />}
                                </svg>
                            </button>
                        </div>
                        <div className="text-right">
                            <Link href="/forgot-password" className="text-sm font-bold hover:underline">
                                FORGOT PASSWORD?
                            </Link>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-black text-white font-bold text-center border-2 border-black">
                            ERROR: {error.toUpperCase()}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full btn-retro inverted"
                    >
                        {isPending ? 'LOADING...' : '[ LOG IN ]'}
                    </button>
                </form>

                <div className="text-center mt-6 pt-4 border-t-2 border-black">
                    <Link href="/signup" className="text-sm font-bold hover:underline">
                        NO ACCOUNT? REGISTER HERE
                    </Link>
                </div>
            </Window>
        </div>
    )
}
