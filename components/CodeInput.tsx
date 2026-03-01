'use client'

import { useRef, KeyboardEvent, ClipboardEvent } from 'react'

const CODE_LENGTH = 6

interface CodeInputProps {
    value: string
    onChange: (code: string) => void
}

export function CodeInput({ value, onChange }: CodeInputProps) {
    const chars = value.slice(0, CODE_LENGTH).split('')
    const digits = Array.from({ length: CODE_LENGTH }, (_, i) => chars[i] ?? '')
    const inputsRef = useRef<(HTMLInputElement | null)[]>([])


    function setRef(i: number) {
        return (el: HTMLInputElement | null) => { inputsRef.current[i] = el }
    }

    function focusIndex(i: number) {
        inputsRef.current[i]?.focus()
    }

    function updateDigit(index: number, digit: string) {
        const next = [...digits]
        next[index] = digit
        onChange(next.join(''))
    }

    function handleInput(index: number, inputValue: string) {
        const cleaned = inputValue.replace(/\D/g, '')
        if (!cleaned) return

        if (cleaned.length === 1) {
            updateDigit(index, cleaned)
            if (index < CODE_LENGTH - 1) focusIndex(index + 1)
        }
    }

    function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Backspace') {
            e.preventDefault()
            if (digits[index]) {
                updateDigit(index, '')
            } else if (index > 0) {
                updateDigit(index - 1, '')
                focusIndex(index - 1)
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault()
            focusIndex(index - 1)
        } else if (e.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
            e.preventDefault()
            focusIndex(index + 1)
        }
    }

    function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
        if (!pasted) return
        onChange(pasted)
        focusIndex(Math.min(pasted.length, CODE_LENGTH - 1))
    }

    return (
        <div className="flex gap-2 justify-center">
            {digits.map((digit, i) => (
                <input
                    key={i}
                    ref={setRef(i)}
                    type="text"
                    inputMode="numeric"
                    autoComplete={i === 0 ? 'one-time-code' : 'off'}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInput(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    onFocus={(e) => e.target.select()}
                    className="input-retro text-center text-2xl font-bold"
                    style={{ width: 36, height: 36 }}
                />
            ))}
        </div>
    )
}
