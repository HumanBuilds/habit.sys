import { execSync } from 'child_process';

export const Footer = () => {
    let commitCount = '000';
    try {
        // Run git command to get counts
        commitCount = execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim();
        // Pad with zeros for that's retro feel
        commitCount = commitCount.padStart(3, '0');
    } catch (e) {
        console.warn('Could not determine git version, defaulting to 000');
    }

    const systemVersion = `1.1.${commitCount}`;

    return (
        <footer className="mt-auto py-6 text-sm font-bold flex-none flex justify-center w-full">
            <span className="btn-retro cursor-default">
                (C) 1984 HABIT.SYS // VERSION {systemVersion}
            </span>
        </footer>
    );
};
