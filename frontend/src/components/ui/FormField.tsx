import React from 'react';

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: React.ReactNode;
    rightElement?: React.ReactNode;
    error?: string;
    containerClassName?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
    (
        {
            label,
            icon,
            rightElement,
            error,
            containerClassName = '',
            className = '',
            id,
            name,
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
                    <input
                        ref={ref}
                        id={fieldId}
                        name={name}
                        className={[
                            'block w-full border rounded-xl text-sm py-2.5 bg-white text-slate-800 placeholder-slate-400 shadow-xs',
                            'transition-all duration-200 focus:outline-none focus:ring-4',
                            icon ? 'pl-10' : 'pl-3.5',
                            rightElement ? 'pr-10' : 'pr-3.5',
                            error
                                ? 'border-rose-300 focus:ring-rose-500/10 focus:border-rose-500'
                                : 'border-slate-200 focus:ring-gold-500/15 focus:border-gold-500',
                            className,
                        ].join(' ')}
                        {...rest}
                    />
                    {rightElement && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {rightElement}
                        </div>
                    )}
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

FormField.displayName = 'FormField';
export default FormField;
