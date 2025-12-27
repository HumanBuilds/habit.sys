import { execSync } from "child_process";

export function getPatchVersion() {
    let commitCount = 64; // Hardcoded for production (git not available in Vercel)
    try {
        // Run git command to get counts
        commitCount = parseInt(execSync('git rev-list --count HEAD', { encoding: 'utf8' }));
    } catch {
        // Fallback to hardcoded value
    }

    const majorVersion = Math.floor(commitCount / 100) + 1;
    const minorVersion = Math.floor((commitCount % 100) / 10);
    const patchVersion = commitCount % 10;

    return `${majorVersion}.${minorVersion}.${patchVersion}`;
}