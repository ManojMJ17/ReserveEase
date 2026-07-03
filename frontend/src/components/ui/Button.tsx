import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'soft-danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        'text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 focus:ring-violet-500/25 border-transparent shadow-[0_1px_2px_rgba(0,0,0,0.05),0_0_0_1px_rgba(124,58,237,0.4)]',
    secondary:
        'text-slate-700 bg-white hover:bg-[#FAF8F5] active:bg-[#f3ead0]/20 focus:ring-gold-500/20 border-slate-200 shadow-sm hover:text-slate-900 hover:border-gold-500/30',
    danger:
        'text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 focus:ring-rose-500/25 border-transparent shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
    'soft-danger':
        'text-rose-600 bg-rose-50/80 hover:bg-rose-100/90 active:bg-rose-150 focus:ring-rose-400/20 border-rose-100/50 hover:text-rose-700',
    ghost:
        'text-slate-500 bg-transparent hover:bg-slate-100 active:bg-slate-200/50 focus:ring-slate-300/30 border-transparent hover:text-slate-800',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm:   'px-3.5 py-1.5 text-xs gap-1.5 rounded-lg font-medium',
    md:   'px-4 py-2 text-sm gap-2 rounded-xl font-semibold',
    lg:   'px-5 py-2.5 text-sm gap-2.5 rounded-xl font-bold shadow-md',
    icon: 'p-2 rounded-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            children,
            className = '',
            disabled,
            ...rest
        },
        ref
    ) => (
        <button
            ref={ref}
            disabled={disabled || isLoading}
            className={[
                'inline-flex items-center justify-center border',
                'transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-1',
                'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer',
                variantStyles[variant],
                sizeStyles[size],
                className,
            ].join(' ')}
            {...rest}
        >
            {isLoading && <Loader2 className="animate-spin h-3.5 w-3.5 shrink-0" />}
            {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </button>
    )
);

Button.displayName = 'Button';
export default Button;
