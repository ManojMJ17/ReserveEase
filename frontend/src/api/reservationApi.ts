import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import type { Reservation, ApiResponse, ReservationInput } from '../types/index';

export const reservationApi = {
    /**
     * Submits a reservation request for automatic table allocation.
     */
    createReservation: async (data: ReservationInput) => {
        const response = await apiClient.post<ApiResponse<Reservation>>(
            API_ENDPOINTS.RESERVATIONS.BASE,
            data
        );
        return response.data;
    },

    /**
     * Fetches current customer's list of reservations.
     */
    getMyReservations: async () => {
        const response = await apiClient.get<ApiResponse<Reservation[]>>(
            API_ENDPOINTS.RESERVATIONS.MY
        );
        return response.data;
    },

    /**
     * Soft cancels an existing reservation.
     */
    cancelReservation: async (id: string) => {
        const response = await apiClient.delete<ApiResponse<Reservation>>(
            API_ENDPOINTS.RESERVATIONS.CANCEL(id)
        );
        return response.data;
    }
};

export default reservationApi;
