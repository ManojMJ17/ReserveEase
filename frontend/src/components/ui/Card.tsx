import React from 'react';

export interface CardProps {
    className?: string;
    children: React.ReactNode;
    hoverable?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles: Record<NonNullable<CardProps['padding']>, string> = {
    none: '',
    sm:   'p-4 sm:p-5',
    md:   'p-6 sm:p-7',
    lg:   'p-8 sm:p-10',
};

export const Card: React.FC<CardProps> = ({
    className = '',
    children,
    hoverable = false,
    padding = 'md',
}) => (
    <div
        className={[
            'bg-white rounded-2xl border border-slate-100/80 premium-shadow-md transition-all duration-300 ease-out',
            hoverable ? 'luxury-hover-card cursor-pointer' : '',
            paddingStyles[padding],
            className,
        ].join(' ')}
    >
        {children}
    </div>
);

export default Card;
