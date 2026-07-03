import React from 'react';
import { useTableStore } from '../store/tableStore';
import { TableCard } from '../components/TableCard';
import { TableForm } from '../components/TableForm';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { PlusCircle } from 'lucide-react';
import type { Table } from '../types/index';

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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Tables Configuration</h1>
                    <p className="text-slate-500 text-sm mt-1">Configure individual table capacity parameters and status values.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-violet-600 hover:bg-violet-700 shadow-sm transition-colors w-fit cursor-pointer"
                >
                    <PlusCircle className="h-4.5 w-4.5" />
                    Add Table
                </button>
            </div>

            {/* Grid display */}
            {loading && tables.length === 0 ? (
                <LoadingSpinner />
            ) : tables.length === 0 ? (
                <EmptyState message="No tables have been added yet. Click 'Add Table' to add your first physical table asset!" />
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
