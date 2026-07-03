import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import type { User, ApiResponse, LoginInput, RegisterInput } from '../types/index';

export const authApi = {
    /**
     * Registers a new customer user.
     */
    register: async (data: RegisterInput) => {
        const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>(
            API_ENDPOINTS.AUTH.REGISTER,
            data
        );
        return response.data;
    },

    /**
     * Authenticates a user (admin or customer).
     */
    login: async (data: LoginInput) => {
        const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>(
            API_ENDPOINTS.AUTH.LOGIN,
            data
        );
        return response.data;
    },

    /**
     * Resolves the current session's user profile.
     */
    getProfile: async () => {
        const response = await apiClient.get<ApiResponse<{ user: User }>>(
            API_ENDPOINTS.AUTH.ME
        );
        return response.data;
    }
};

export default authApi;
