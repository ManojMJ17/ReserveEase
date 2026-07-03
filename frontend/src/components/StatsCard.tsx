import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    colorClass?: string;
    bgClass?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon: Icon,
    colorClass = 'text-violet-600',
    bgClass = 'bg-violet-50'
}) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-5 transition-all hover:shadow-md w-full">
            <div className={`p-4 rounded-xl ${bgClass} ${colorClass}`}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {title}
                </div>
                <div className="text-3xl font-bold text-slate-800 mt-1">
                    {value}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
