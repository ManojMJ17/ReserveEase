import React from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Calendar, Clock, Users, Armchair, Trash2 } from 'lucide-react';
import type { Reservation } from '../types/index';
import { useReservationStore } from '../store/reservationStore';

interface ReservationCardProps {
    reservation: Reservation;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({ reservation }) => {
    const { cancelReservation } = useReservationStore();
    const [cancelling, setCancelling] = React.useState(false);

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel this reservation?')) {
            return;
        }

        setCancelling(true);
        try {
            await cancelReservation(reservation._id);
            toast.success('Reservation cancelled successfully.');
        } catch (error) {
            let errorMsg = 'Failed to cancel reservation.';
            if (axios.isAxiosError(error)) {
                errorMsg = error.response?.data?.message || error.message;
            }
            toast.error(errorMsg);
        } finally {
            setCancelling(false);
        }
    };

    // Format UTC normalized reservation date to prevent timezone shift issues
    const formattedDate = new Date(reservation.reservationDate).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
    });

    const isCancelled = reservation.status.toLowerCase() === 'cancelled';

    // Extract table details if object is populated
    const tableInfo = typeof reservation.table === 'object' && reservation.table !== null
        ? `Table ${reservation.table.tableNumber} (Capacity: ${reservation.table.capacity})`
        : 'Assigned Automatically';

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between transition-all hover:shadow-md">
            <div>
                {/* Header Status */}
                <div className="flex justify-between items-center mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${isCancelled
                        ? 'bg-rose-50 text-rose-700 border border-rose-100'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                        {reservation.status}
                    </span>
                    <div className="text-xs text-slate-400 font-medium">
                        ID: {reservation._id.slice(-6).toUpperCase()}
                    </div>
                </div>

                {/* Details list */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 text-sm text-slate-600">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="font-semibold text-slate-800">{formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-sm text-slate-600">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span>{reservation.timeSlot}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-sm text-slate-600">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span>{reservation.guestCount} {reservation.guestCount === 1 ? 'Guest' : 'Guests'}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-sm text-slate-600 border-t border-slate-50 pt-2 mt-2">
                        <Armchair className="h-4 w-4 text-violet-500" />
                        <span className="font-medium text-slate-700">{tableInfo}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            {!isCancelled && (
                <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="w-full flex items-center justify-center gap-2 mt-6 py-2 px-4 border border-rose-100 rounded-lg text-sm font-semibold text-rose-600 bg-rose-50/50 hover:bg-rose-50 hover:text-rose-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                    <Trash2 className="h-4 w-4" />
                    {cancelling ? 'Cancelling...' : 'Cancel Reservation'}
                </button>
            )}
        </div>
    );
};

export default ReservationCard;
