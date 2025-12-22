import { getPatchVersion } from '@/utils/patch-version';
import { execSync } from 'child_process';

export const Footer = () => {


    return (
        <footer className="mt-auto py-6 text-sm font-bold flex-none flex justify-center w-full">
            <span className="btn-retro cursor-default">
                (C) 1984 HABIT.SYS // VERSION {getPatchVersion()}
            </span>
        </footer>
    );
};
