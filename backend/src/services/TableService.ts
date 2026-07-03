import { Table, ITable } from '../models/Table.js';
import { ApiError } from '../utils/ApiError.js';

export class TableService {
    /**
     * Retrieves all tables sorted by tableNumber ascending.
     */
    static async getAll() {
        const tables = await Table.find().sort({ tableNumber: 1 });
        return tables;
    }

    /**
     * Creates a new restaurant table.
     * @param tableData Payload containing tableNumber and capacity
     */
    static async create(tableData: Partial<ITable>) {
        const { tableNumber, capacity } = tableData;

        if (!tableNumber || capacity === undefined) {
            throw new ApiError(400, 'Table number and capacity are required');
        }

        // Validate table number uniqueness
        const existingTable = await Table.findOne({ tableNumber });
        if (existingTable) {
            throw new ApiError(409, `Table number "${tableNumber}" already exists.`);
        }

        const table = await Table.create({
            tableNumber,
            capacity,
            isActive: true
        });

        return table;
    }

    /**
     * Updates an existing table, ensuring no tableNumber duplicate conflicts.
     * @param id The table ID to update
     * @param updateData Payload containing parameters to update (tableNumber, capacity, isActive)
     */
    static async update(id: string, updateData: Partial<ITable>) {
        const table = await Table.findById(id);
        if (!table) {
            throw new ApiError(404, 'Table not found');
        }

        // If tableNumber is changing, verify its uniqueness
        if (updateData.tableNumber && updateData.tableNumber !== table.tableNumber) {
            const existingTable = await Table.findOne({ tableNumber: updateData.tableNumber });
            if (existingTable) {
                throw new ApiError(409, `Table number "${updateData.tableNumber}" already exists.`);
            }
            table.tableNumber = updateData.tableNumber;
        }

        if (updateData.capacity !== undefined) {
            table.capacity = updateData.capacity;
        }

        if (updateData.isActive !== undefined) {
            table.isActive = updateData.isActive;
        }

        await table.save();
        return table;
    }

    /**
     * Soft disables a table.
     * @param id The table ID to disable
     */
    static async delete(id: string) {
        const table = await Table.findById(id);
        if (!table) {
            throw new ApiError(404, 'Table not found');
        }

        // Soft disable table by setting isActive to false
        table.isActive = false;
        await table.save();

        return table;
    }
}
export default TableService;
