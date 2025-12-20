import React from 'react';

interface WindowProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const Window: React.FC<WindowProps> = ({ title, children, className = "" }) => {
    return (
        <div className={`window ${className}`}>
            <div className="window-header">
                <div className="window-title-strips"></div>
                <div className="window-title">{title}</div>
            </div>
            <div className="p-4">
                {children}
            </div>
        </div>
    );
};
