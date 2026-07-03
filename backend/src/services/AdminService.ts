import { Reservation } from '../models/Reservation.js';
import { Table } from '../models/Table.js';
import { ApiError } from '../utils/ApiError.js';
import { ReservationStatus } from '../constants/reservationStatus.js';
import { TIME_SLOTS } from '../constants/timeSlots.js';

interface UpdateReservationInput {
    reservationDate?: string;
    timeSlot?: typeof TIME_SLOTS[number];
    guestCount?: number;
}

export class AdminService {
    /**
     * Retrieves all reservations across the system with pagination and sorting.
     * @param page Page index (1-based)
     * @param limit Maximum results per page
     */
    static async getAllReservations(page: number, limit: number) {
        const skip = (page - 1) * limit;

        const reservations = await Reservation.find()
            .populate('customer', 'name email')
            .populate('table', 'tableNumber capacity')
            .sort({ reservationDate: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Reservation.countDocuments();

        return {
            reservations,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        };
    }

    /**
     * Retrieves all reservations matching a specific date.
     * @param dateStr Target date string
     */
    static async getReservationsByDate(dateStr: string) {
        if (!dateStr) {
            throw new ApiError(400, 'Date parameter is required');
        }

        // Normalize date to UTC midnight
        const normalizedDate = new Date(dateStr);
        normalizedDate.setUTCHours(0, 0, 0, 0);

        const reservations = await Reservation.find({ reservationDate: normalizedDate })
            .populate('customer', 'name email')
            .populate('table', 'tableNumber capacity');

        return reservations;
    }

    /**
     * Updates an existing reservation, dynamically recalculating table allocation.
     * @param id The reservation ID
     * @param updateData Payload containing fields to update (reservationDate, timeSlot, guestCount)
     */
    static async updateReservation(id: string, updateData: UpdateReservationInput) {
        const reservation = await Reservation.findById(id);
        if (!reservation) {
            throw new ApiError(404, 'Reservation not found');
        }

        // Fall back to current values if fields are not provided in update payload
        const dateInput = updateData.reservationDate ? new Date(updateData.reservationDate) : reservation.reservationDate;
        const slot = updateData.timeSlot || reservation.timeSlot;
        const count = updateData.guestCount !== undefined ? updateData.guestCount : reservation.guestCount;

        // Normalize date to UTC midnight
        const normalizedDate = new Date(dateInput);
        normalizedDate.setUTCHours(0, 0, 0, 0);

        // Fetch active tables that can fit the party size, sorted by capacity ascending
        const tables = await Table.find({
            isActive: true,
            capacity: { $gte: count }
        }).sort({ capacity: 1 });

        if (tables.length === 0) {
            throw new ApiError(409, 'No tables are available to accommodate this guest count');
        }

        let assignedTable = null;

        // Loop through suitable tables to locate the first free option
        for (const table of tables) {
            // Ignore the current reservation when checking database conflicts
            const conflictingReservation = await Reservation.findOne({
                _id: { $ne: id }, // CRITICAL: Exclude this reservation
                table: table._id,
                reservationDate: normalizedDate,
                timeSlot: slot,
                status: ReservationStatus.CONFIRMED
            });

            // If no conflict, assign table
            if (!conflictingReservation) {
                assignedTable = table;
                break;
            }
        }

        if (!assignedTable) {
            throw new ApiError(409, 'No suitable table exists for the selected date, slot, and guest count.');
        }

        // Apply modifications
        reservation.reservationDate = normalizedDate;
        reservation.timeSlot = slot;
        reservation.guestCount = count;
        reservation.table = assignedTable._id as any;
        
        // Reset status to CONFIRMED in case it was modified
        reservation.status = ReservationStatus.CONFIRMED;

        await reservation.save();

        // Retrieve fully populated document
        const updated = await Reservation.findById(id)
            .populate('customer', 'name email')
            .populate('table', 'tableNumber capacity');

        return updated;
    }

    /**
     * Soft cancels any reservation by setting its status to CANCELLED.
     * @param id The reservation ID
     */
    static async cancelReservation(id: string) {
        const reservation = await Reservation.findById(id);
        if (!reservation) {
            throw new ApiError(404, 'Reservation not found');
        }

        // Update status (soft cancel)
        reservation.status = ReservationStatus.CANCELLED;
        await reservation.save();

        return reservation;
    }
}
export default AdminService;
