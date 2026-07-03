import React from 'react';
import { useAdminStore } from '../store/adminStore';
import { ReservationTable } from '../components/ReservationTable';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Search, Calendar, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

export const AdminReservationsPage: React.FC = () => {
    const {
        fetchReservations,
        fetchReservationsByDate,
        reservations,
        pagination,
        loading
    } = useAdminStore();

    const [searchTerm, setSearchTerm] = React.useState('');
    const [dateFilter, setDateFilter] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(1);
    const limit = 10;

    // Trigger load on query filter adjustments or pagination updates
    React.useEffect(() => {
        if (dateFilter) {
            fetchReservationsByDate(dateFilter);
        } else {
            fetchReservations(currentPage, limit);
        }
    }, [currentPage, dateFilter, fetchReservations, fetchReservationsByDate]);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < pagination.pages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    // Client-side text matching by customer name
    const filteredReservations = reservations.filter((res) => {
        const customerName = typeof res.customer === 'object' && res.customer !== null ? res.customer.name : '';
        return customerName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleReset = () => {
        setSearchTerm('');
        setDateFilter('');
        setCurrentPage(1);
        fetchReservations(1, limit);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Reservations</h1>
                    <p className="text-slate-500 text-sm mt-1">Configure and manage all bookings inside the restaurant.</p>
                </div>
            </div>

            {/* Filters panel */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-1">
                    {/* Customer search filter */}
                    <div className="relative rounded-lg shadow-sm flex-1 max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by customer name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-500 bg-slate-50/50 focus:bg-white"
                        />
                    </div>

                    {/* Booking Date search filter */}
                    <div className="relative rounded-lg shadow-sm w-full sm:w-48">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => {
                                setDateFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="block w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-500 bg-slate-50/50 focus:bg-white cursor-pointer"
                        />
                    </div>
                </div>

                <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors w-full sm:w-auto justify-center cursor-pointer"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset Filters
                </button>
            </div>

            {/* Data views list */}
            {loading && reservations.length === 0 ? (
                <LoadingSpinner />
            ) : filteredReservations.length === 0 ? (
                <EmptyState message="No reservations found matching the selected filters." />
            ) : (
                <div className="space-y-4">
                    <ReservationTable reservations={filteredReservations} />

                    {/* Pagination Controls */}
                    {!dateFilter && pagination.pages > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-100 pt-4 px-2">
                            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                                Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={pagination.page <= 1 || loading}
                                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={handleNextPage}
                                    disabled={pagination.page >= pagination.pages || loading}
                                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminReservationsPage;
