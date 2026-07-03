import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex items-center justify-center p-8">
            <Loader2 className="animate-spin h-8 w-8 text-violet-600" />
        </div>
    );
};

export default LoadingSpinner;
