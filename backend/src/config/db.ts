import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async (): Promise<void> => {
    // Register connection event handlers
    mongoose.connection.on('connected', () => {
        console.log('MongoDB connection established successfully.');
    });

    mongoose.connection.on('error', (err) => {
        console.error(`Mongoose connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('Mongoose disconnected from MongoDB. Retrying...');
    });

    try {
        await mongoose.connect(env.MONGODB_URI);
    } catch (error) {
        console.error(`Initial MongoDB connection failed: ${error instanceof Error ? error.message : error}`);
        console.log('Server will continue to run. Mongoose will auto-reconnect when MongoDB becomes available.');
    }
};
