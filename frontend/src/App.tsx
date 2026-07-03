import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import { AuthLayout } from './layouts/AuthLayout';
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Route Guard
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminReservationsPage } from './pages/AdminReservationsPage';
import { AdminTablesPage } from './pages/AdminTablesPage';

// Auth State
import { useAuthStore } from './store/authStore';

export const App: React.FC = () => {
    const { isAuthenticated, user, token, fetchProfile } = useAuthStore();
    const [isCheckingAuth, setIsCheckingAuth] = React.useState(!!token);

    React.useEffect(() => {
        const restoreAuth = async () => {
            if (token && !user) {
                try {
                    await fetchProfile();
                } catch (error) {
                    console.error('Failed to restore session:', error);
                }
            }
            setIsCheckingAuth(false);
        };
        restoreAuth();
    }, [token, user, fetchProfile]);

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
                    <span className="text-sm font-medium text-slate-500">Restoring session...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/* Public Auth Routes */}
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Route>

                    {/* Customer Routes (Protected) */}
                    <Route
                        element={
                            <ProtectedRoute allowedRoles={['customer']}>
                                <CustomerLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/dashboard" element={<CustomerDashboardPage />} />
                        <Route path="/reservations" element={<ReservationsPage />} />
                    </Route>

                    {/* Admin Routes (Protected) */}
                    <Route
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/admin" element={<AdminDashboardPage />} />
                        <Route path="/admin/reservations" element={<AdminReservationsPage />} />
                        <Route path="/admin/tables" element={<AdminTablesPage />} />
                    </Route>

                    {/* Root Redirect Logic */}
                    <Route
                        path="/"
                        element={
                            isAuthenticated && user ? (
                                <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />

                    {/* Fallback to root */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
            
            {/* Global toast notifications */}
            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
};

export default App;
