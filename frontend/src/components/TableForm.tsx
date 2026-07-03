import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import type { Table, TableInput } from '../types/index';
import { useTableStore } from '../store/tableStore';
import { Armchair, Users, X } from 'lucide-react';
import { Button, FormField } from './ui';

interface TableFormProps {
    isOpen: boolean;
    onClose: () => void;
    tableToEdit?: Table | null;
}

export const TableForm: React.FC<TableFormProps> = ({ isOpen, onClose, tableToEdit }) => {
    const { createTable, updateTable, loading } = useTableStore();
    const isEditMode = !!tableToEdit;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<TableInput>({
        defaultValues: {
            tableNumber: '',
            capacity: 2,
            isActive: true
        }
    });

    // Sync input fields when modal status or editing target modifications occur
    React.useEffect(() => {
        if (isOpen) {
            if (tableToEdit) {
                reset({
                    tableNumber: tableToEdit.tableNumber,
                    capacity: tableToEdit.capacity,
                    isActive: tableToEdit.isActive
                });
            } else {
                reset({
                    tableNumber: '',
                    capacity: 2,
                    isActive: true
                });
            }
        }
    }, [isOpen, tableToEdit, reset]);

    const onSubmit = async (data: TableInput) => {
        try {
            if (isEditMode && tableToEdit) {
                await updateTable(tableToEdit._id, {
                    tableNumber: data.tableNumber,
                    capacity: Number(data.capacity),
                    isActive: data.isActive
                });
                toast.success(`Table ${data.tableNumber} updated successfully.`);
            } else {
                await createTable({
                    tableNumber: data.tableNumber,
                    capacity: Number(data.capacity)
                });
                toast.success(`Table ${data.tableNumber} created successfully.`);
            }
            onClose();
        } catch (error) {
            let errorMsg = 'Failed to submit table. Check inputs.';
            if (axios.isAxiosError(error)) {
                errorMsg = error.response?.data?.message || error.message;
            }
            toast.error(errorMsg);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-all duration-300" onClick={onClose} />

            {/* Modal Box */}
            <div className="relative bg-white rounded-3xl premium-shadow-lg max-w-md w-full p-6 sm:p-8 border border-slate-100/80 animate-fade-in z-10">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="space-y-6">
                    <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">
                        {isEditMode ? `Edit Table ${tableToEdit?.tableNumber}` : 'Add Seating Table'}
                    </h3>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            label="Table Number / Label"
                            type="text"
                            placeholder="e.g. T1, T2"
                            icon={<Armchair className="h-4 w-4" />}
                            error={errors.tableNumber?.message}
                            {...register('tableNumber', { required: 'Table number is required' })}
                        />

                        <FormField
                            label="Table Seating Capacity"
                            type="number"
                            min="1"
                            placeholder="4"
                            icon={<Users className="h-4 w-4" />}
                            error={errors.capacity?.message}
                            {...register('capacity', {
                                required: 'Capacity is required',
                                min: { value: 1, message: 'Capacity must be at least 1' }
                            })}
                        />

                        {/* Status Toggle (edit mode only) — styled check toggle container */}
                        {isEditMode && (
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-150/50">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    className="h-4.5 w-4.5 rounded border-slate-300 text-violet-600 focus:ring-violet-500/20 focus:ring-offset-0 cursor-pointer"
                                    {...register('isActive')}
                                />
                                <label htmlFor="isActive" className="text-xs font-bold text-slate-655 cursor-pointer select-none">
                                    Online Reservation Booking Enabled
                                </label>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-3 mt-8 border-t border-slate-105 pt-6">
                            <Button variant="secondary" type="button" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" isLoading={loading} className="shadow-md">
                                {isEditMode ? 'Save Changes' : 'Add Seating Table'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TableForm;
