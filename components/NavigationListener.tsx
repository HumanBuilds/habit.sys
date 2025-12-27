'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useNavigationLoader } from '@/context/NavigationLoaderContext';

export const NavigationListener = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { setLoading } = useNavigationLoader();

    // Reset loading state when the route changes (navigation complete)
    useEffect(() => {
        setLoading(false);
    }, [pathname, searchParams, setLoading]);

    // Listen for link clicks to trigger loading state
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');

            if (anchor) {
                const href = anchor.getAttribute('href');
                const targetAttr = anchor.getAttribute('target');

                // Check if it's a valid local navigation
                if (
                    href &&
                    href.startsWith('/') && // Only local links
                    !targetAttr && // Not opening in new tab
                    !e.ctrlKey && // Not holding Ctrl
                    !e.metaKey && // Not holding Cmd
                    !e.shiftKey && // Not holding Shift
                    !e.altKey // Not holding Alt
                ) {
                    // Only set loading if we're actually going to a new page
                    const currentUrl = window.location.pathname + window.location.search;
                    if (href !== currentUrl) {
                        setLoading(true);
                    }
                }
            }
        };

        window.addEventListener('click', handleClick, true); // Capture phase

        return () => {
            window.removeEventListener('click', handleClick, true);
        };
    }, [setLoading]);

    return null;
};
