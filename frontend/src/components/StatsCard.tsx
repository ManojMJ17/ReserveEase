import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card } from './ui';

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
        <Card hoverable className="p-6 border border-slate-100/80 flex flex-col justify-between h-36">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {title}
                </span>
                <div className={`p-2.5 rounded-xl ${bgClass} ${colorClass} shadow-xs`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <div className="space-y-1">
                <div className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</div>
                <div className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase flex items-center gap-1">
                    <span className="text-emerald-500">●</span> Real-time Sync
                </div>
            </div>
        </Card>
    );
};

export default StatsCard;
