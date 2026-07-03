import React from 'react';
import { useReservationStore } from '../store/reservationStore';
import { ReservationForm } from '../components/ReservationForm';
import { ReservationCard } from '../components/ReservationCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const ReservationsPage: React.FC = () => {
    const { myReservations, loading, fetchMyReservations } = useReservationStore();

    React.useEffect(() => {
        fetchMyReservations();
    }, [fetchMyReservations]);

    return (
        <div className="space-y-10">
            {/* Top Section: Booking Form */}
            <section>
                <ReservationForm />
            </section>

            {/* Bottom Section: Reservation List */}
            <section className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                    <h2 className="text-2xl font-bold text-slate-800">My Reservations</h2>
                    <p className="text-slate-500 text-sm mt-1">
                        View and manage your booked dining arrangements.
                    </p>
                </div>

                {loading && myReservations.length === 0 ? (
                    <LoadingSpinner />
                ) : myReservations.length === 0 ? (
                    <EmptyState message="You haven't booked any tables yet. Use the form above to make a reservation!" />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myReservations.map((reservation) => (
                            <ReservationCard key={reservation._id} reservation={reservation} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default ReservationsPage;
