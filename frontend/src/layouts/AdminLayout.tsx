import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Shield, LayoutDashboard, CalendarDays, Grid, LogOut, Menu, X } from 'lucide-react';

export const AdminLayout: React.FC = () => {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Admin Navbar */}
            <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center gap-2">
                                <Shield className="h-6 w-6 text-violet-400" />
                                <span className="font-bold text-xl text-white">ReserveEase Admin</span>
                            </div>
                            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                                <Link to="/admin" className="text-slate-300 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors">
                                    <LayoutDashboard className="mr-1.5 h-4 w-4" />
                                    Dashboard
                                </Link>
                                <Link to="/admin/reservations" className="text-slate-300 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors">
                                    <CalendarDays className="mr-1.5 h-4 w-4" />
                                    Reservations
                                </Link>
                                <Link to="/admin/tables" className="text-slate-300 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors">
                                    <Grid className="mr-1.5 h-4 w-4" />
                                    Tables
                                </Link>
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center sm:gap-4">
                            <span className="text-sm font-medium text-slate-300">
                                {user?.name || 'Admin'}
                            </span>
                            <button onClick={handleLogout} className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-rose-400 bg-rose-950/50 hover:bg-rose-900/50 transition-colors cursor-pointer">
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                        {/* Mobile menu toggle */}
                        <div className="flex items-center sm:hidden">
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none">
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="sm:hidden bg-slate-900 border-b border-slate-800 px-2 pt-2 pb-3 space-y-1">
                        <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">
                            <LayoutDashboard className="h-5 w-5" />
                            Dashboard
                        </Link>
                        <Link to="/admin/reservations" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">
                            <CalendarDays className="h-5 w-5" />
                            Reservations
                        </Link>
                        <Link to="/admin/tables" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">
                            <Grid className="h-5 w-5" />
                            Tables
                        </Link>
                        <div className="border-t border-slate-800 pt-4 pb-2">
                            <div className="px-3 text-xs text-slate-500 font-medium uppercase mb-2">
                                Logged in as Admin: {user?.name}
                            </div>
                            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-rose-400 hover:bg-rose-950/40 cursor-pointer">
                                <LogOut className="h-5 w-5" />
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Layout Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
