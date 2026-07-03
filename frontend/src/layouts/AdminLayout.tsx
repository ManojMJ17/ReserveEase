import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Shield, LayoutDashboard, CalendarDays, Grid, LogOut, Menu, X } from 'lucide-react';
import { Button } from '../components/ui';

export const AdminLayout: React.FC = () => {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name?: string) => {
        if (!name) return 'A';
        return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
    };

    return (
        <div className="min-h-screen bg-slate-50/60 flex flex-col antialiased">
            {/* Admin Navbar */}
            <nav className="bg-slate-900 sticky top-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center gap-2.5">
                                <div className="p-2 bg-violet-600 rounded-xl text-white shadow-sm shadow-violet-500/20">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <span className="font-extrabold text-lg text-white tracking-tight">ReserveEase Admin</span>
                            </div>
                            <div className="hidden sm:ml-10 sm:flex sm:space-x-6">
                                <NavLink 
                                    to="/admin" 
                                    end
                                    className={({ isActive }) => 
                                        `inline-flex items-center px-3.5 py-1 text-sm font-semibold transition-all duration-200 relative my-auto h-10 rounded-xl ${
                                            isActive 
                                                ? 'text-white bg-slate-800' 
                                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                                        }`
                                    }
                                >
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Dashboard
                                </NavLink>
                                <NavLink 
                                    to="/admin/reservations" 
                                    className={({ isActive }) => 
                                        `inline-flex items-center px-3.5 py-1 text-sm font-semibold transition-all duration-200 relative my-auto h-10 rounded-xl ${
                                            isActive 
                                                ? 'text-white bg-slate-800' 
                                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                                        }`
                                    }
                                >
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    Reservations
                                </NavLink>
                                <NavLink 
                                    to="/admin/tables" 
                                    className={({ isActive }) => 
                                        `inline-flex items-center px-3.5 py-1 text-sm font-semibold transition-all duration-200 relative my-auto h-10 rounded-xl ${
                                            isActive 
                                                ? 'text-white bg-slate-800' 
                                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                                        }`
                                    }
                                >
                                    <Grid className="mr-2 h-4 w-4" />
                                    Tables
                                </NavLink>
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center sm:gap-4">
                            {/* Admin profile chip */}
                            <div className="flex items-center gap-3 pl-3 pr-4 py-1.5 bg-slate-800/50 border border-slate-700/30 rounded-2xl">
                                <div className="h-7 w-7 rounded-lg bg-violet-500/20 text-violet-300 font-bold text-xs flex items-center justify-center tracking-wider border border-violet-500/30">
                                    {getInitials(user?.name)}
                                </div>
                                <span className="text-sm font-bold text-slate-300">
                                    {user?.name || 'Admin User'}
                                </span>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                leftIcon={<LogOut className="h-3.5 w-3.5" />}
                                className="text-rose-400 hover:text-rose-350 hover:bg-rose-950/40 border-transparent active:scale-95"
                            >
                                Logout
                            </Button>
                        </div>
                        {/* Mobile menu toggle */}
                        <div className="flex items-center sm:hidden">
                            <button 
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                                className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-850 focus:outline-none border border-transparent hover:border-slate-800 transition-all cursor-pointer"
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="sm:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-4 space-y-2 animate-fade-in">
                        <NavLink 
                            to="/admin" 
                            end
                            onClick={() => setMobileMenuOpen(false)} 
                            className={({ isActive }) => 
                                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                                    isActive 
                                        ? 'text-white bg-slate-850' 
                                        : 'text-slate-400 hover:text-white hover:bg-slate-850/50'
                                }`
                            }
                        >
                            <LayoutDashboard className="h-5 w-5" />
                            Dashboard
                        </NavLink>
                        <NavLink 
                            to="/admin/reservations" 
                            onClick={() => setMobileMenuOpen(false)} 
                            className={({ isActive }) => 
                                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                                    isActive 
                                        ? 'text-white bg-slate-850' 
                                        : 'text-slate-400 hover:text-white hover:bg-slate-850/50'
                                }`
                            }
                        >
                            <CalendarDays className="h-5 w-5" />
                            Reservations
                        </NavLink>
                        <NavLink 
                            to="/admin/tables" 
                            onClick={() => setMobileMenuOpen(false)} 
                            className={({ isActive }) => 
                                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                                    isActive 
                                        ? 'text-white bg-slate-850' 
                                        : 'text-slate-400 hover:text-white hover:bg-slate-850/50'
                                }`
                            }
                        >
                            <Grid className="h-5 w-5" />
                            Tables
                        </NavLink>
                        <div className="border-t border-slate-800 pt-4 mt-2">
                            <div className="flex items-center gap-3 px-4 py-2.5 mb-2 bg-slate-850/50 border border-slate-800/30 rounded-xl">
                                <div className="h-8 w-8 rounded-lg bg-violet-500/20 text-violet-300 font-bold text-xs flex items-center justify-center border border-violet-500/20">
                                    {getInitials(user?.name)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-350">{user?.name}</span>
                                    <span className="text-xs text-slate-500">{user?.email}</span>
                                </div>
                            </div>
                            <button 
                                onClick={handleLogout} 
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold text-rose-400 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-950/30 transition-colors cursor-pointer"
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

export default AdminLayout;
