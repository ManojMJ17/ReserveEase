import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import type { Reservation, ApiResponse, ReservationInput } from '../types/index';

export interface PaginatedReservations {
    reservations: Reservation[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export const adminApi = {
    /**
     * Pulls all reservations across the system with pagination.
     */
    getAllReservations: async (page = 1, limit = 10) => {
        const response = await apiClient.get<ApiResponse<PaginatedReservations>>(
            `${API_ENDPOINTS.ADMIN.RESERVATIONS}?page=${page}&limit=${limit}`
        );
        return response.data;
    },

    /**
     * Pulls reservations for a target normalized date.
     */
    getReservationsByDate: async (dateStr: string) => {
        const response = await apiClient.get<ApiResponse<Reservation[]>>(
            API_ENDPOINTS.ADMIN.RESERVATIONS_BY_DATE(dateStr)
        );
        return response.data;
    },

    /**
     * Admin modification of a booking with dynamic table reallocation.
     */
    updateReservation: async (id: string, data: Partial<ReservationInput>) => {
        const response = await apiClient.patch<ApiResponse<Reservation>>(
            API_ENDPOINTS.ADMIN.UPDATE_RESERVATION(id),
            data
        );
        return response.data;
    },

    /**
     * Soft cancels a booking.
     */
    cancelReservation: async (id: string) => {
        const response = await apiClient.delete<ApiResponse<Reservation>>(
            API_ENDPOINTS.ADMIN.DELETE_RESERVATION(id)
        );
        return response.data;
    }
};

export default adminApi;
