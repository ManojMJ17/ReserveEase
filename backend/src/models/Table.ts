import { Schema, model } from 'mongoose';

export interface ITable {
    tableNumber: string;
    capacity: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const TableSchema = new Schema<ITable>(
    {
        tableNumber: {
            type: String,
            required: [true, 'Table number is required'],
            unique: true,
            trim: true
        },
        capacity: {
            type: Number,
            required: [true, 'Table capacity is required'],
            min: [1, 'Table capacity must be greater than 0']
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);


export const Table = model<ITable>('Table', TableSchema);
export default Table;
