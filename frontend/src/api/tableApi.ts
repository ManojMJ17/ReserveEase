import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import type { Table, ApiResponse, TableInput } from '../types/index';

export const tableApi = {
    /**
     * Pulls restaurant tables list.
     */
    getTables: async () => {
        const response = await apiClient.get<ApiResponse<Table[]>>(
            API_ENDPOINTS.TABLES.BASE
        );
        return response.data;
    },

    /**
     * Creates a new table (Admin only).
     */
    createTable: async (data: TableInput) => {
        const response = await apiClient.post<ApiResponse<Table>>(
            API_ENDPOINTS.TABLES.BASE,
            data
        );
        return response.data;
    },

    /**
     * Modifies table capacity/number/status (Admin only).
     */
    updateTable: async (id: string, data: Partial<TableInput>) => {
        const response = await apiClient.patch<ApiResponse<Table>>(
            API_ENDPOINTS.TABLES.DETAIL(id),
            data
        );
        return response.data;
    },

    /**
     * Soft disables a table (Admin only).
     */
    deleteTable: async (id: string) => {
        const response = await apiClient.delete<ApiResponse<Table>>(
            API_ENDPOINTS.TABLES.DETAIL(id)
        );
        return response.data;
    }
};

export default tableApi;
