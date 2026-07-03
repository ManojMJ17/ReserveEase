import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { useTableStore } from '../store/tableStore';
import { StatsCard } from '../components/StatsCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Card, Badge } from '../components/ui';
import { CalendarDays, CalendarCheck, Armchair, CalendarX, ArrowRight, Settings, Users } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
    const { fetchReservations, reservations, loading: adminLoading } = useAdminStore();
    const { fetchTables, tables, loading: tableLoading } = useTableStore();
    const navigate = useNavigate();

    React.useEffect(() => {
        fetchReservations(1, 1000);
        fetchTables();
    }, [fetchReservations, fetchTables]);

    // Summary calculations
    const totalReservations = reservations.length;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayReservations = reservations.filter((res) => {
        const resDate = new Date(res.reservationDate).toISOString().split('T')[0];
        return resDate === todayStr;
    }).length;

    const activeTables = tables.filter((t) => t.isActive).length;

    const cancelledReservations = reservations.filter(
        (res) => res.status.toLowerCase() === 'cancelled'
    ).length;

    // Get 4 most recent reservations for analytics preview
    const recentReservations = [...reservations]
        .sort((a, b) => new Date(b.reservationDate).getTime() - new Date(a.reservationDate).getTime())
        .slice(0, 4);

    const isFetching = (adminLoading && reservations.length === 0) || (tableLoading && tables.length === 0);

    if (isFetching) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-10 max-w-7xl mx-auto animate-fade-in">
            {/* Small Restaurant Hero Banner for Admin Dashboard */}
            <div 
                className="relative rounded-3xl overflow-hidden text-white p-6 sm:p-8 shadow-md border border-slate-900 bg-cover bg-center h-40 flex items-center"
                style={{ backgroundImage: 'url("/images/fine_dining.jpg")' }}
            >
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-slate-950/75 z-0 pointer-events-none" />
                
                <div className="relative z-10 space-y-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-[#b89047]/20 text-[#FAF8F5] border border-[#b89047]/30 mb-1">
                        Operations Console
                    </span>
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Restaurant Operations</h1>
                    <p className="text-slate-350 text-xs sm:text-sm font-medium">
                        Monitor active seating capacities, real-time dining statistics, and floor occupancy.
                    </p>
                </div>
            </div>

            {/* Stats Grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Total Bookings" value={totalReservations} icon={CalendarDays} colorClass="text-violet-650" bgClass="bg-violet-50/70" />
                <StatsCard title="Today's Seating"   value={todayReservations}  icon={CalendarCheck} colorClass="text-emerald-650" bgClass="bg-emerald-50/70" />
                <StatsCard title="Configured Tables"       value={activeTables}        icon={Armchair}      colorClass="text-sky-655"     bgClass="bg-sky-50/70" />
                <StatsCard title="Cancelled Dining"  value={cancelledReservations} icon={CalendarX}   colorClass="text-rose-650"    bgClass="bg-rose-50/70" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Columns: Operations */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Floor Operations</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Manage Reservations Card */}
                        <Card hoverable className="flex flex-col justify-between border-slate-100/80">
                            <div>
                                <div className="p-3 bg-violet-50 text-violet-655 rounded-xl w-fit">
                                    <Users className="h-5 w-5" />
                                </div>
                                <h3 className="text-base font-bold text-slate-800 mt-4">Dining Reservations</h3>
                                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                                    Track gastronomy guest logs, adjust booking schedules, and update table allocation states.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/admin/reservations')}
                                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-755 transition-colors w-fit group cursor-pointer"
                            >
                                View Reservation Logs
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                            </button>
                        </Card>

                        {/* Manage Tables Card */}
                        <Card hoverable className="flex flex-col justify-between border-slate-100/80">
                            <div>
                                <div className="p-3 bg-sky-50 text-sky-655 rounded-xl w-fit">
                                    <Settings className="h-5 w-5" />
                                </div>
                                <h3 className="text-base font-bold text-slate-800 mt-4">Table Availability</h3>
                                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                                    Manage restaurant floor assets, adjust party seating capacities, and configure table availability.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/admin/tables')}
                                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-755 transition-colors w-fit group cursor-pointer"
                            >
                                Configure Table Floor Layout
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                            </button>
                        </Card>
                    </div>
                </div>

                {/* Right Column: Recent Activity Feed */}
                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Live Booking Activity</h2>
                    {recentReservations.length === 0 ? (
                        <Card className="p-6 text-center text-slate-400 text-xs border-dashed border-slate-200">
                            No active dining bookings recorded.
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {recentReservations.map((res) => {
                                const formattedDate = new Date(res.reservationDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    timeZone: 'UTC'
                                });
                                const name = typeof res.customer === 'object' && res.customer !== null ? res.customer.name : 'Guest';
                                const isCancelled = res.status.toLowerCase() === 'cancelled';

                                return (
                                    <Card key={res._id} padding="sm" className="flex items-center justify-between border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">
                                                {name.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-xs font-bold text-slate-700 truncate">{name}</div>
                                                <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5 mt-0.5">
                                                    <span>{formattedDate}</span>
                                                    <span>•</span>
                                                    <span>{res.timeSlot}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant={isCancelled ? 'cancelled' : 'confirmed'} className="text-[10px] px-2 py-0.5">
                                            {res.status}
                                        </Badge>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
