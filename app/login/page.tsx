'use client'


import { useActionState } from 'react'
import { login, signup, signInWithGoogle } from './actions'
import { Window } from '@/components/Window'

const initialState = {
    error: '',
}

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(async (prevState: unknown, formData: FormData) => {
        const actionType = formData.get('action')
        if (actionType === 'signup') {
            return await signup(prevState, formData)
        }
        return await login(prevState, formData)
    }, initialState)

    return (
        <div className="h-full flex items-center justify-center p-4">
            <Window title="SYSTEM_ACCESS.EXE" className="w-full max-w-md">
                <div className="text-center mb-8 border-b-2 border-black pb-4">
                    <h1 className="text-4xl font-bold tracking-tighter">WELCOME BACK</h1>
                    <p className="mt-2 text-xl font-bold">PLEASE IDENTIFY YOURSELF</p>
                </div>

                <form action={formAction} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-bold uppercase tracking-widest">EMAIL ADDRESS</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
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
                            required
                            className="input-retro w-full"
                            placeholder="********"
                        />
                    </div>

                    {state?.error && (
                        <div className="p-4 bg-black text-white font-bold text-center border-2 border-black">
                            ERROR: {state.error.toUpperCase()}
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

                <form>
                    <button formAction={signInWithGoogle} className="w-full btn-retro flex items-center justify-center gap-4">
                        [ GOOGLE AUTH ]
                    </button>
                </form>

            </Window>
        </div>
    )
}
