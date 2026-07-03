import React from 'react';

export interface PageHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    hasDivider?: boolean;
    className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    action,
    hasDivider = true,
    className = '',
}) => (
    <div
        className={[
            'flex flex-col sm:flex-row justify-between sm:items-start md:items-center gap-4 py-1.5',
            hasDivider ? 'border-b border-slate-200/50 pb-6' : '',
            className,
        ].join(' ')}
    >
        <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {title}
            </h1>
            {subtitle && (
                <p className="text-sm font-medium text-slate-500 max-w-2xl leading-relaxed">
                    {subtitle}
                </p>
            )}
        </div>
        {action && (
            <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                {action}
            </div>
        )}
    </div>
);

export default PageHeader;
