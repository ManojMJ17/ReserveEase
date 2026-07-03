import { Request, Response } from 'express';
import { TableService } from '../services/TableService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller to fetch all restaurant tables.
 */
export const getTables = asyncHandler(async (req: Request, res: Response) => {
    const result = await TableService.getAll();
    res.status(200).json(new ApiResponse(200, result, 'Tables retrieved successfully'));
});

/**
 * Controller to create a new table (Admin only).
 */
export const createTable = asyncHandler(async (req: Request, res: Response) => {
    const result = await TableService.create(req.body);
    res.status(201).json(new ApiResponse(201, result, 'Table created successfully'));
});

/**
 * Controller to update an existing table (Admin only).
 */
export const updateTable = asyncHandler(async (req: Request, res: Response) => {
    const result = await TableService.update(req.params.id as string, req.body);
    res.status(200).json(new ApiResponse(200, result, 'Table updated successfully'));
});

/**
 * Controller to soft disable a table (Admin only).
 */
export const deleteTable = asyncHandler(async (req: Request, res: Response) => {
    const result = await TableService.delete(req.params.id as string);
    res.status(200).json(new ApiResponse(200, result, 'Table soft disabled successfully'));
});
