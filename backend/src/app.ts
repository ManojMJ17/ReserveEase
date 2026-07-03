import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import { ApiResponse } from './utils/ApiResponse.js';
import { ApiError } from './utils/ApiError.js';
import { globalErrorHandler } from './middleware/globalErrorHandler.js';

import mongoose from 'mongoose';

import authRouter from './routes/auth.js';
import reservationsRouter from './routes/reservations.js';
import adminRouter from './routes/admin.js';
import tablesRouter from './routes/tables.js';

const app = express();

// Enable CORS
app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true
}));

// Request parsers
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Logging
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/tables', tablesRouter);

// Basic Health Check Endpoint
app.get('/health', (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    res.status(200).json(
        new ApiResponse(
            200,
            {
                status: isDbConnected ? 'OK' : 'DEGRADED',
                database: isDbConnected ? 'CONNECTED' : 'DISCONNECTED',
                timestamp: new Date().toISOString()
            },
            isDbConnected 
                ? 'Restaurant Reservation Management System backend is healthy'
                : 'Restaurant Reservation Management System backend is degraded (database offline)'
        )
    );
});

// 404 handler for unmatched routes
app.use((req, res, next) => {
    next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Global Error Handler Middleware
app.use(globalErrorHandler);

export { app };
