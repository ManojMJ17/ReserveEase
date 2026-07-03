import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import type { Reservation, ReservationInput } from '../types/index';
import { Edit2, Ban, Calendar, Clock, Users, X } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import { TIME_SLOTS } from '../constants/timeSlots';
import { ConfirmationModal } from './ConfirmationModal';

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
            <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm bg-white">
                <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Date & Time</th>
                            <th className="px-6 py-4 text-center">Guests</th>
                            <th className="px-6 py-4">Assigned Table</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
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
                                <tr key={res._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-800">{customerName}</div>
                                        <div className="text-xs text-slate-400 mt-0.5">{customerEmail}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-700">{formattedDate}</div>
                                        <div className="text-xs text-slate-400 mt-0.5">{res.timeSlot}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center font-medium text-slate-700">
                                        {res.guestCount}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-slate-600">{tableInfo}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${isCancelled
                                            ? 'bg-rose-50 text-rose-700 border border-rose-100'
                                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                            }`}>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {!isCancelled && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setResToEdit(res);
                                                        setEditModalOpen(true);
                                                    }}
                                                    className="p-1.5 text-slate-500 hover:text-violet-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                                                    title="Edit Reservation"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setResToCancel(res);
                                                        setCancelModalOpen(true);
                                                    }}
                                                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                                                    title="Cancel Reservation"
                                                >
                                                    <Ban className="h-4 w-4" />
                                                </button>
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
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150" onClick={() => setEditModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150 z-10">
                        <button
                            onClick={() => setEditModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h3 className="text-lg font-bold text-slate-800 mb-6">
                            Edit Reservation ({typeof resToEdit.customer === 'object' && resToEdit.customer !== null ? resToEdit.customer.name : 'Guest'})
                        </h3>

                        <form onSubmit={handleSubmit(handleEditSubmit)} className="space-y-4">
                            {/* Date Field */}
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
                                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.reservationDate
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

                            {/* Time Slot Field */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Time Slot
                                </label>
                                <div className="relative rounded-lg shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Clock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <select
                                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 ${errors.timeSlot
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

                            {/* Guest Count Field */}
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
                                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.guestCount
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

                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs text-slate-500">
                                * The system will automatically run table optimization algorithms and reallocate a suitable table based on availability for the new configuration.
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors cursor-pointer"
                                >
                                    Reallocate & Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Cancel confirmation modal */}
            <ConfirmationModal
                isOpen={cancelModalOpen}
                onClose={() => setCancelModalOpen(false)}
                onConfirm={handleCancelConfirm}
                title="Cancel Reservation"
                message={`Are you sure you want to cancel the reservation for ${resToCancel && typeof resToCancel.customer === 'object' && resToCancel.customer !== null
                    ? resToCancel.customer.name
                    : 'this customer'
                    }? This action is irreversible.`}
                confirmText="Cancel Reservation"
            />
        </div>
    );
};

export default ReservationTable;
