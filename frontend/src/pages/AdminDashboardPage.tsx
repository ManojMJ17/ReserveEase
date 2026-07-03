import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { useTableStore } from '../store/tableStore';
import { StatsCard } from '../components/StatsCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Card, PageHeader, Badge } from '../components/ui';
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
        <div className="space-y-10 max-w-7xl mx-auto">
            <PageHeader
                title="System Overview"
                subtitle="Real-time analytics, reservation statistics, and configuration states."
                hasDivider
            />

            {/* Stats Grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Total Reservations" value={totalReservations} icon={CalendarDays} colorClass="text-violet-650" bgClass="bg-violet-50/70" />
                <StatsCard title="Today's Bookings"   value={todayReservations}  icon={CalendarCheck} colorClass="text-emerald-650" bgClass="bg-emerald-50/70" />
                <StatsCard title="Active Tables"       value={activeTables}        icon={Armchair}      colorClass="text-sky-655"     bgClass="bg-sky-50/70" />
                <StatsCard title="Cancelled Bookings"  value={cancelledReservations} icon={CalendarX}   colorClass="text-rose-650"    bgClass="bg-rose-50/70" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Columns: Operations */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Quick Operations</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Manage Reservations Card */}
                        <Card hoverable className="flex flex-col justify-between border-slate-100/80">
                            <div>
                                <div className="p-3 bg-violet-50 text-violet-655 rounded-xl w-fit">
                                    <Users className="h-5 w-5" />
                                </div>
                                <h3 className="text-base font-bold text-slate-800 mt-4">Reservations Logs</h3>
                                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                                    Track, reallocate, search, filter, or manually update reservation statuses.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/admin/reservations')}
                                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-755 transition-colors w-fit group cursor-pointer"
                            >
                                Open Reservations
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                            </button>
                        </Card>

                        {/* Manage Tables Card */}
                        <Card hoverable className="flex flex-col justify-between border-slate-100/80">
                            <div>
                                <div className="p-3 bg-sky-50 text-sky-655 rounded-xl w-fit">
                                    <Settings className="h-5 w-5" />
                                </div>
                                <h3 className="text-base font-bold text-slate-800 mt-4">Table Layouts</h3>
                                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                                    Add physical dining tables, edit capacities, or adjust system allocation availability.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/admin/tables')}
                                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-755 transition-colors w-fit group cursor-pointer"
                            >
                                Open Tables Setup
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                            </button>
                        </Card>
                    </div>
                </div>

                {/* Right Column: Recent Activity Feed */}
                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Recent Activity</h2>
                    {recentReservations.length === 0 ? (
                        <Card className="p-6 text-center text-slate-400 text-xs border-dashed border-slate-200">
                            No reservations recorded.
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
