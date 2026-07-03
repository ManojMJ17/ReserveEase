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
                title="Tables Configuration"
                subtitle="Establish seating capacities, modify labels, or toggle online reservation availability."
                hasDivider
                action={
                    <Button 
                        onClick={handleAdd} 
                        leftIcon={<PlusCircle className="h-4 w-4" />}
                        className="bg-violet-650 hover:bg-violet-550 text-white shadow-md shadow-violet-650/15"
                    >
                        Add New Table
                    </Button>
                }
            />

            {/* Grid display */}
            {loading && tables.length === 0 ? (
                <div className="py-20">
                    <LoadingSpinner />
                </div>
            ) : tables.length === 0 ? (
                <EmptyState message="No physical tables have been configured. Create table records to enable booking allocations!" />
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
