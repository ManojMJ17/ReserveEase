import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { useTableStore } from '../store/tableStore';
import { StatsCard } from '../components/StatsCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
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

    const isFetching = (adminLoading && reservations.length === 0) || (tableLoading && tables.length === 0);

    if (isFetching) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Admin Dashboard</h1>
                <p className="text-slate-500 mt-1">Overview of system bookings, active capacities, and configurations.</p>
            </div>

            {/* Stats Grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Reservations"
                    value={totalReservations}
                    icon={CalendarDays}
                    colorClass="text-violet-600"
                    bgClass="bg-violet-50"
                />
                <StatsCard
                    title="Today's Bookings"
                    value={todayReservations}
                    icon={CalendarCheck}
                    colorClass="text-emerald-600"
                    bgClass="bg-emerald-50"
                />
                <StatsCard
                    title="Active Tables"
                    value={activeTables}
                    icon={Armchair}
                    colorClass="text-sky-600"
                    bgClass="bg-sky-50"
                />
                <StatsCard
                    title="Cancelled Bookings"
                    value={cancelledReservations}
                    icon={CalendarX}
                    colorClass="text-rose-600"
                    bgClass="bg-rose-50"
                />
            </div>

            {/* Quick Navigation Cards */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800">Quick Operations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Manage Reservations Card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between transition-all hover:shadow-md">
                        <div>
                            <div className="p-3 bg-violet-50 text-violet-600 rounded-xl w-fit">
                                <Users className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mt-4">Manage Reservations</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                View all bookings, search by customer, filter by dates, edit dates/slots, or cancel reservations.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/reservations')}
                            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors w-fit group cursor-pointer"
                        >
                            Go to Reservations
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </div>

                    {/* Manage Tables Card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between transition-all hover:shadow-md">
                        <div>
                            <div className="p-3 bg-sky-50 text-sky-600 rounded-xl w-fit">
                                <Settings className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mt-4">Manage Tables</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                Configure table assets layout, add new dining tables, adjust seating capacities, or disable active tables.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/tables')}
                            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors w-fit group cursor-pointer"
                        >
                            Go to Tables
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
