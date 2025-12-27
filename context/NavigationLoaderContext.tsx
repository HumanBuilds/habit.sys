'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationLoaderContextType {
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
}

const NavigationLoaderContext = createContext<NavigationLoaderContextType | undefined>(undefined);

export function NavigationLoaderProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <NavigationLoaderContext.Provider value={{ isLoading, setLoading: setIsLoading }}>
            {children}
        </NavigationLoaderContext.Provider>
    );
}

export function useNavigationLoader() {
    const context = useContext(NavigationLoaderContext);
    if (context === undefined) {
        throw new Error('useNavigationLoader must be used within a NavigationLoaderProvider');
    }
    return context;
}
