import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { Role } from '../constants/roles.js';

export const authorize = (...allowedRoles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new ApiError(401, 'Unauthorized: User is not authenticated.'));
        }

        if (!allowedRoles.includes(req.user.role as Role)) {
            return next(new ApiError(403, 'Forbidden: You do not have permission to access this resource.'));
        }

        next();
    };
};
