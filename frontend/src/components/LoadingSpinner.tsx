import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4 animate-pulse">
            <div className="relative flex items-center justify-center">
                {/* Decorative outer glow spinner */}
                <div className="absolute h-10 w-10 rounded-full border-2 border-violet-500/10 border-t-violet-500 animate-spin" />
                <div className="h-6 w-6 rounded-full bg-violet-600/10 text-violet-600 flex items-center justify-center">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                </div>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Fetching latest details...
            </span>
        </div>
    );
};

export default LoadingSpinner;
