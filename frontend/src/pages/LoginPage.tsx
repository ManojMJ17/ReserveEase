import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import type { LoginInput } from '../types';
import { Button, FormField } from '../components/ui';

export const LoginPage: React.FC = () => {
    const { login, loading } = useAuthStore();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginInput>({
        defaultValues: { email: '', password: '' }
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            await login(data.email, data.password);
            toast.success('Successfully logged in!');
            const role = useAuthStore.getState().user?.role;
            navigate(role === 'admin' ? '/admin' : '/dashboard');
        } catch (error) {
            let errorMsg = 'Login failed. Please check your credentials.';
            if (axios.isAxiosError(error)) {
                errorMsg = error.response?.data?.message || error.message;
            }
            toast.error(errorMsg);
        }
    };

    return (
        <div className="w-full space-y-6">
            <div className="text-center space-y-1.5">
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Welcome Back</h2>
                <p className="text-sm text-slate-500 font-medium">Enter your credentials to access your account</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    icon={<Mail className="h-4 w-4" />}
                    error={errors.email?.message}
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
                    icon={<Lock className="h-4 w-4" />}
                    rightElement={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-1 rounded-md hover:bg-slate-100 transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    }
                    error={errors.password?.message}
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters long'
                        }
                    })}
                />

                <Button type="submit" isLoading={loading} className="w-full mt-2 py-3">
                    {loading ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>

            <div className="text-center text-xs border-t border-slate-100 pt-5">
                <span className="text-slate-400 font-medium">Don't have an account? </span>
                <Link to="/register" className="font-semibold text-violet-600 hover:text-violet-500 transition-colors">
                    Register here
                </Link>
            </div>
        </div>
    );
};

export default LoginPage;
