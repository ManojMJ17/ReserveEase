import { create } from 'zustand';
import type { Reservation } from '../types/index';
import { adminApi } from '../api/adminApi';

interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

interface AdminState {
    reservations: Reservation[];
    pagination: PaginationInfo;
    loading: boolean;
    fetchReservations: (page?: number, limit?: number) => Promise<void>;
    fetchReservationsByDate: (dateStr: string) => Promise<void>;
    updateReservation: (id: string, data: { reservationDate?: string; timeSlot?: string; guestCount?: number }) => Promise<void>;
    cancelReservation: (id: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
    reservations: [],
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0
    },
    loading: false,

    fetchReservations: async (page = 1, limit = 10) => {
        set({ loading: true });
        try {
            const response = await adminApi.getAllReservations(page, limit);
            set({
                reservations: response.data.reservations,
                pagination: response.data.pagination,
                loading: false
            });
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    fetchReservationsByDate: async (dateStr: string) => {
        set({ loading: true });
        try {
            const response = await adminApi.getReservationsByDate(dateStr);
            set({
                reservations: response.data,
                pagination: {
                    total: response.data.length,
                    page: 1,
                    limit: response.data.length || 10,
                    pages: 1
                },
                loading: false
            });
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    updateReservation: async (id, data) => {
        set({ loading: true });
        try {
            await adminApi.updateReservation(id, data);
            set({ loading: false });
            // Refresh current page
            const { page, limit } = get().pagination;
            await get().fetchReservations(page, limit);
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    cancelReservation: async (id) => {
        set({ loading: true });
        try {
            await adminApi.cancelReservation(id);
            set({ loading: false });
            // Refresh current page
            const { page, limit } = get().pagination;
            await get().fetchReservations(page, limit);
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    }
}));
export default useAdminStore;
