'use client'

import { useEffect, useState } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Window } from '@/components/Window'

export default function ForgotPasswordPage() {
    const { signIn, isLoaded } = useSignIn()
    const router = useRouter()
    const [error, setError] = useState('')
    const [isPending, setIsPending] = useState(false)

    useEffect(() => {
        if (isLoaded) {
            document.fonts.ready.then(() => {
                document.body.offsetHeight
            })
        }
    }, [isLoaded])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!isLoaded || !signIn) return

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string

        setError('')
        setIsPending(true)

        try {
            await signIn.create({ strategy: 'reset_password_email_code', identifier: email })
            router.push(`/reset-password?email=${encodeURIComponent(email)}`)
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Could not send reset code'
            setError(message)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="h-full flex items-center justify-center p-4">
            <Window title="RECOVERY.EXE" className="w-full max-w-md">
                <div className="text-center mb-8 border-b-2 border-black pb-4">
                    <h1 className="text-4xl font-bold tracking-tighter">FORGOT PASSWORD</h1>
                    <p className="mt-2 text-xl font-bold">ENTER YOUR EMAIL TO RESET</p>
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
                        {isPending ? 'SENDING...' : '[ SEND RESET CODE ]'}
                    </button>
                </form>

                <div className="text-center mt-6 pt-4 border-t-2 border-black">
                    <Link href="/login" className="text-sm font-bold hover:underline">
                        BACK TO LOGIN
                    </Link>
                </div>
            </Window>
        </div>
    )
}
