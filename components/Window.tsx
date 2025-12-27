'use client';

import React from 'react';
import { useNavigationLoader } from '@/context/NavigationLoaderContext';

interface WindowProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
}

export const Window: React.FC<WindowProps> = ({ title, children, className = "", contentClassName = "" }) => {
    // We try/catch the hook usage in case Window is used outside the provider (e.g. tests or specialized layouts)
    let isLoading = false;
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { isLoading: loading } = useNavigationLoader();
        isLoading = loading;
    } catch {
        // Ignore if context is missing
    }

    const displayTitle = isLoading ? "LOADING..." : title;

    return (
        <div className={`window ${className} flex flex-col relative max-h-full`}>
            <div className="window-header flex-none">
                <div className="window-title-strips"></div>
                <div className="window-title">{displayTitle}</div>
            </div>
            <div className={`p-4 pe-1 flex-1 overflow-auto min-h-0 ${contentClassName}`}
                style={{
                    scrollbarGutter: "stable",
                }}>
                {children}
            </div>
        </div>
    );
};
