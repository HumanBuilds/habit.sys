import Link from 'next/link';
import { getPatchVersion } from '@/utils/patch-version';
import { FooterCog } from './FooterCog';

export const Footer = () => {
    return (
        <footer className="mt-auto py-6 text-sm font-bold flex-none flex justify-center items-center gap-3 w-full">
            <span className="btn-retro cursor-default">
                (C) 1984 HABIT.SYS // VERSION {getPatchVersion()}
            </span>
            <FooterCog />
        </footer>
    );
};
