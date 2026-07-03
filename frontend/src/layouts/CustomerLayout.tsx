import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Utensils, LogOut, Menu, X, CalendarCheck, Home } from 'lucide-react';
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
        <div className="min-h-screen bg-[#FAF8F5] flex flex-col md:flex-row antialiased">
            {/* Desktop Left Sidebar Navigation */}
            <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-[#0C1E15] text-[#C5A880] border-r border-[#C5A880]/15 relative overflow-hidden z-30 select-none">
                {/* Decorative background image at the bottom of the sidebar (15% opacity) */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-44 bg-cover bg-center opacity-15 pointer-events-none z-0"
                    style={{ backgroundImage: 'url("/images/reserved-table.jpg")' }}
                />

                <div className="flex-1 flex flex-col pt-6 pb-6 px-4 relative z-10 justify-between h-full">
                    <div className="space-y-6">
                        {/* Luxury Brand Header */}
                        <div className="flex items-center gap-3 px-2">
                            <div className="p-2 bg-[#b89047] rounded-xl text-white shadow-md shadow-[#b89047]/10">
                                <Utensils className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-lg text-[#FAF8F5] tracking-tight leading-tight">ReserveEase</span>
                                <span className="text-[9px] font-bold text-[#b89047] uppercase tracking-widest mt-0.5">La Gastronomie</span>
                            </div>
                        </div>

                        {/* Subtle decorative separator */}
                        <div className="h-px bg-gradient-to-r from-transparent via-[#C5A880]/20 to-transparent my-4" />

                        {/* Sidebar Links */}
                        <nav className="space-y-1.5">
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${isActive
                                        ? 'text-[#FAF8F5] bg-[#b89047]/25 border border-[#b89047]/30 shadow-xs'
                                        : 'text-[#C5A880]/85 hover:text-[#FAF8F5] hover:bg-[#b89047]/10 border border-transparent'
                                    }`
                                }
                            >
                                <Home className="h-4.5 w-4.5 shrink-0" />
                                Dining Dashboard
                            </NavLink>
                            <NavLink
                                to="/reservations"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${isActive
                                        ? 'text-[#FAF8F5] bg-[#b89047]/25 border border-[#b89047]/30 shadow-xs'
                                        : 'text-[#C5A880]/85 hover:text-[#FAF8F5] hover:bg-[#b89047]/10 border border-transparent'
                                    }`
                                }
                            >
                                <CalendarCheck className="h-4.5 w-4.5 shrink-0" />
                                My Dining Reservations
                            </NavLink>
                        </nav>
                    </div>

                    {/* Bottom User Area */}
                    <div className="space-y-4 pt-4 border-t border-[#C5A880]/15">
                        <div className="flex items-center gap-3 px-2 py-1">
                            <div className="h-9 w-9 rounded-xl bg-[#b89047]/20 text-[#b89047] font-extrabold text-xs flex items-center justify-center tracking-wider border border-[#b89047]/30">
                                {getInitials(user?.name)}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-bold text-[#FAF8F5] truncate">
                                    {user?.name || 'Valued Guest'}
                                </span>
                                <span className="text-[10px] text-[#C5A880]/70 truncate">
                                    {user?.email || 'guest@reserve.com'}
                                </span>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="md"
                            onClick={handleLogout}
                            leftIcon={<LogOut className="h-4 w-4" />}
                            className="w-full text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 border-transparent transition-all cursor-pointer font-bold"
                        >
                            Sign Out
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Mobile Navigation Header */}
            <nav className="flex md:hidden bg-[#0C1E15] text-[#C5A880] border-b border-[#C5A880]/15 sticky top-0 z-50 shadow-md h-16 items-center px-4 justify-between w-full">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-[#b89047] rounded-xl text-white shadow-sm shadow-[#b89047]/20">
                        <Utensils className="h-5 w-5" />
                    </div>
                    <span className="font-extrabold text-lg text-[#FAF8F5] tracking-tight">ReserveEase</span>
                </div>

                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-xl text-[#C5A880] hover:text-[#FAF8F5] hover:bg-[#b89047]/10 focus:outline-none border border-transparent hover:border-[#C5A880]/20 transition-all cursor-pointer"
                >
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="absolute top-16 left-0 right-0 bg-[#0C1E15] border-b border-[#C5A880]/25 px-4 pt-3 pb-5 space-y-2 animate-fade-in z-50">
                        <NavLink
                            to="/dashboard"
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-xl text-base font-bold transition-all ${isActive
                                    ? 'text-[#FAF8F5] bg-[#b89047]/20'
                                    : 'text-[#C5A880] hover:text-[#FAF8F5] hover:bg-[#b89047]/10'
                                }`
                            }
                        >
                            Dining Dashboard
                        </NavLink>
                        <NavLink
                            to="/reservations"
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-xl text-base font-bold transition-all ${isActive
                                    ? 'text-[#FAF8F5] bg-[#b89047]/20'
                                    : 'text-[#C5A880] hover:text-[#FAF8F5] hover:bg-[#b89047]/10'
                                }`
                            }
                        >
                            My Dining Reservations
                        </NavLink>
                        <div className="border-t border-[#C5A880]/15 pt-4 mt-3">
                            <div className="flex items-center gap-3 px-4 py-2.5 mb-3 bg-[#b89047]/10 rounded-xl">
                                <div className="h-8 w-8 rounded-lg bg-[#b89047]/20 text-[#b89047] font-bold text-xs flex items-center justify-center">
                                    {getInitials(user?.name)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-[#FAF8F5]">{user?.name}</span>
                                    <span className="text-xs text-[#C5A880]/70">{user?.email}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold text-rose-400 bg-rose-950/20 border border-rose-950/30 hover:bg-rose-950/40 transition-colors cursor-pointer"
                            >
                                <LogOut className="h-5 w-5" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Layout Main Content Container */}
            <main className="flex-1 md:pl-64 flex flex-col min-w-0">
                <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 animate-fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default CustomerLayout;
