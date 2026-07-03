import { Schema, model } from 'mongoose';
import { Role } from '../constants/roles.js';

export interface IUser {
    name: string;
    email: string;
    password?: string;
    role: Role;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        role: {
            type: String,
            enum: Object.values(Role),
            default: Role.CUSTOMER
        }
    },
    {
        timestamps: true
    }
);

// Indexes

export const User = model<IUser>('User', UserSchema);
export default User;
