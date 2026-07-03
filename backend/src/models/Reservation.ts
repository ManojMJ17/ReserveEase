import { Schema, model, Types } from 'mongoose';
import { ReservationStatus } from '../constants/reservationStatus.js';
import { TIME_SLOTS } from '../constants/timeSlots.js';

export interface IReservation {
    customer: Types.ObjectId;
    table: Types.ObjectId;
    reservationDate: Date;
    timeSlot: typeof TIME_SLOTS[number];
    guestCount: number;
    status: ReservationStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

const ReservationSchema = new Schema<IReservation>(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Customer reference is required']
        },
        table: {
            type: Schema.Types.ObjectId,
            ref: 'Table',
            required: [true, 'Table reference is required']
        },
        reservationDate: {
            type: Date,
            required: [true, 'Reservation date is required']
        },
        timeSlot: {
            type: String,
            required: [true, 'Time slot is required'],
            enum: {
                values: TIME_SLOTS,
                message: 'Invalid time slot value'
            }
        },
        guestCount: {
            type: Number,
            required: [true, 'Guest count is required'],
            min: [1, 'Guest count must be greater than 0']
        },
        status: {
            type: String,
            enum: Object.values(ReservationStatus),
            default: ReservationStatus.CONFIRMED
        }
    },
    {
        timestamps: true
    }
);

// Indexes
ReservationSchema.index({ customer: 1 });
ReservationSchema.index({ reservationDate: 1 });
ReservationSchema.index({ table: 1, reservationDate: 1, timeSlot: 1 });

export const Reservation = model<IReservation>('Reservation', ReservationSchema);
export default Reservation;
