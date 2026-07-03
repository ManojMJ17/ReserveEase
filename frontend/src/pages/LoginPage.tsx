import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import type { LoginInput } from '../types';

export const LoginPage: React.FC = () => {
    const { login, loading } = useAuthStore();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginInput>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            await login(data.email, data.password);
            toast.success('Successfully logged in!');
            
            const role = useAuthStore.getState().user?.role;
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            let errorMsg = 'Login failed. Please check your credentials.';
            if (axios.isAxiosError(error)) {
                errorMsg = error.response?.data?.message || error.message;
            }
            toast.error(errorMsg);
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold text-slate-800 text-center mb-6">Welcome Back</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Field */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Email Address
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className={`block w-full pl-10 pr-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 ${
                                errors.email
                                    ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500'
                                    : 'border-slate-200 focus:ring-violet-100 focus:border-violet-500'
                            }`}
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: 'Please enter a valid email address'
                                }
                            })}
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email.message}</p>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Password
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••"
                            className={`block w-full pl-10 pr-10 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 ${
                                errors.password
                                    ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500'
                                    : 'border-slate-200 focus:ring-violet-100 focus:border-violet-500'
                            }`}
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters long'
                                }
                            })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-xs text-rose-500 font-medium">{errors.password.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 transition-colors cursor-pointer"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin h-4 w-4" />
                            Signing in...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </button>
            </form>

            <div className="mt-6 text-center text-xs">
                <span className="text-slate-500">Don't have an account? </span>
                <Link to="/register" className="font-semibold text-violet-600 hover:text-violet-500 transition-colors">
                    Register here
                </Link>
            </div>
        </div>
    );
};

export default LoginPage;
