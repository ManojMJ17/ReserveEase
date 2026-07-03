import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservationStore } from '../store/reservationStore';
import { useAuthStore } from '../store/authStore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Card, Button, Badge } from '../components/ui';
import { Calendar, CalendarCheck, CalendarDays, PlusCircle, ArrowRight, Clock, Armchair, HelpCircle } from 'lucide-react';

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

    // Get recent 3 reservations for preview
    const recentReservations = [...myReservations]
        .sort((a, b) => new Date(b.reservationDate).getTime() - new Date(a.reservationDate).getTime())
        .slice(0, 3);

    if (loading && myReservations.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-10 max-w-7xl mx-auto">
            {/* Greeting Hero Block */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
                {/* Decorative glow shapes */}
                <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-violet-600/25 blur-3xl pointer-events-none" />
                <div className="absolute left-[30%] bottom-0 w-60 h-60 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
                
                <div className="max-w-2xl relative z-10 space-y-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-violet-500/10 text-violet-300 border border-violet-500/20">
                        Dining Portal
                    </span>
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Welcome back, <span className="text-violet-400">{user?.name || 'Guest'}</span>
                        </h1>
                        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                            Create new bookings, review table allocations, and check your reservation details seamlessly.
                        </p>
                    </div>
                    <div className="pt-2">
                        <Button
                            size="md"
                            onClick={() => navigate('/reservations')}
                            leftIcon={<PlusCircle className="h-4.5 w-4.5" />}
                            className="bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30"
                        >
                            Book a New Table
                        </Button>
                    </div>
                </div>
            </div>

            {/* Summary cards & Action */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card hoverable className="flex items-center gap-5 border border-slate-100">
                    <div className="p-4 rounded-2xl bg-violet-50 text-violet-600">
                        <CalendarDays className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Total Bookings
                        </div>
                        <div className="text-3xl font-extrabold text-slate-800 mt-1">{totalReservations}</div>
                    </div>
                </Card>

                <Card hoverable className="flex items-center gap-5 border border-slate-100">
                    <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600">
                        <CalendarCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Upcoming
                        </div>
                        <div className="text-3xl font-extrabold text-slate-800 mt-1">{upcomingReservations}</div>
                    </div>
                </Card>

                <Card hoverable className="flex items-center gap-5 border border-slate-100">
                    <div className="p-4 rounded-2xl bg-rose-50 text-rose-600">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Cancelled
                        </div>
                        <div className="text-3xl font-extrabold text-slate-800 mt-1">{cancelledReservations}</div>
                    </div>
                </Card>
            </div>

            {/* Main content grid: Left side lists, Right side hints */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent bookings list */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800">Recent Reservations</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/reservations')}
                            rightIcon={<ArrowRight className="h-4 w-4" />}
                            className="text-violet-600 hover:text-violet-700 hover:bg-violet-50/50"
                        >
                            View All
                        </Button>
                    </div>

                    {recentReservations.length === 0 ? (
                        <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed border-slate-200">
                            <p className="text-sm text-slate-400 font-medium">No recent reservations found.</p>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/reservations')}
                                className="mt-3 text-violet-600"
                            >
                                Book your first table
                            </Button>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {recentReservations.map((res) => {
                                const formattedDate = new Date(res.reservationDate).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    timeZone: 'UTC'
                                });
                                const isCancelled = res.status.toLowerCase() === 'cancelled';
                                const tableInfo = typeof res.table === 'object' && res.table !== null
                                    ? `Table ${res.table.tableNumber}`
                                    : 'Pending Allocation';

                                return (
                                    <Card key={res._id} className="p-4 sm:p-5 flex items-center justify-between border-slate-100 hover:border-violet-100/50">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${isCancelled ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50/80 text-emerald-600'}`}>
                                                <Clock className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm sm:text-base">{formattedDate}</div>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 font-medium mt-1">
                                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {res.timeSlot}</span>
                                                    <span className="flex items-center gap-1"><Armchair className="h-3 w-3" /> {tableInfo}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant={isCancelled ? 'cancelled' : 'confirmed'}>
                                            {res.status}
                                        </Badge>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right side helper info */}
                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-slate-800">Dining Rules &amp; Information</h2>
                    <Card className="bg-slate-50 border-slate-150 p-6 space-y-4">
                        <div className="flex gap-3">
                            <div className="p-2 rounded-lg bg-violet-600/10 text-violet-600 self-start shrink-0">
                                <HelpCircle className="h-4.5 w-4.5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Automatic Allocation</h4>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Our system dynamically assigns the best-fitting available table based on guest count and reservation timing.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 border-t border-slate-200/50 pt-4">
                            <div className="p-2 rounded-lg bg-violet-600/10 text-violet-600 self-start shrink-0">
                                <HelpCircle className="h-4.5 w-4.5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Cancellation Policy</h4>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Reservations can be cancelled up to the reservation time. Cancelled tables are immediately returned to the system pool.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboardPage;
