'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Window } from '@/components/Window'
import { CodeInput } from '@/components/CodeInput'

function ResetPasswordForm() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get('email')
    const [error, setError] = useState('')
    const [isPending, setIsPending] = useState(false)
    const [phase, setPhase] = useState<'code' | 'password'>('code')
    const [code, setCode] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        if (isLoaded) {
            document.fonts.ready.then(() => {
                document.body.offsetHeight
            })
        }
    }, [isLoaded])

    async function handleCodeSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!isLoaded || !signIn) return

        setError('')
        setIsPending(true)

        try {
            const result = await signIn.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
            })
            if (result.status === 'needs_new_password') {
                setPhase('password')
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Invalid code'
            setError(message)
        } finally {
            setIsPending(false)
        }
    }

    async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!isLoaded || !signIn) return

        const formData = new FormData(e.currentTarget)
        const password = formData.get('password') as string

        setError('')
        setIsPending(true)

        try {
            const result = await signIn.resetPassword({
                password,
                signOutOfOtherSessions: true,
            })
            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId })
                router.push('/dashboard')
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Could not reset password'
            setError(message)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="h-full flex items-center justify-center p-4">
            <Window title="RESET_PASS.EXE" className="w-full max-w-md">
                {phase === 'code' ? (
                    <>
                        <div className="text-center border-b-2 border-black" style={{ marginBottom: 16, paddingBottom: 16 }}>
                            <h1 className="text-4xl font-bold tracking-tighter">RESET PASSWORD</h1>
                            <p className="mt-2 text-xl font-bold">
                                {email ? `CODE SENT TO ${email.toUpperCase()}` : 'ENTER THE CODE FROM YOUR EMAIL'}
                            </p>
                        </div>

                        <form onSubmit={handleCodeSubmit} className="space-y-6">
                            <CodeInput value={code} onChange={setCode} />

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
                                {isPending ? 'VERIFYING...' : '[ VERIFY CODE ]'}
                            </button>

                            <button
                                type="button"
                                onClick={() => router.push('/forgot-password')}
                                className="w-full btn-retro"
                            >
                                <span>[ RESEND CODE ]</span>
                            </button>
                        </form>

                        <div className="text-center mt-6 pt-4 border-t-2 border-black">
                            <Link href="/login" className="text-sm font-bold hover:underline">
                                BACK TO LOGIN
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-center mb-8 border-b-2 border-black pb-4">
                            <h1 className="text-4xl font-bold tracking-tighter">NEW PASSWORD</h1>
                            <p className="mt-2 text-xl font-bold">ENTER YOUR NEW PASSWORD</p>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-bold uppercase tracking-widest">NEW PASSWORD</label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
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
                                {isPending ? 'RESETTING...' : '[ SET NEW PASSWORD ]'}
                            </button>
                        </form>
                    </>
                )}
            </Window>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense>
            <ResetPasswordForm />
        </Suspense>
    )
}
