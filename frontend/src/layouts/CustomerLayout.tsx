import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Utensils, LogOut, Menu, X } from 'lucide-react';
import { Button } from '../components/ui';

export const CustomerLayout: React.FC = () => {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name?: string) => {
        if (!name) return 'U';
        return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
    };

    return (
        <div className="min-h-screen bg-slate-50/60 flex flex-col antialiased">
            {/* Responsive Navbar */}
            <nav className="glass-navbar border-b border-slate-200/80 sticky top-0 z-50 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center gap-2.5">
                                <div className="p-2 bg-violet-600 rounded-xl text-white shadow-sm shadow-violet-500/20">
                                    <Utensils className="h-5 w-5" />
                                </div>
                                <span className="font-extrabold text-lg text-slate-900 tracking-tight">ReserveEase</span>
                            </div>
                            <div className="hidden sm:ml-10 sm:flex sm:space-x-6">
                                <NavLink 
                                    to="/dashboard" 
                                    className={({ isActive }) => 
                                        `inline-flex items-center px-3 py-1 text-sm font-semibold transition-all duration-200 relative my-auto h-10 rounded-xl ${
                                            isActive 
                                                ? 'text-violet-600 bg-violet-50/80' 
                                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/60'
                                        }`
                                    }
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink 
                                    to="/reservations" 
                                    className={({ isActive }) => 
                                        `inline-flex items-center px-3 py-1 text-sm font-semibold transition-all duration-200 relative my-auto h-10 rounded-xl ${
                                            isActive 
                                                ? 'text-violet-600 bg-violet-50/80' 
                                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/60'
                                        }`
                                    }
                                >
                                    My Reservations
                                </NavLink>
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center sm:gap-4">
                            {/* User Profile Chip */}
                            <div className="flex items-center gap-3 pl-3 pr-4 py-1.5 bg-slate-50 border border-slate-100 rounded-2xl">
                                <div className="h-7 w-7 rounded-lg bg-violet-600/10 text-violet-600 font-bold text-xs flex items-center justify-center tracking-wider">
                                    {getInitials(user?.name)}
                                </div>
                                <span className="text-sm font-bold text-slate-700">
                                    {user?.name || 'Valued Guest'}
                                </span>
                            </div>
                            
                            <Button
                                variant="soft-danger"
                                size="sm"
                                onClick={handleLogout}
                                leftIcon={<LogOut className="h-3.5 w-3.5" />}
                            >
                                Logout
                            </Button>
                        </div>
                        {/* Mobile menu toggle */}
                        <div className="flex items-center sm:hidden">
                            <button 
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                                className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 focus:outline-none border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="sm:hidden bg-white/95 border-b border-slate-200 px-4 pt-3 pb-4 space-y-2 animate-fade-in">
                        <NavLink 
                            to="/dashboard" 
                            onClick={() => setMobileMenuOpen(false)} 
                            className={({ isActive }) => 
                                `block px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                                    isActive 
                                        ? 'text-violet-600 bg-violet-50' 
                                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50/50'
                                }`
                            }
                        >
                            Dashboard
                        </NavLink>
                        <NavLink 
                            to="/reservations" 
                            onClick={() => setMobileMenuOpen(false)} 
                            className={({ isActive }) => 
                                `block px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                                    isActive 
                                        ? 'text-violet-600 bg-violet-50' 
                                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50/50'
                                }`
                            }
                        >
                            My Reservations
                        </NavLink>
                        <div className="border-t border-slate-100 pt-4 mt-2">
                            <div className="flex items-center gap-3 px-4 py-2.5 mb-2 bg-slate-50 rounded-xl">
                                <div className="h-8 w-8 rounded-lg bg-violet-600/10 text-violet-600 font-bold text-xs flex items-center justify-center">
                                    {getInitials(user?.name)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-700">{user?.name}</span>
                                    <span className="text-xs text-slate-400">{user?.email}</span>
                                </div>
                            </div>
                            <button 
                                onClick={handleLogout} 
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold text-rose-600 bg-rose-50/50 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                                <LogOut className="h-5 w-5" />
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Layout Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <Outlet />
            </main>
        </div>
    );
};

export default CustomerLayout;
