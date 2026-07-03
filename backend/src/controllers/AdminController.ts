import { Request, Response } from 'express';
import { AdminService } from '../services/AdminService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller to fetch all reservations paginated and sorted.
 */
export const getAllReservations = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await AdminService.getAllReservations(page, limit);
    res.status(200).json(new ApiResponse(200, result, 'All reservations retrieved successfully'));
});

/**
 * Controller to query reservations on a specific date.
 */
export const getReservationsByDate = asyncHandler(async (req: Request, res: Response) => {
    const result = await AdminService.getReservationsByDate(req.params.date as string);
    res.status(200).json(new ApiResponse(200, result, `Reservations for date ${req.params.date} retrieved successfully`));
});

/**
 * Controller to update a reservation with dynamic table re-allocation.
 */
export const updateReservation = asyncHandler(async (req: Request, res: Response) => {
    const result = await AdminService.updateReservation(req.params.id as string, req.body);
    res.status(200).json(new ApiResponse(200, result, 'Reservation updated successfully'));
});

/**
 * Controller to cancel a reservation (Admin level cancellation).
 */
export const cancelReservation = asyncHandler(async (req: Request, res: Response) => {
    const result = await AdminService.cancelReservation(req.params.id as string);
    res.status(200).json(new ApiResponse(200, result, 'Reservation cancelled successfully'));
});
