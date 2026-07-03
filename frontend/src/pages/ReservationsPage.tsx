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
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Premium Custom Hero/Header Section */}
            <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-100/80 premium-shadow-md flex items-center h-[240px] select-none animate-fade-in">
                {/* Left content block (Title & Subtitle) */}
                <div className="relative z-20 flex-1 pl-8 sm:pl-12 pr-6 max-w-xl">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-[#b89047]/10 text-[#b89047] border border-[#b89047]/20 mb-3">
                        Gastronomy Bookings
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Dining Reservations
                    </h1>
                    <p className="text-sm font-semibold text-slate-500 mt-2 leading-relaxed">
                        Reserve your fine dining table and view your gastronomy booking history.
                    </p>
                </div>

                {/* Right background image (45% width, fades into white bg on left edge) */}
                <div 
                    className="absolute right-0 top-0 bottom-0 w-[45%] hidden md:block bg-cover bg-center z-10"
                    style={{ backgroundImage: 'url("/images/restaurant_interior.jpeg")' }}
                >
                    {/* Left-to-right fade gradient to blend naturally with the card white background */}
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/60 to-transparent z-25 pointer-events-none" />
                    {/* Subtle dark overlay only on the image area to improve contrast */}
                    <div className="absolute inset-0 bg-slate-950/15 z-0" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left side: Reservation Form */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <ReservationForm />
                    </div>
                </div>

                {/* Right side: List of reservations */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">Your Gastronomy Bookings</h3>
                    
                    {loading && myReservations.length === 0 ? (
                        <LoadingSpinner />
                    ) : myReservations.length === 0 ? (
                        <EmptyState message="No dining reservations yet. Reserve your first table and enjoy your next dining experience." />
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
