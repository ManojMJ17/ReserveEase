import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Utensils } from 'lucide-react';

export const AuthLayout: React.FC = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        }
    }, [user, navigate]);

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 select-none"
            style={{ backgroundImage: 'url("/images/login_background.jpg")' }}
        >
            {/* Darker backdrop overlay and increased blur */}
            <div className="absolute inset-0 bg-slate-950/78 backdrop-blur-[10px] pointer-events-none z-0" />

            <div className="max-w-md w-full relative z-10 flex justify-center">
                {/* Soft glassmorphism card (rgba(255,255,255,0.72), backdrop-blur: 24px, border: rgba(255,255,255,0.28), shadow-2xl) */}
                <div
                    className="w-full bg-white/72 border border-white/28 p-8 sm:p-10 rounded-[32px] shadow-2xl backdrop-blur-2xl animate-fade-in animate-duration-300"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.72)',
                        borderColor: 'rgba(255, 255, 255, 0.28)',
                        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.45)'
                    }}
                >
                    {/* Logo & Tagline moved INSIDE the card at the top center */}
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="p-3 bg-[#0C1E15] rounded-2xl shadow-lg border border-white/20 text-[#b89047] mb-3 transform hover:scale-105 transition-transform duration-300">
                            <Utensils className="h-6 w-6 stroke-[1.8]" />
                        </div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-[#0C1E15]">
                            ReserveEase
                        </h1>
                        <p className="text-[10px] text-[#b89047] font-bold uppercase tracking-widest mt-1">
                            Fine Dining Reservations
                        </p>
                    </div>

                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
