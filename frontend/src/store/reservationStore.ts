import { create } from 'zustand';
import type { Reservation } from '../types/index';
import { reservationApi } from '../api/reservationApi';

interface ReservationState {
    myReservations: Reservation[];
    loading: boolean;
    fetchMyReservations: () => Promise<void>;
    createReservation: (data: { reservationDate: string; timeSlot: string; guestCount: number }) => Promise<void>;
    cancelReservation: (id: string) => Promise<void>;
}

export const useReservationStore = create<ReservationState>((set, get) => ({
    myReservations: [],
    loading: false,

    fetchMyReservations: async () => {
        set({ loading: true });
        try {
            const response = await reservationApi.getMyReservations();
            set({ myReservations: response.data, loading: false });
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    createReservation: async (data) => {
        set({ loading: true });
        try {
            await reservationApi.createReservation(data);
            set({ loading: false });
            // Automatically refresh reservations
            await get().fetchMyReservations();
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    cancelReservation: async (id) => {
        set({ loading: true });
        try {
            await reservationApi.cancelReservation(id);
            set({ loading: false });
            // Automatically refresh reservations
            await get().fetchMyReservations();
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    }
}));
