import { param, body } from 'express-validator';
import { TIME_SLOTS } from '../constants/timeSlots.js';

export const getReservationsByDateValidator = [
    param('date')
        .notEmpty().withMessage('Date parameter is required')
        .isISO8601().withMessage('Date parameter must be a valid ISO 8601 date format')
];

export const updateReservationValidator = [
    param('id')
        .notEmpty().withMessage('Reservation ID is required')
        .isMongoId().withMessage('Invalid Reservation ID format'),
    body('reservationDate').optional()
        .isISO8601().withMessage('Reservation date must be a valid ISO 8601 date format')
        .custom((value) => {
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            
            const inputDate = new Date(value);
            inputDate.setUTCHours(0, 0, 0, 0);
            
            if (inputDate < today) {
                throw new Error('Reservation date cannot be in the past');
            }
            return true;
        }),
    body('timeSlot').optional()
        .isIn(TIME_SLOTS).withMessage(`Time slot must be one of: ${TIME_SLOTS.join(', ')}`),
    body('guestCount').optional()
        .isInt({ min: 1 }).withMessage('Guest count must be an integer greater than 0')
];

export const deleteReservationValidator = [
    param('id')
        .notEmpty().withMessage('Reservation ID is required')
        .isMongoId().withMessage('Invalid Reservation ID format')
];
