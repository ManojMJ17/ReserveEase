import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller for registering a new customer user.
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.register(req.body);
    res.status(201).json(
        new ApiResponse(201, result, 'User registered successfully')
    );
});

/**
 * Controller for user login.
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    res.status(200).json(
        new ApiResponse(200, result, 'Login successful')
    );
});

/**
 * Controller for fetching the current logged-in user profile.
 */
export const me = asyncHandler(async (req: Request, res: Response) => {
    // req.user is set by authenticate middleware
    const user = await AuthService.getCurrentUser(req.user!.id);
    res.status(200).json(
        new ApiResponse(200, { user }, 'User profile retrieved successfully')
    );
});
