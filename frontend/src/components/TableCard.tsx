import React from 'react';
import axios from 'axios';
import type { Table } from '../types/index';
import { Armchair, Edit, Ban } from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';
import { useTableStore } from '../store/tableStore';
import { toast } from 'react-hot-toast';

interface TableCardProps {
    table: Table;
    onEdit: (table: Table) => void;
}

export const TableCard: React.FC<TableCardProps> = ({ table, onEdit }) => {
    const { deleteTable } = useTableStore();
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [disabling, setDisabling] = React.useState(false);

    const handleDisable = async () => {
        setDisabling(true);
        try {
            await deleteTable(table._id);
            toast.success(`Table ${table.tableNumber} disabled successfully.`);
        } catch (error) {
            let errorMsg = 'Failed to disable table.';
            if (axios.isAxiosError(error)) {
                errorMsg = error.response?.data?.message || error.message;
            }
            toast.error(errorMsg);
        } finally {
            setDisabling(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between transition-all hover:shadow-md w-full">
            <div>
                {/* Header Status */}
                <div className="flex justify-between items-center mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${table.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                        {table.isActive ? 'Active' : 'Disabled'}
                    </span>
                    <div className="text-xs text-slate-400 font-medium">
                        Capacity: {table.capacity}
                    </div>
                </div>

                {/* Body Details */}
                <div className="flex items-center gap-3.5 mt-2">
                    <div className="p-3 bg-slate-50 text-slate-600 rounded-lg">
                        <Armchair className="h-6 w-6 text-violet-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">
                            Table {table.tableNumber}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Accommodates up to {table.capacity} guests
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="flex gap-2 mt-6">
                <button
                    onClick={() => onEdit(table)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-slate-100 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                    <Edit className="h-3.5 w-3.5" />
                    Edit Table
                </button>

                {table.isActive && (
                    <button
                        onClick={() => setConfirmOpen(true)}
                        disabled={disabling}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-rose-100 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50/50 hover:bg-rose-50 hover:text-rose-700 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        <Ban className="h-3.5 w-3.5" />
                        {disabling ? 'Disabling...' : 'Disable'}
                    </button>
                )}
            </div>

            {/* Confirmation Dialog */}
            <ConfirmationModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDisable}
                title="Disable Table"
                message={`Are you sure you want to disable Table ${table.tableNumber}? Disabled tables will no longer be available for future automated allocations.`}
                confirmText="Disable Table"
            />
        </div>
    );
};

export default TableCard;
