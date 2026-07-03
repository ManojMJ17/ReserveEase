import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import type { Table, TableInput } from '../types/index';
import { useTableStore } from '../store/tableStore';
import { Armchair, Users, Loader2, X } from 'lucide-react';

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
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150" onClick={onClose}></div>

            {/* Modal Box */}
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150 z-10">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                    <X className="h-5 w-5" />
                </button>

                <h3 className="text-lg font-bold text-slate-800 mb-6">
                    {isEditMode ? `Edit Table ${tableToEdit?.tableNumber}` : 'Add New Table'}
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Table Number */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                            Table Number / Label
                        </label>
                        <div className="relative rounded-lg shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Armchair className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="e.g. T1, T2"
                                className={`block w-full pl-10 pr-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 ${errors.tableNumber
                                        ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500'
                                        : 'border-slate-200 focus:ring-violet-100 focus:border-violet-500'
                                    }`}
                                {...register('tableNumber', {
                                    required: 'Table number is required'
                                })}
                            />
                        </div>
                        {errors.tableNumber && (
                            <p className="mt-1 text-xs text-rose-500 font-medium">{errors.tableNumber.message}</p>
                        )}
                    </div>

                    {/* Capacity */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                            Seating Capacity
                        </label>
                        <div className="relative rounded-lg shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Users className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="number"
                                min="1"
                                placeholder="4"
                                className={`block w-full pl-10 pr-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 ${errors.capacity
                                        ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500'
                                        : 'border-slate-200 focus:ring-violet-100 focus:border-violet-500'
                                    }`}
                                {...register('capacity', {
                                    required: 'Capacity is required',
                                    min: {
                                        value: 1,
                                        message: 'Capacity must be at least 1'
                                    }
                                })}
                            />
                        </div>
                        {errors.capacity && (
                            <p className="mt-1 text-xs text-rose-500 font-medium">{errors.capacity.message}</p>
                        )}
                    </div>

                    {/* Status Toggle */}
                    {isEditMode && (
                        <div className="flex items-center gap-2.5 pt-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                                {...register('isActive')}
                            />
                            <label htmlFor="isActive" className="text-sm font-semibold text-slate-700 cursor-pointer">
                                Table is Active and Available for Bookings
                            </label>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                            {loading && <Loader2 className="animate-spin h-4 w-4" />}
                            {isEditMode ? 'Save Changes' : 'Add Table'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TableForm;
