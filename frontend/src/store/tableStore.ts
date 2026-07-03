import { create } from 'zustand';
import type { Table, TableInput } from '../types/index';
import { tableApi } from '../api/tableApi';

interface TableState {
    tables: Table[];
    loading: boolean;
    fetchTables: () => Promise<void>;
    createTable: (data: TableInput) => Promise<void>;
    updateTable: (id: string, data: Partial<TableInput>) => Promise<void>;
    deleteTable: (id: string) => Promise<void>;
}

export const useTableStore = create<TableState>((set, get) => ({
    tables: [],
    loading: false,

    fetchTables: async () => {
        set({ loading: true });
        try {
            const response = await tableApi.getTables();
            set({ tables: response.data, loading: false });
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    createTable: async (data) => {
        set({ loading: true });
        try {
            await tableApi.createTable(data);
            set({ loading: false });
            await get().fetchTables();
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    updateTable: async (id, data) => {
        set({ loading: true });
        try {
            await tableApi.updateTable(id, data);
            set({ loading: false });
            await get().fetchTables();
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    deleteTable: async (id) => {
        set({ loading: true });
        try {
            await tableApi.deleteTable(id);
            set({ loading: false });
            await get().fetchTables();
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    }
}));
export default useTableStore;
