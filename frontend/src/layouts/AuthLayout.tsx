import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const AuthLayout: React.FC = () => {
    const { isAuthenticated, user } = useAuthStore();

    // If already logged in, redirect straight to the dashboard
    if (isAuthenticated && user) {
        return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6 glassmorphism p-8 rounded-2xl shadow-xl">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-violet-600 tracking-tight my-2">
                        ReserveEase
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Table Reservation Management
                    </p>
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
