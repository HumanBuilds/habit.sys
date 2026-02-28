'use client'

import { useEffect, useState } from 'react'
import { useSignIn, useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Window } from '@/components/Window'

export default function LoginPage() {
    const { signIn, setActive: setSignInActive, isLoaded: isSignInLoaded } = useSignIn()
    const { signUp, setActive: setSignUpActive, isLoaded: isSignUpLoaded } = useSignUp()
    const router = useRouter()
    const [error, setError] = useState('')

    // Force font repaint after Clerk finishes async initialization.
    // Clerk's hooks cause re-renders that can miss font-display swap on inputs.
    useEffect(() => {
        if (isSignInLoaded) {
            document.fonts.ready.then(() => {
                document.body.offsetHeight
            })
        }
    }, [isSignInLoaded])
    const [isPending, setIsPending] = useState(false)
    const [pendingVerification, setPendingVerification] = useState(false)
    const [verificationCode, setVerificationCode] = useState('')

    async function handleSubmit(formData: FormData) {
        const actionType = formData.get('action')
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        setError('')
        setIsPending(true)

        try {
            if (actionType === 'signup') {
                if (!isSignUpLoaded || !signUp) return
                await signUp.create({ emailAddress: email, password })
                await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
                setPendingVerification(true)
            } else {
                if (!isSignInLoaded || !signIn) return
                const result = await signIn.create({ identifier: email, password })
                if (result.status === 'complete') {
                    await setSignInActive({ session: result.createdSessionId })
                    router.push('/dashboard')
                }
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Authentication failed'
            setError(message)
        } finally {
            setIsPending(false)
        }
    }

    async function handleVerification(e: React.FormEvent) {
        e.preventDefault()
        if (!isSignUpLoaded || !signUp) return

        setError('')
        setIsPending(true)

        try {
            const result = await signUp.attemptEmailAddressVerification({ code: verificationCode })
            if (result.status === 'complete') {
                await setSignUpActive({ session: result.createdSessionId })
                router.push('/dashboard')
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Verification failed'
            setError(message)
        } finally {
            setIsPending(false)
        }
    }

    async function handleResendCode() {
        if (!isSignUpLoaded || !signUp) return

        setError('')
        try {
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Could not resend code'
            setError(message)
        }
    }

    async function handleGoogleAuth() {
        if (!isSignInLoaded || !signIn) return
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

    return (
        <div className="h-full flex items-center justify-center p-4">
            <Window title="SYSTEM_ACCESS.EXE" className="w-full max-w-md">
                {pendingVerification ? (
                    <>
                        <div className="text-center mb-8 border-b-2 border-black pb-4">
                            <h1 className="text-4xl font-bold tracking-tighter">CHECK YOUR EMAIL</h1>
                            <p className="mt-2 text-xl font-bold">ENTER VERIFICATION CODE</p>
                        </div>

                        <form onSubmit={handleVerification} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="code" className="text-sm font-bold uppercase tracking-widest">VERIFICATION CODE</label>
                                <input
                                    id="code"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    required
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    className="input-retro w-full text-center tracking-[0.5em] text-2xl"
                                    placeholder="000000"
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-black text-white font-bold text-center border-2 border-black">
                                    ERROR: {error.toUpperCase()}
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setPendingVerification(false); setError('') }}
                                    disabled={isPending}
                                    className="flex-1 btn-retro"
                                >
                                    [ BACK ]
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex-1 btn-retro inverted"
                                >
                                    {isPending ? 'VERIFYING...' : '[ VERIFY ]'}
                                </button>
                            </div>
                        </form>

                        <button
                            type="button"
                            onClick={handleResendCode}
                            className="w-full btn-retro mt-4"
                        >
                            [ RESEND CODE ]
                        </button>
                    </>
                ) : (
                    <>
                        <div className="text-center mb-8 border-b-2 border-black pb-4">
                            <h1 className="text-4xl font-bold tracking-tighter">WELCOME BACK</h1>
                            <p className="mt-2 text-xl font-bold">PLEASE IDENTIFY YOURSELF</p>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)) }} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-bold uppercase tracking-widest">EMAIL ADDRESS</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete='email'
                                    required
                                    className="input-retro w-full"
                                    placeholder="USER@EXAMPLE.COM"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-bold uppercase tracking-widest">PASSWORD</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete='current-password'
                                    required
                                    className="input-retro w-full"
                                    placeholder="********"
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-black text-white font-bold text-center border-2 border-black">
                                    ERROR: {error.toUpperCase()}
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    name="action"
                                    value="login"
                                    disabled={isPending}
                                    className="flex-1 btn-retro inverted"
                                >
                                    {isPending ? 'LOADING...' : '[ LOG IN ]'}
                                </button>
                                <button
                                    type="submit"
                                    name="action"
                                    value="signup"
                                    disabled={isPending}
                                    className="flex-1 btn-retro"
                                >
                                    [ SIGN UP ]
                                </button>
                            </div>
                        </form>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t-2 border-black" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-4 font-bold">OR USE EXTERNAL PROTOCOL</span>
                            </div>
                        </div>

                        <button onClick={handleGoogleAuth} className="w-full btn-retro flex items-center justify-center gap-4">
                            [ GOOGLE AUTH ]
                        </button>
                    </>
                )}
            </Window>
        </div>
    )
}
