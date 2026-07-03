import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import type { Reservation, ReservationInput } from '../types/index';
import { Edit2, Ban, Calendar, Clock, Users, X } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import { TIME_SLOTS } from '../constants/timeSlots';
import { ConfirmationModal } from './ConfirmationModal';
import { Badge, Button, FormField, SelectField } from './ui';

interface ReservationTableProps {
    reservations: Reservation[];
}

export const ReservationTable: React.FC<ReservationTableProps> = ({ reservations }) => {
    const { updateReservation, cancelReservation } = useAdminStore();

    // States for Edit Modal
    const [editModalOpen, setEditModalOpen] = React.useState(false);
    const [resToEdit, setResToEdit] = React.useState<Reservation | null>(null);

    // States for Cancel Modal
    const [cancelModalOpen, setCancelModalOpen] = React.useState(false);
    const [resToCancel, setResToCancel] = React.useState<Reservation | null>(null);

    // Form settings for edit
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

    React.useEffect(() => {
        if (resToEdit) {
            const formattedDate = new Date(resToEdit.reservationDate).toISOString().split('T')[0];
            reset({
                reservationDate: formattedDate,
                timeSlot: resToEdit.timeSlot,
                guestCount: resToEdit.guestCount
            });
        }
    }, [resToEdit, reset]);

    const handleEditSubmit = async (data: ReservationInput) => {
        if (!resToEdit) return;
        try {
            await updateReservation(resToEdit._id, {
                reservationDate: data.reservationDate,
                timeSlot: data.timeSlot,
                guestCount: Number(data.guestCount)
            });
            toast.success('Reservation updated successfully. Table reallocated automatically.');
            setEditModalOpen(false);
        } catch (error) {
            let errorMsg = 'Failed to update reservation. No suitable table found.';
            if (axios.isAxiosError(error)) {
                errorMsg = error.response?.data?.message || error.message;
            }
            toast.error(errorMsg);
        }
    };

    const handleCancelConfirm = async () => {
        if (!resToCancel) return;
        try {
            await cancelReservation(resToCancel._id);
            toast.success('Reservation cancelled successfully.');
        } catch (error) {
            let errorMsg = 'Failed to cancel reservation.';
            if (axios.isAxiosError(error)) {
                errorMsg = error.response?.data?.message || error.message;
            }
            toast.error(errorMsg);
        }
    };

    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className="w-full">
            {/* Table layout wrapper */}
            <div className="overflow-x-auto rounded-3xl border border-slate-100 premium-shadow-md bg-white">
                <table className="min-w-full divide-y divide-slate-100/80 text-left text-sm">
                    <thead className="bg-slate-50/70 text-[10px] font-bold text-slate-450 uppercase tracking-widest border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4.5">Guest Detail</th>
                            <th className="px-6 py-4.5">Date &amp; Time</th>
                            <th className="px-6 py-4.5 text-center">Guests</th>
                            <th className="px-6 py-4.5">Seating Assignment</th>
                            <th className="px-6 py-4.5">Status</th>
                            <th className="px-6 py-4.5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {reservations.map((res) => {
                            const formattedDate = new Date(res.reservationDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                timeZone: 'UTC'
                            });

                            const isCancelled = res.status.toLowerCase() === 'cancelled';
                            const customerName = typeof res.customer === 'object' && res.customer !== null ? res.customer.name : 'Unknown';
                            const customerEmail = typeof res.customer === 'object' && res.customer !== null ? res.customer.email : '';
                            const tableInfo = typeof res.table === 'object' && res.table !== null
                                ? `Table ${res.table.tableNumber} (Cap: ${res.table.capacity})`
                                : 'Unassigned';

                            return (
                                <tr key={res._id} className="hover:bg-slate-50/40 transition-colors">
                                    <td className="px-6 py-4.5">
                                        <div className="font-bold text-slate-800">{customerName}</div>
                                        <div className="text-xs text-slate-400 font-medium mt-0.5">{customerEmail}</div>
                                    </td>
                                    <td className="px-6 py-4.5">
                                        <div className="font-bold text-slate-700">{formattedDate}</div>
                                        <div className="text-xs text-slate-400 font-semibold mt-0.5">{res.timeSlot}</div>
                                    </td>
                                    <td className="px-6 py-4.5 text-center font-bold text-slate-700">
                                        {res.guestCount}
                                    </td>
                                    <td className="px-6 py-4.5">
                                        <span className="font-bold text-slate-650 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg text-xs">
                                            {tableInfo}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4.5">
                                        <Badge variant={isCancelled ? 'cancelled' : 'confirmed'} showDot>
                                            {res.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4.5 text-right">
                                        {!isCancelled && (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => { setResToEdit(res); setEditModalOpen(true); }}
                                                    className="text-slate-450 hover:text-violet-600 hover:bg-violet-50/50"
                                                    title="Edit Reservation"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => { setResToCancel(res); setCancelModalOpen(true); }}
                                                    className="text-slate-455 hover:text-rose-600 hover:bg-rose-50/50"
                                                    title="Cancel Reservation"
                                                >
                                                    <Ban className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Edit modal */}
            {editModalOpen && resToEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-all duration-300" onClick={() => setEditModalOpen(false)} />
                    <div className="relative bg-white rounded-3xl shadow-xl max-w-md w-full p-6 sm:p-8 border border-slate-100 animate-fade-in z-10">
                        <button
                            onClick={() => setEditModalOpen(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition-all cursor-pointer"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="space-y-6">
                            <div className="space-y-1.5">
                                <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">
                                    Modify Dining Reservation
                                </h3>
                                <p className="text-xs text-slate-400 font-medium">
                                    Adjusting reservation preferences for guest {typeof resToEdit.customer === 'object' && resToEdit.customer !== null ? resToEdit.customer.name : 'Guest'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(handleEditSubmit)} className="space-y-4">
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
                                    label="Preferred Time Slot"
                                    icon={<Clock className="h-4 w-4" />}
                                    error={errors.timeSlot?.message}
                                    {...register('timeSlot', { required: 'Time slot is required' })}
                                >
                                    <option value="">Select Time Slot</option>
                                    {TIME_SLOTS.map((slot) => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                </SelectField>

                                <FormField
                                    label="Number of Guests"
                                    type="number"
                                    min="1"
                                    icon={<Users className="h-4 w-4" />}
                                    error={errors.guestCount?.message}
                                    {...register('guestCount', {
                                        required: 'Guest count is required',
                                        min: { value: 1, message: 'Guest count must be at least 1' }
                                    })}
                                />

                                <div className="bg-slate-50 border border-slate-150 rounded-xl p-4.5 text-xs text-slate-500 leading-relaxed font-semibold">
                                    ℹ️ The ReserveEase system automatically recalculates restaurant occupancy and table floor availability to optimize guest seating layouts.
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-3 mt-8 border-t border-slate-100 pt-6">
                                    <Button variant="secondary" type="button" onClick={() => setEditModalOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="shadow-md">
                                        Confirm Allocation &amp; Save
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel confirmation modal */}
            <ConfirmationModal
                isOpen={cancelModalOpen}
                onClose={() => setCancelModalOpen(false)}
                onConfirm={handleCancelConfirm}
                title="Cancel Dining Reservation"
                message={`Are you sure you want to cancel the table reservation for guest ${resToCancel && typeof resToCancel.customer === 'object' && resToCancel.customer !== null
                    ? resToCancel.customer.name
                    : 'this customer'
                    }? This action is irreversible.`}
                confirmText="Cancel Dining Reservation"
            />
        </div>
    );
};

export default ReservationTable;
