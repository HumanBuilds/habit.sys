import React from 'react';

interface WindowProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
}

export const Window: React.FC<WindowProps> = ({ title, children, className = "", contentClassName = "" }) => {
    return (
        <div className={`window ${className} flex flex-col relative max-h-full`}>
            <div className="window-header flex-none">
                <div className="window-title-strips"></div>
                <div className="window-title">{title}</div>
            </div>
            <div className={`p-4 pe-2 flex-1 overflow-auto min-h-0 ${contentClassName}`}
                style={{
                    scrollbarGutter: "stable",
                }}>
                {children}
            </div>
        </div>
    );
};
