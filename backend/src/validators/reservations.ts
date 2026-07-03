import { body } from 'express-validator';
import { TIME_SLOTS } from '../constants/timeSlots.js';

export const createReservationValidator = [
    body('reservationDate')
        .notEmpty().withMessage('Reservation date is required')
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
    body('timeSlot')
        .notEmpty().withMessage('Time slot is required')
        .isIn(TIME_SLOTS).withMessage(`Time slot must be one of: ${TIME_SLOTS.join(', ')}`),
    body('guestCount')
        .notEmpty().withMessage('Guest count is required')
        .isInt({ min: 1 }).withMessage('Guest count must be an integer greater than 0')
];
