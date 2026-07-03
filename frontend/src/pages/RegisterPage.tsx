import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Eye, EyeOff, User as UserIcon, Mail, Lock } from 'lucide-react';
import type { RegisterInput } from '../types';
import { Button, FormField } from '../components/ui';

export const RegisterPage: React.FC = () => {
    const { register: registerUser, loading } = useAuthStore();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterInput>({
        defaultValues: { name: '', email: '', password: '' }
    });

    const onSubmit = async (data: RegisterInput) => {
        try {
            await registerUser(data.name, data.email, data.password);
            toast.success('Account created successfully!');
            const role = useAuthStore.getState().user?.role;
            navigate(role === 'admin' ? '/admin' : '/dashboard');
        } catch (error) {
            let errorMsg = 'Registration failed. Please try again.';
            if (axios.isAxiosError(error)) {
                errorMsg = error.response?.data?.message || error.message;
            }
            toast.error(errorMsg);
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Divider and Serif Heading */}
            <div className="text-center space-y-2">
                <div className="w-full flex items-center justify-center">
                    <div className="h-px bg-gradient-to-r from-transparent via-[#b89047]/40 to-transparent w-24" />
                </div>
                <h2 className="text-3xl font-extrabold text-[#0C1E15] tracking-tight font-serif">
                    Reserve Your Table
                </h2>
                <p className="text-xs text-slate-500 font-semibold tracking-wide uppercase">
                    Join us and start booking tables immediately
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    label="Full Name"
                    type="text"
                    placeholder="John Doe"
                    icon={<UserIcon className="h-4.5 w-4.5 text-[#b89047] stroke-[1.8]" />}
                    error={errors.name?.message}
                    className="py-3.5 bg-white/45 border-white/20 text-slate-850 placeholder-slate-500 focus:bg-white/75 focus:border-[#b89047]"
                    {...register('name', { required: 'Full name is required' })}
                />

                <FormField
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    icon={<Mail className="h-4.5 w-4.5 text-[#b89047] stroke-[1.8]" />}
                    error={errors.email?.message}
                    className="py-3.5 bg-white/45 border-white/20 text-slate-850 placeholder-slate-500 focus:bg-white/75 focus:border-[#b89047]"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: 'Please enter a valid email address'
                        }
                    })}
                />

                <FormField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••"
                    icon={<Lock className="h-4.5 w-4.5 text-[#b89047] stroke-[1.8]" />}
                    rightElement={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-1.5 rounded-lg hover:bg-slate-100/50 transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    }
                    error={errors.password?.message}
                    className="py-3.5 bg-white/45 border-white/20 text-slate-850 placeholder-slate-500 focus:bg-white/75 focus:border-[#b89047]"
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters long'
                        }
                    })}
                />

                <Button
                    type="submit"
                    isLoading={loading}
                    className="w-full mt-4 py-3.5 bg-[#0C1E15] hover:bg-[#b89047] hover:border-transparent active:bg-[#9e7530] text-[#FAF8F5] border-transparent rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 font-bold uppercase tracking-wider text-xs"
                >
                    {loading ? 'Creating account...' : 'Sign Up'}
                </Button>
            </form>

            <div className="text-center text-xs border-t border-slate-250/30 pt-5">
                <span className="text-slate-500 font-semibold">Already have an account? </span>
                <Link to="/login" className="font-bold text-[#b89047] hover:text-[#9e7530] transition-colors">
                    Sign in here
                </Link>
            </div>
        </div>
    );
};

export default RegisterPage;
