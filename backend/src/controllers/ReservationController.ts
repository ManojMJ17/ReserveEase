import { Request, Response } from 'express';
import { ReservationService } from '../services/ReservationService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller to create a new reservation.
 */
export const createReservation = asyncHandler(async (req: Request, res: Response) => {
    const reservation = await ReservationService.create(req.user!.id, req.body);
    res.status(201).json(
        new ApiResponse(201, reservation, 'Reservation created successfully')
    );
});

/**
 * Controller to retrieve all reservations for the authenticated customer.
 */
export const getMyReservations = asyncHandler(async (req: Request, res: Response) => {
    const reservations = await ReservationService.getByCustomer(req.user!.id);
    res.status(200).json(
        new ApiResponse(200, reservations, 'My reservations retrieved successfully')
    );
});

/**
 * Controller to cancel an existing reservation.
 */
export const cancelReservation = asyncHandler(async (req: Request, res: Response) => {
    const reservation = await ReservationService.cancel(req.user!.id, req.params.id as string);
    res.status(200).json(
        new ApiResponse(200, reservation, 'Reservation cancelled successfully')
    );
});
