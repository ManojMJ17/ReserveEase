import { body, param } from 'express-validator';

export const createTableValidator = [
    body('tableNumber')
        .trim()
        .notEmpty().withMessage('Table number is required'),
    body('capacity')
        .notEmpty().withMessage('Capacity is required')
        .isInt({ min: 1 }).withMessage('Capacity must be an integer greater than 0')
];

export const updateTableValidator = [
    param('id')
        .notEmpty().withMessage('Table ID is required')
        .isMongoId().withMessage('Invalid Table ID format'),
    body('tableNumber').optional()
        .trim()
        .notEmpty().withMessage('Table number cannot be empty'),
    body('capacity').optional()
        .isInt({ min: 1 }).withMessage('Capacity must be an integer greater than 0'),
    body('isActive').optional()
        .isBoolean().withMessage('isActive must be a boolean')
];

export const deleteTableValidator = [
    param('id')
        .notEmpty().withMessage('Table ID is required')
        .isMongoId().withMessage('Invalid Table ID format')
];
