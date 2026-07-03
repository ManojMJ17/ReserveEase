import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useReservationStore } from '../store/reservationStore';
import { TIME_SLOTS } from '../constants/timeSlots';
import { Calendar, Clock, Users, Loader2 } from 'lucide-react';
import type { ReservationInput } from '../types';

export const ReservationForm: React.FC = () => {
    const { createReservation, loading } = useReservationStore();
    const todayStr = new Date().toISOString().split('T')[0];

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ReservationInput>({
        defaultValues: {
            reservationDate: '',
            timeSlot: '',
            guestCount: 1
        }
    });

    const onSubmit = async (data: ReservationInput) => {
        try {
            await createReservation({
                reservationDate: data.reservationDate,
                timeSlot: data.timeSlot,
                guestCount: Number(data.guestCount)
            });
            toast.success('Table reserved successfully!');
            reset();
        } catch (error) {
            let errorMsg = 'Failed to book table. No tables are available.';
            if (axios.isAxiosError(error)) {
                errorMsg = error.response?.data?.message || error.message;
            }
            toast.error(errorMsg);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 max-w-xl mx-auto w-full">
            <h2 className="text-xl font-bold text-slate-800 mb-4 text-center">Book a Table</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Date field */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                            Reservation Date
                        </label>
                        <div className="relative rounded-lg shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="date"
                                min={todayStr}
                                className={`block w-full pl-10 pr-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 ${
                                    errors.reservationDate
                                        ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500'
                                        : 'border-slate-200 focus:ring-violet-100 focus:border-violet-500'
                                }`}
                                {...register('reservationDate', {
                                    required: 'Reservation date is required',
                                    validate: (value) => {
                                        const today = new Date();
                                        today.setUTCHours(0, 0, 0, 0);
                                        const inputDate = new Date(value);
                                        inputDate.setUTCHours(0, 0, 0, 0);
                                        return inputDate >= today || 'Date cannot be in the past';
                                    }
                                })}
                            />
                        </div>
                        {errors.reservationDate && (
                            <p className="mt-1 text-xs text-rose-500 font-medium">{errors.reservationDate.message}</p>
                        )}
                    </div>

                    {/* Time Slot field */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                            Time Slot
                        </label>
                        <div className="relative rounded-lg shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Clock className="h-5 w-5 text-slate-400" />
                            </div>
                            <select
                                className={`block w-full pl-10 pr-3 py-2 border rounded-lg text-sm bg-white transition-colors focus:outline-none focus:ring-2 ${
                                    errors.timeSlot
                                        ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500'
                                        : 'border-slate-200 focus:ring-violet-100 focus:border-violet-500'
                                }`}
                                {...register('timeSlot', {
                                    required: 'Time slot is required'
                                })}
                            >
                                <option value="">Select Slot</option>
                                {TIME_SLOTS.map((slot) => (
                                    <option key={slot} value={slot}>
                                        {slot}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {errors.timeSlot && (
                            <p className="mt-1 text-xs text-rose-500 font-medium">{errors.timeSlot.message}</p>
                        )}
                    </div>
                </div>

                {/* Guest Count field */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Number of Guests
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Users className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="number"
                            min="1"
                            placeholder="2"
                            className={`block w-full pl-10 pr-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 ${
                                errors.guestCount
                                    ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500'
                                    : 'border-slate-200 focus:ring-violet-100 focus:border-violet-500'
                            }`}
                            {...register('guestCount', {
                                required: 'Guest count is required',
                                min: {
                                    value: 1,
                                    message: 'Guest count must be at least 1'
                                }
                            })}
                        />
                    </div>
                    {errors.guestCount && (
                        <p className="mt-1 text-xs text-rose-500 font-medium">{errors.guestCount.message}</p>
                    )}
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 mt-2 py-2 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 transition-colors cursor-pointer"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin h-4 w-4" />
                            Booking Table...
                        </>
                    ) : (
                        'Book Now'
                    )}
                </button>
            </form>
        </div>
    );
};

export default ReservationForm;
