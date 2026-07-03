export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'customer';
    createdAt: string;
    updatedAt: string;
}

export interface Table {
    _id: string;
    tableNumber: string;
    capacity: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Reservation {
    _id: string;
    customer: string | User;
    table: string | Table;
    reservationDate: string;
    timeSlot: string;
    guestCount: number;
    status: 'confirmed' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T = unknown> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

export interface TableInput {
    tableNumber: string;
    capacity: number;
    isActive?: boolean;
}

export interface ReservationInput {
    reservationDate: string;
    timeSlot: string;
    guestCount: number;
}

