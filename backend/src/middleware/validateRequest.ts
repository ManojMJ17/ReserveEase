import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => {
            return {
                field: err.type === 'field' ? err.path : err.type,
                message: err.msg
            };
        });
        return next(new ApiError(400, 'Validation failed', formattedErrors));
    }
    next();
};
