import React from 'react';

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
    return (
        <div className="flex gap-1 w-full h-8 mb-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                    key={i}
                    className={`
            flex-1 pixel-border
            ${i < currentStep ? 'bg-black' : 'dither-25'}
          `}
                />
            ))}
        </div>
    );
};
