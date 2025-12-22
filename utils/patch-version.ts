import { execSync } from "child_process";

export function getPatchVersion() {
    let commitCount = 0;
    try {
        // Run git command to get counts
        commitCount = parseInt(execSync('git rev-list --count HEAD', { encoding: 'utf8' }));
    } catch {
        console.warn('Could not determine git version, defaulting to 000');
    }

    const majorVersion = Math.floor(commitCount / 100) + 1;
    const minorVersion = Math.floor((commitCount % 100) / 10);
    const patchVersion = commitCount % 10;

    return `${majorVersion}.${minorVersion}.${patchVersion}`;
}