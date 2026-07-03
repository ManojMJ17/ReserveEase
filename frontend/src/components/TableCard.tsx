import React from 'react';
import axios from 'axios';
import type { Table } from '../types/index';
import { Armchair, Edit, Ban } from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';
import { useTableStore } from '../store/tableStore';
import { toast } from 'react-hot-toast';
import { Card, Badge, Button } from './ui';

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
        <Card hoverable className="flex flex-col justify-between w-full border-slate-100/90 relative overflow-hidden group">
            {/* Soft border indicator at the top based on table active state */}
            <div className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
                table.isActive ? 'bg-emerald-500' : 'bg-slate-400'
            }`} />

            <div className="pt-2">
                {/* Header Status */}
                <div className="flex justify-between items-center mb-5">
                    <Badge variant={table.isActive ? 'active' : 'disabled'} showDot>
                        {table.isActive ? 'Active' : 'Disabled'}
                    </Badge>
                    <div className="text-[10px] text-slate-400 font-bold tracking-widest bg-slate-50 border border-slate-100/50 px-2 py-0.5 rounded-md">
                        SEATS: {table.capacity}
                    </div>
                </div>

                {/* Body Details */}
                <div className="flex items-center gap-4 mt-2">
                    <div className="p-3.5 bg-gold-50 text-gold-500 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Armchair className="h-6 w-6 stroke-[1.5]" />
                    </div>
                    <div>
                        <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                            Table {table.tableNumber}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Accommodates party size up to {table.capacity} guests
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="flex gap-2.5 mt-7 border-t border-slate-100 pt-5">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(table)}
                    leftIcon={<Edit className="h-3.5 w-3.5" />}
                    className="flex-1 justify-center py-2"
                >
                    Edit Details
                </Button>

                {table.isActive && (
                    <Button
                        variant="soft-danger"
                        size="sm"
                        isLoading={disabling}
                        onClick={() => setConfirmOpen(true)}
                        leftIcon={<Ban className="h-3.5 w-3.5" />}
                        className="flex-1 justify-center py-2"
                    >
                        {disabling ? 'Disabling...' : 'Disable'}
                    </Button>
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
        </Card>
    );
};

export default TableCard;
