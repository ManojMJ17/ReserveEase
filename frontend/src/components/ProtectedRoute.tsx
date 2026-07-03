import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
    children: React.ReactElement;
    allowedRoles?: ('admin' | 'customer')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, token } = useAuthStore();
    const location = useLocation();

    // If not logged in, redirect to login page
    if (!isAuthenticated || !token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If user's role is not allowed, redirect to their home dashboard
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        const fallbackPath = user.role === 'admin' ? '/admin' : '/dashboard';
        return <Navigate to={fallbackPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
