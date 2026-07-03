import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservationStore } from '../store/reservationStore';
import { useAuthStore } from '../store/authStore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Calendar, CalendarCheck, CalendarDays, PlusCircle } from 'lucide-react';

export const CustomerDashboardPage: React.FC = () => {
    const { myReservations, loading, fetchMyReservations } = useReservationStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    React.useEffect(() => {
        fetchMyReservations();
    }, [fetchMyReservations]);

    // Calculate Summary Stats
    const totalReservations = myReservations.length;
    
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const upcomingReservations = myReservations.filter((res) => {
        const resDate = new Date(res.reservationDate);
        resDate.setUTCHours(0, 0, 0, 0);
        return res.status.toLowerCase() === 'confirmed' && resDate >= today;
    }).length;

    const cancelledReservations = myReservations.filter(
        (res) => res.status.toLowerCase() === 'cancelled'
    ).length;

    if (loading && myReservations.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-8">
            {/* Greeting */}
            <div>
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                    Hello, {user?.name || 'Valued Guest'}
                </h1>
                <p className="text-slate-500 mt-1">
                    Welcome to your personal dining portal. Manage bookings and check summaries.
                </p>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-start">
                <button
                    onClick={() => navigate('/reservations')}
                    className="inline-flex items-center gap-2 px-5 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-violet-600 hover:bg-violet-700 shadow-sm transition-colors cursor-pointer"
                >
                    <PlusCircle className="h-5 w-5" />
                    Book a Table
                </button>
            </div>

            {/* Summary Widget Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Bookings */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-5">
                    <div className="p-4 rounded-xl bg-violet-50 text-violet-600">
                        <CalendarDays className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                            Total Bookings
                        </div>
                        <div className="text-3xl font-bold text-slate-800 mt-1">
                            {totalReservations}
                        </div>
                    </div>
                </div>

                {/* Upcoming Bookings */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-5">
                    <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600">
                        <CalendarCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                            Upcoming
                        </div>
                        <div className="text-3xl font-bold text-slate-800 mt-1">
                            {upcomingReservations}
                        </div>
                    </div>
                </div>

                {/* Cancelled Bookings */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-5">
                    <div className="p-4 rounded-xl bg-rose-50 text-rose-600">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                            Cancelled
                        </div>
                        <div className="text-3xl font-bold text-slate-800 mt-1">
                            {cancelledReservations}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboardPage;
