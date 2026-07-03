import React from 'react';
import { ChefHat } from 'lucide-react';

interface EmptyStateProps {
    message?: string;
    title?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
    message = "Reserve your first table and enjoy your next dining experience.", 
    title = "No Dining Reservations Yet" 
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-10 text-center bg-white rounded-3xl border border-slate-100/80 premium-shadow-md max-w-md mx-auto w-full animate-fade-in my-8">
            <div className="p-4 bg-violet-50 text-violet-650 rounded-2xl shadow-xs mb-4">
                <ChefHat className="h-10 w-10 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
            <p className="text-slate-500 text-sm mt-2 max-w-xs leading-relaxed font-medium">{message}</p>
        </div>
    );
};

export default EmptyState;
