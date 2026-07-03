import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Utensils, LogOut, Menu, X } from 'lucide-react';

export const CustomerLayout: React.FC = () => {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Responsive Navbar */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center gap-2">
                                <Utensils className="h-6 w-6 text-violet-600" />
                                <span className="font-bold text-xl text-slate-800">ReserveEase</span>
                            </div>
                            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                                <Link to="/dashboard" className="border-transparent text-slate-600 hover:border-violet-500 hover:text-slate-800 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                    Dashboard
                                </Link>
                                <Link to="/reservations" className="border-transparent text-slate-600 hover:border-violet-500 hover:text-slate-800 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                    My Reservations
                                </Link>
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center sm:gap-4">
                            <span className="text-sm font-medium text-slate-600">
                                {user?.name || 'Customer'}
                            </span>
                            <button onClick={handleLogout} className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer">
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                        {/* Mobile menu toggle */}
                        <div className="flex items-center sm:hidden">
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none">
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="sm:hidden bg-white border-b border-slate-200 px-2 pt-2 pb-3 space-y-1">
                        <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50">
                            Dashboard
                        </Link>
                        <Link to="/reservations" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50">
                            My Reservations
                        </Link>
                        <div className="border-t border-slate-200 pt-4 pb-2">
                            <div className="px-3 text-xs text-slate-500 font-medium uppercase mb-2">
                                Logged in as: {user?.name}
                            </div>
                            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-rose-600 hover:bg-rose-50 cursor-pointer">
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

export default CustomerLayout;
