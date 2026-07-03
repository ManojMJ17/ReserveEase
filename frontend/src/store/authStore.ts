import { create } from 'zustand';
import type { User } from '../types/index';
import { authApi } from '../api/authApi';

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    fetchProfile: () => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    isAuthenticated: !!localStorage.getItem('token'),
    
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    
    setToken: (token) => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
        set({ token, isAuthenticated: !!token });
    },
    
    login: async (email, password) => {
        set({ loading: true });
        try {
            const result = await authApi.login({ email, password });
            const { user, token } = result.data;
            localStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true, loading: false });
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },
    
    register: async (name, email, password) => {
        set({ loading: true });
        try {
            const result = await authApi.register({ name, email, password });
            const { user, token } = result.data;
            localStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true, loading: false });
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },
    
    fetchProfile: async () => {
        set({ loading: true });
        try {
            const result = await authApi.getProfile();
            const { user } = result.data;
            set({ user, isAuthenticated: true, loading: false });
        } catch (error) {
            // Clear session storage if token retrieval fails (e.g. invalid signature, expired)
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false, loading: false });
            throw error;
        }
    },
    
    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    }
}));
