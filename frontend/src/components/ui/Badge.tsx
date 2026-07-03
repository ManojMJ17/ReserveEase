import React from 'react';

export type BadgeVariant = 'confirmed' | 'cancelled' | 'active' | 'disabled' | 'info' | 'warning';

export interface BadgeProps {
    variant: BadgeVariant;
    children: React.ReactNode;
    className?: string;
    showDot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-100',
    active:    'bg-emerald-50 text-emerald-700 border-emerald-100',
    disabled:  'bg-slate-100 text-slate-600 border-slate-200/50',
    info:      'bg-gold-50 text-gold-700 border-gold-100',
    warning:   'bg-amber-50 text-amber-700 border-amber-100',
};

const dotStyles: Record<BadgeVariant, string> = {
    confirmed: 'bg-emerald-500',
    cancelled: 'bg-rose-500',
    active:    'bg-emerald-500',
    disabled:  'bg-slate-400',
    info:      'bg-gold-500',
    warning:   'bg-amber-500',
};

export const Badge: React.FC<BadgeProps> = ({
    variant,
    children,
    className = '',
    showDot = false,
}) => (
    <span
        className={[
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border shadow-xs',
            variantStyles[variant],
            className,
        ].join(' ')}
    >
        {showDot && (
            <span className={`h-1.5 w-1.5 rounded-full shrink-0 animate-pulse ${dotStyles[variant]}`} />
        )}
        {children}
    </span>
);

export default Badge;
