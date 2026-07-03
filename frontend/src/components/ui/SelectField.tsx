import React from 'react';

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    icon?: React.ReactNode;
    error?: string;
    containerClassName?: string;
    children: React.ReactNode;
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
    (
        {
            label,
            icon,
            error,
            containerClassName = '',
            className = '',
            id,
            name,
            children,
            ...rest
        },
        ref
    ) => {
        const fieldId = id ?? name ?? label.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className={['space-y-1.5', containerClassName].join(' ')}>
                <label
                    htmlFor={fieldId}
                    className="block text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                    {label}
                </label>
                <div className="relative rounded-xl">
                    {icon && (
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            {icon}
                        </div>
                    )}
                    <select
                        ref={ref}
                        id={fieldId}
                        name={name}
                        className={[
                            'block w-full border rounded-xl text-sm py-2.5 bg-white text-slate-800 shadow-xs appearance-none',
                            'transition-all duration-200 focus:outline-none focus:ring-4',
                            icon ? 'pl-10' : 'pl-3.5',
                            'pr-10', // Room for custom dropdown arrow icon (optional, or native is styled)
                            error
                                ? 'border-rose-300 focus:ring-rose-500/10 focus:border-rose-500'
                                : 'border-slate-200 focus:ring-gold-500/15 focus:border-gold-500',
                            className,
                        ].join(' ')}
                        {...rest}
                    >
                        {children}
                    </select>
                    {/* Add a premium custom dropdown icon indicator */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                {error && (
                    <p className="text-[11px] text-rose-500 font-medium tracking-wide flex items-center gap-1 animate-fade-in">
                        <span>●</span> {error}
                    </p>
                )}
            </div>
        );
    }
);

SelectField.displayName = 'SelectField';
export default SelectField;
