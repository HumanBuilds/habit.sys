'use client';

import { useState, useTransition, useEffect } from 'react';
import { updateAlias, updateEmail, updatePassword } from '@/app/settings/actions';

const EyeIcon = ({ show }: { show: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" shapeRendering="crispEdges">
        <path d="M2 10C2 10 6 4 10 4C14 4 18 10 18 10C18 10 14 16 10 16C6 16 2 10 2 10Z" stroke="black" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="10" cy="10" r="3" fill="black" />
        {show && <line x1="3" y1="3" x2="17" y2="17" stroke="black" strokeWidth="2" />}
    </svg>
);

// Retro ASCII spinner: cycles through - \ | /
function RetroSpinner() {
    const frames = ['-', '\\', '|', '/'];
    const [frame, setFrame] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setFrame(f => (f + 1) % frames.length), 150);
        return () => clearInterval(id);
    }, [frames.length]);
    return <span className="inline-block w-4 text-center font-bold">{frames[frame]}</span>;
}

type ButtonStatus = 'idle' | 'pending' | 'success' | 'error';

// min-w ensures the button never shrinks below the width of "UPDATED"
function StatusButton({ status, disabled, className = '' }: {
    status: ButtonStatus;
    disabled?: boolean;
    className?: string;
}) {
    const isDisabled = disabled || status === 'pending' || status === 'success';
    return (
        <button
            type="submit"
            disabled={isDisabled}
            className={`btn-retro text-sm min-w-[90px] ${className}`}
        >
            {status === 'pending' && <RetroSpinner />}
            {status === 'success' && 'UPDATED'}
            {status === 'error' && 'ERROR'}
            {status === 'idle' && 'UPDATE'}
        </button>
    );
}

interface AccountSettingsProps {
    userData: {
        email: string | null;
        alias: string | null;
        hasPassword: boolean;
    } | null;
}

export function AccountSettings({ userData }: AccountSettingsProps) {
    if (!userData) return null;

    return (
        <div className="flex flex-col">
            <AliasSection initialAlias={userData.alias} />
            <EmailSection currentEmail={userData.email} />
            <PasswordSection hasPassword={userData.hasPassword} />
        </div>
    );
}

// --- Alias Section ---

function AliasSection({ initialAlias }: { initialAlias: string | null }) {
    const initial = initialAlias ?? '';
    const [alias, setAlias] = useState(initial);
    const [savedAlias, setSavedAlias] = useState(initial);
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<ButtonStatus>('idle');

    const hasChanged = alias !== savedAlias;

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const result = await updateAlias(alias);
            if (result.error) {
                setStatus('error');
            } else {
                setSavedAlias(alias);
                setStatus('success');
            }
        });
    };

    return (
        <div className="pb-4 mb-4 border-b border-black">
            <label className="text-sm font-bold uppercase tracking-widest">OPERATOR ALIAS</label>
            <form onSubmit={handleSave} className="flex gap-2 mt-2">
                <input
                    type="text"
                    value={alias}
                    onChange={(e) => { setAlias(e.target.value); setStatus('idle'); }}
                    maxLength={20}
                    className="input-retro flex-1"
                    placeholder="ENTER ALIAS"
                />
                <StatusButton status={isPending ? 'pending' : status} disabled={!hasChanged} />
            </form>
        </div>
    );
}

// --- Email Section ---

function EmailSection({ currentEmail }: { currentEmail: string | null }) {
    const [email, setEmail] = useState(currentEmail ?? '');
    const [savedEmail, setSavedEmail] = useState(currentEmail ?? '');
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<ButtonStatus>('idle');

    const hasChanged = email.toLowerCase() !== savedEmail.toLowerCase();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const result = await updateEmail(email);
            if (result.error) {
                setStatus('error');
            } else {
                setSavedEmail(email.toLowerCase());
                setStatus('success');
            }
        });
    };

    return (
        <div className="pb-4 mb-4 border-b border-black">
            <label className="text-sm font-bold uppercase tracking-widest">EMAIL ADDRESS</label>
            <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
                    className="input-retro flex-1"
                    placeholder="EMAIL ADDRESS"
                    autoComplete="email"
                />
                <StatusButton status={isPending ? 'pending' : status} disabled={!hasChanged} />
            </form>
        </div>
    );
}

// --- Password Section ---

function PasswordSection({ hasPassword }: { hasPassword: boolean }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<ButtonStatus>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const result = await updatePassword(
                newPassword,
                hasPassword ? currentPassword : undefined
            );
            if (result.error) {
                setStatus('error');
            } else {
                setCurrentPassword('');
                setNewPassword('');
                setStatus('success');
            }
        });
    };

    const clearStatus = () => { if (status !== 'idle') setStatus('idle'); };

    return (
        <div>
            <label className="text-sm font-bold uppercase tracking-widest">PASSWORD</label>
            <form onSubmit={handleSubmit} className="space-y-3 mt-2">
                {hasPassword && (
                    <div className="relative">
                        <input
                            type={showCurrent ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => { setCurrentPassword(e.target.value); clearStatus(); }}
                            className="input-retro w-full pr-16"
                            placeholder="CURRENT PASSWORD"
                            autoComplete="current-password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-0 top-0 h-full px-3 flex items-center"
                            aria-label={showCurrent ? 'Hide password' : 'Show password'}
                        >
                            <EyeIcon show={showCurrent} />
                        </button>
                    </div>
                )}
                <div className="relative">
                    <input
                        type={showNew ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); clearStatus(); }}
                        className="input-retro w-full pr-16"
                        placeholder="NEW PASSWORD"
                        autoComplete="new-password"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-0 top-0 h-full px-3 flex items-center"
                        aria-label={showNew ? 'Hide password' : 'Show password'}
                    >
                        <EyeIcon show={showNew} />
                    </button>
                </div>
                <StatusButton status={isPending ? 'pending' : status} disabled={!newPassword} className="w-full" />
            </form>
        </div>
    );
}
