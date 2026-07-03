import React from 'react';
import { useAdminStore } from '../store/adminStore';
import { ReservationTable } from '../components/ReservationTable';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Search, Calendar, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { PageHeader, Button, Card } from '../components/ui';

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
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < pagination.pages) setCurrentPage((prev) => prev + 1);
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
        <div className="space-y-8 max-w-7xl mx-auto">
            <PageHeader
                title="Reservations Manager"
                subtitle="Search customer bookings, filter allocations by date, and modify slots."
                hasDivider
            />

            {/* Filter controls panel */}
            <Card padding="sm" className="bg-slate-50/50 border-slate-200/60 p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md w-full">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Search className="h-4 w-4" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by customer name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 shadow-xs placeholder-slate-400 text-slate-700"
                            />
                        </div>

                        {/* Date Filter Input */}
                        <div className="relative w-full sm:w-52">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Calendar className="h-4 w-4" />
                            </div>
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => {
                                    setDateFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="block w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 shadow-xs text-slate-700 cursor-pointer"
                            />
                        </div>
                    </div>

                    <Button
                        variant="secondary"
                        size="md"
                        onClick={handleReset}
                        leftIcon={<RotateCcw className="h-4 w-4" />}
                        className="w-full md:w-auto justify-center hover:bg-slate-100/80 active:scale-95 transition-all"
                    >
                        Reset Filters
                    </Button>
                </div>
            </Card>

            {/* List Table and Page Control */}
            {loading && reservations.length === 0 ? (
                <div className="py-20">
                    <LoadingSpinner />
                </div>
            ) : filteredReservations.length === 0 ? (
                <EmptyState message="No reservations matching your filter parameters could be found." />
            ) : (
                <div className="space-y-6">
                    <ReservationTable reservations={filteredReservations} />

                    {/* Pagination Bar */}
                    {!dateFilter && pagination.pages > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-200/50 pt-5 px-2">
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                                Page {pagination.page} of {pagination.pages} ({pagination.total} total bookings)
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    onClick={handlePrevPage}
                                    disabled={pagination.page <= 1 || loading}
                                    className="p-2 border border-slate-200/80 rounded-xl"
                                >
                                    <ChevronLeft className="h-4.5 w-4.5" />
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    onClick={handleNextPage}
                                    disabled={pagination.page >= pagination.pages || loading}
                                    className="p-2 border border-slate-200/80 rounded-xl"
                                >
                                    <ChevronRight className="h-4.5 w-4.5" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminReservationsPage;
