import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useReservationStore } from '../store/reservationStore';
import { TIME_SLOTS } from '../constants/timeSlots';
import { Calendar, Clock, Users, ArrowRight } from 'lucide-react';
import type { ReservationInput } from '../types';
import { Card, Button, FormField, SelectField } from './ui';

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
        <Card className="w-full relative overflow-hidden border-slate-100/90 p-6 sm:p-8">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 to-indigo-600" />
            
            <div className="space-y-6">
                <div className="text-center space-y-1.5">
                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Book a Table</h2>
                    <p className="text-xs text-slate-400 font-medium">Select your preferences to check table availability</p>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-4">
                        <FormField
                            label="Reservation Date"
                            type="date"
                            min={todayStr}
                            icon={<Calendar className="h-4 w-4" />}
                            error={errors.reservationDate?.message}
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

                        <SelectField
                            label="Time Slot"
                            icon={<Clock className="h-4 w-4" />}
                            error={errors.timeSlot?.message}
                            {...register('timeSlot', { required: 'Time slot is required' })}
                        >
                            <option value="">Select Slot</option>
                            {TIME_SLOTS.map((slot) => (
                                <option key={slot} value={slot}>{slot}</option>
                            ))}
                        </SelectField>

                        <FormField
                            label="Number of Guests"
                            type="number"
                            min="1"
                            placeholder="2"
                            icon={<Users className="h-4 w-4" />}
                            error={errors.guestCount?.message}
                            {...register('guestCount', {
                                required: 'Guest count is required',
                                min: { value: 1, message: 'Guest count must be at least 1' }
                            })}
                        />
                    </div>

                    <Button 
                        type="submit" 
                        isLoading={loading} 
                        className="w-full mt-4 py-3 shadow-lg shadow-violet-650/15"
                        rightIcon={<ArrowRight className="h-4 w-4 ml-1" />}
                    >
                        {loading ? 'Booking Table...' : 'Confirm Reservation'}
                    </Button>
                </form>
            </div>
        </Card>
    );
};

export default ReservationForm;
