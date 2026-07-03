import { Reservation, IReservation } from '../models/Reservation.js';
import { Table } from '../models/Table.js';
import { ApiError } from '../utils/ApiError.js';
import { ReservationStatus } from '../constants/reservationStatus.js';
import { TIME_SLOTS } from '../constants/timeSlots.js';

export class ReservationService {
    /**
     * Creates a reservation by automatically assigning the most suitable table.
     * @param customerId The authenticated customer ID
     * @param reservationData The request payload (reservationDate, timeSlot, guestCount)
     */
    static async create(customerId: string, reservationData: { reservationDate: string; timeSlot: typeof TIME_SLOTS[number]; guestCount: number }) {
        const { reservationDate, timeSlot, guestCount } = reservationData;

        if (!reservationDate || !timeSlot || !guestCount) {
            throw new ApiError(400, 'Reservation date, time slot, and guest count are required');
        }

        // Normalize date to UTC midnight
        const normalizedDate = new Date(reservationDate);
        normalizedDate.setUTCHours(0, 0, 0, 0);

        // Find all active tables with capacity >= guestCount, sorted by capacity ascending
        const tables = await Table.find({
            isActive: true,
            capacity: { $gte: guestCount }
        }).sort({ capacity: 1 });

        if (tables.length === 0) {
            throw new ApiError(409, 'No tables are available to accommodate this guest count');
        }

        let assignedTable = null;

        // Loop through tables to check availability
        for (const table of tables) {
            const conflictingReservation = await Reservation.findOne({
                table: table._id,
                reservationDate: normalizedDate,
                timeSlot: timeSlot,
                status: ReservationStatus.CONFIRMED
            });

            // If no conflict found, assign this table
            if (!conflictingReservation) {
                assignedTable = table;
                break;
            }
        }

        // If no table is available, return 409 Conflict
        if (!assignedTable) {
            throw new ApiError(409, 'No tables available for the selected date, slot, and guest count.');
        }

        // Create the reservation
        const reservation = await Reservation.create({
            customer: customerId,
            table: assignedTable._id,
            reservationDate: normalizedDate,
            timeSlot,
            guestCount,
            status: ReservationStatus.CONFIRMED
        });

        return reservation;
    }

    /**
     * Retrieves all reservations belonging to an authenticated customer.
     * @param customerId The customer ID
     */
    static async getByCustomer(customerId: string) {
        if (!customerId) {
            throw new ApiError(400, 'Customer ID is required');
        }

        const reservations = await Reservation.find({ customer: customerId })
            .populate('table')
            .sort({ reservationDate: -1 });

        return reservations;
    }

    /**
     * Cancels an authenticated user's own reservation (soft cancellation).
     * @param customerId The customer ID
     * @param reservationId The reservation ID to cancel
     */
    static async cancel(customerId: string, reservationId: string) {
        if (!reservationId) {
            throw new ApiError(400, 'Reservation ID is required');
        }

        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            throw new ApiError(404, 'Reservation not found');
        }

        // Customers can cancel ONLY their own reservation
        if (reservation.customer.toString() !== customerId) {
            throw new ApiError(403, 'Forbidden: You can only cancel your own reservation');
        }

        // Change status to CANCELLED (do not delete the document)
        reservation.status = ReservationStatus.CANCELLED;
        await reservation.save();

        return reservation;
    }
}
export default ReservationService;
