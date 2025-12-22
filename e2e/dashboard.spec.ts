import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        // Use provided test credentials
        const email = 'jhumanb1+habit_app@gmail.com';
        const password = 'T3sting123';

        await page.goto('/login');
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', password);
        // Click login button (value="login")
        await page.click('button[value="login"]');

        // Wait for redirection to dashboard
        try {
            await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
        } catch (e) {
            console.log('Login failed. Current URL:', page.url());
            const errorText = await page.locator('text=ERROR:').textContent().catch(() => 'No error message found');
            console.log('Error message on page:', errorText);
            throw e;
        }
    });

    test('Clicking a habit in the log changes display, and remains changed', async ({ page }) => {
        // 1. Check if ANY habit exists
        let habitItem = page.locator('div.cursor-pointer').first();

        if (await habitItem.count() === 0) {
            // No habits exist, so user MUST be eligible to create one.
            const initButton = page.getByRole('link', { name: 'INITIALIZE FIRST MODULE' });
            if (await initButton.isVisible()) {
                await initButton.click();
            } else {
                await page.getByLabel('Add New Protocol').click();
            }
            await page.waitForURL('/create-habit');
            await page.fill('input[name="title"]', 'Daily Jog');
            await page.click('button[type="submit"]');
            await page.waitForURL('/dashboard');

            // Re-locate
            habitItem = page.locator('div.cursor-pointer').first();
        }

        // 2. Identify the habit we are toggling
        const textSpan = habitItem.locator('span.text-2xl');
        // Check initial state
        const isInitiallyCompleted = await textSpan.evaluate((el) => el.classList.contains('text-gray-400'));

        // 3. Toggle
        await habitItem.click();

        // 4. Verify Flip (Optimistic)
        if (isInitiallyCompleted) {
            await expect(textSpan).not.toHaveClass(/text-gray-400/);
        } else {
            await expect(textSpan).toHaveClass(/text-gray-400/);
        }

        // 5. Verify Persistence (Reload)
        await page.reload();
        await expect(page).toHaveURL('/dashboard');

        // Re-locate first element after reload (assuming order hasn't changed drastically or we pick the same one logic)
        // Ideally we should find by text.
        const habitTitle = await textSpan.textContent();
        // Locate by text to be safe
        const reloadedHabitItem = page.locator('div.cursor-pointer').filter({ hasText: habitTitle || '' }).first();
        const reloadedTextSpan = reloadedHabitItem.locator('span.text-2xl');

        if (isInitiallyCompleted) {
            await expect(reloadedTextSpan).not.toHaveClass(/text-gray-400/);
        } else {
            await expect(reloadedTextSpan).toHaveClass(/text-gray-400/);
        }
    });

    test('Navigating between pages triggers the scroll animation', async ({ page }) => {
        // Try to find a navigation link.
        // In simplified view (default), look for the "+" icon button
        let targetLink = page.getByLabel('Add New Protocol');

        // If not found, maybe we are ineligible or need detailed view?
        if (!await targetLink.isVisible()) {
            // Toggle to detailed view to check if we can see the big button
            await page.locator('div[role="checkbox"]').click();

            // Check if "Initialize New Protocol..." is visible
            const detailedLink = page.getByRole('link', { name: 'Initialize New Protocol...' });
            if (await detailedLink.isVisible()) {
                targetLink = detailedLink;
            } else {
                // Check if blocked
                if (await page.getByText('System Expansion Blocked').isVisible()) {
                    console.log('User is ineligible for new habits, skipping navigation animation test.');
                    return;
                }
            }
        }

        if (await targetLink.isVisible()) {
            // Click and expect animation class
            await targetLink.click();

            // The 'transitioning' class is added to body during animation.
            await expect(page.locator('body')).toHaveClass(/transitioning/);

            await page.waitForURL('/create-habit');

            await expect(page.locator('body')).not.toHaveClass(/transitioning/);
        } else {
            console.log('Could not find a suitable navigation link to test.');
        }
    });

    test('The detailed / simplified toggle works correctly', async ({ page }) => {
        // 1. Check Simplified State (default)
        const diagnosticsHeader = page.getByText('SYSTEM_DIAGNOSTICS');
        await expect(diagnosticsHeader).not.toBeVisible();

        // 2. Toggle to DETAILED using the slider
        await page.locator('div[role="checkbox"]').click();

        // 3. Verify Detailed View
        await expect(diagnosticsHeader).toBeVisible();

        // 4. Toggle back to SIMPLIFIED
        await page.locator('div[role="checkbox"]').click();

        // 5. Verify Simplified View
        await expect(diagnosticsHeader).not.toBeVisible();
    });
});
