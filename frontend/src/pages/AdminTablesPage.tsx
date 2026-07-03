import React from 'react';
import { useTableStore } from '../store/tableStore';
import { TableCard } from '../components/TableCard';
import { TableForm } from '../components/TableForm';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { PlusCircle } from 'lucide-react';
import type { Table } from '../types/index';
import { PageHeader, Button } from '../components/ui';

export const AdminTablesPage: React.FC = () => {
    const { fetchTables, tables, loading } = useTableStore();
    const [formOpen, setFormOpen] = React.useState(false);
    const [selectedTable, setSelectedTable] = React.useState<Table | null>(null);

    React.useEffect(() => {
        fetchTables();
    }, [fetchTables]);

    const handleEdit = (table: Table) => {
        setSelectedTable(table);
        setFormOpen(true);
    };

    const handleAdd = () => {
        setSelectedTable(null);
        setFormOpen(true);
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <PageHeader
                title="Table Availability"
                subtitle="Establish guest seating capacities, modify table numbers, or toggle online booking states."
                hasDivider
                action={
                    <Button 
                        onClick={handleAdd} 
                        leftIcon={<PlusCircle className="h-4 w-4" />}
                        className="bg-[#b89047] hover:bg-[#a6803b] text-white border-transparent shadow-md shadow-gold-500/15"
                    >
                        Add Dining Table
                    </Button>
                }
            />

            {/* Grid display */}
            {loading && tables.length === 0 ? (
                <div className="py-20">
                    <LoadingSpinner />
                </div>
            ) : tables.length === 0 ? (
                <EmptyState message="No physical tables have been configured. Add dining tables to enable guest bookings." />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tables.map((table) => (
                        <TableCard key={table._id} table={table} onEdit={handleEdit} />
                    ))}
                </div>
            )}

            {/* Edit/Add Overlay Form */}
            <TableForm
                isOpen={formOpen}
                onClose={() => setFormOpen(false)}
                tableToEdit={selectedTable}
            />
        </div>
    );
};

export default AdminTablesPage;
