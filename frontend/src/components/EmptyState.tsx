import React from 'react';
import { CalendarX } from 'lucide-react';

interface EmptyStateProps {
    message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message = 'No reservations found' }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-100 shadow-sm max-w-md mx-auto w-full">
            <div className="p-3 bg-slate-50 rounded-full text-slate-400 mb-4">
                <CalendarX className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No Bookings</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-xs">{message}</p>
        </div>
    );
};

export default EmptyState;
