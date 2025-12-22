import React from 'react';

interface WindowProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
}

export const Window: React.FC<WindowProps> = ({ title, children, className = "", contentClassName = "" }) => {
    return (
        <div className={`window ${className} flex flex-col relative `}>
            <div className="window-header flex-none">
                <div className="window-title-strips"></div>
                <div className="window-title">{title}</div>
            </div>
            <div className={`p-4 ${contentClassName}`}>
                {children}
            </div>
        </div>
    );
};
