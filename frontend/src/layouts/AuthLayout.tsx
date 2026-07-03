import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Utensils } from 'lucide-react';

export const AuthLayout: React.FC = () => {
    const { isAuthenticated, user } = useAuthStore();

    // If already logged in, redirect straight to the dashboard
    if (isAuthenticated && user) {
        return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
            {/* Soft decorative blurred background shapes */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-200/40 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-300/30 blur-3xl pointer-events-none" />
            
            <div className="max-w-md w-full relative z-10 space-y-6">
                {/* Logo and title */}
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3.5 bg-violet-600 rounded-2xl shadow-lg shadow-violet-500/20 text-white transform hover:rotate-6 transition-transform duration-300">
                        <Utensils className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                            ReserveEase
                        </h1>
                        <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">
                            Premium Table Reservations
                        </p>
                    </div>
                </div>

                {/* Pure white premium card */}
                <div className="bg-white/95 border border-slate-100 p-8 sm:p-10 rounded-3xl premium-shadow-lg backdrop-blur-md">
                    <Outlet />
                </div>
                
                {/* Footer metadata */}
                <p className="text-center text-xs text-slate-400 font-medium">
                    &copy; {new Date().getFullYear()} ReserveEase Inc. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default AuthLayout;
