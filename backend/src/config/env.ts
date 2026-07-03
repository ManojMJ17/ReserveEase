import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const requiredEnv = ['MONGODB_URI', 'JWT_SECRET'] as const;

// Validate critical environment variables
for (const key of requiredEnv) {
    if (!process.env[key]) {
        console.error(`FATAL ERROR: Environment variable "${key}" is required but not defined.`);
        process.exit(1);
    }
}

export const env = {
    PORT: parseInt(process.env.PORT || '5000', 10),
    MONGODB_URI: process.env.MONGODB_URI!,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    NODE_ENV: process.env.NODE_ENV || 'development',
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
} as const;
