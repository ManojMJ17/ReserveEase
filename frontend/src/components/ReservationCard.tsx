import React from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Calendar, Clock, Users, Armchair, Trash2 } from 'lucide-react';
import type { Reservation } from '../types/index';
import { useReservationStore } from '../store/reservationStore';
import { Card, Badge, Button } from './ui';

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
        : 'Allocated Automatically';

    return (
        <Card hoverable className="flex flex-col justify-between border-slate-100/90 relative overflow-hidden group">
            {/* Soft border indicator at the top based on status */}
            <div className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
                isCancelled ? 'bg-rose-500' : 'bg-gold-500'
            }`} />

            <div className="pt-2">
                {/* Header Status */}
                <div className="flex justify-between items-center mb-5">
                    <Badge variant={isCancelled ? 'cancelled' : 'confirmed'} showDot>
                        {reservation.status}
                    </Badge>
                    <div className="text-[10px] text-slate-400 font-bold tracking-widest bg-slate-50 border border-slate-100/50 px-2 py-0.5 rounded-md">
                        ID: {reservation._id.slice(-6).toUpperCase()}
                    </div>
                </div>

                {/* Details list */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="p-2 bg-slate-50 text-slate-400 rounded-lg shrink-0">
                            <Calendar className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-slate-800">{formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="p-2 bg-slate-50 text-slate-400 rounded-lg shrink-0">
                            <Clock className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-slate-700">{reservation.timeSlot}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="p-2 bg-slate-50 text-slate-400 rounded-lg shrink-0">
                            <Users className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-slate-700">
                            {reservation.guestCount} {reservation.guestCount === 1 ? 'Guest' : 'Guests'}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm border-t border-slate-100 pt-4 mt-2">
                        <div className="p-2 bg-gold-50 text-gold-500 rounded-lg shrink-0">
                            <Armchair className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-slate-800">{tableInfo}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            {!isCancelled && (
                <Button
                    variant="soft-danger"
                    isLoading={cancelling}
                    onClick={handleCancel}
                    leftIcon={<Trash2 className="h-4 w-4" />}
                    className="w-full mt-6 py-2.5 hover:bg-rose-100 transition-colors"
                >
                    {cancelling ? 'Cancelling Booking...' : 'Cancel Dining Booking'}
                </Button>
            )}
        </Card>
    );
};

export default ReservationCard;
