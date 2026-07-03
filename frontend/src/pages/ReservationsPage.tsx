import React from 'react';
import { useReservationStore } from '../store/reservationStore';
import { ReservationForm } from '../components/ReservationForm';
import { ReservationCard } from '../components/ReservationCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageHeader } from '../components/ui';

export const ReservationsPage: React.FC = () => {
    const { myReservations, loading, fetchMyReservations } = useReservationStore();

    React.useEffect(() => {
        fetchMyReservations();
    }, [fetchMyReservations]);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <PageHeader
                title="Bookings &amp; Reservations"
                subtitle="Schedule table reservations and view historical allocations."
                hasDivider
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left side: Reservation Form */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <ReservationForm />
                    </div>
                </div>

                {/* Right side: List of reservations */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">Active &amp; Past Bookings</h3>
                    
                    {loading && myReservations.length === 0 ? (
                        <LoadingSpinner />
                    ) : myReservations.length === 0 ? (
                        <EmptyState message="You don't have any table reservations registered in our system yet. Complete the form to establish your booking!" />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {myReservations.map((reservation) => (
                                <ReservationCard key={reservation._id} reservation={reservation} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReservationsPage;
