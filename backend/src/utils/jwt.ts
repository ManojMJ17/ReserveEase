import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

interface TokenPayload {
    id: string;
    role: string;
    email: string;
}

/**
 * Generates a signed JWT access token for a user.
 * @param payload Token payload containing user id, role, and email
 */
export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN as any
    });
};

/**
 * Verifies a JWT access token signature and decodes the payload.
 * @param token The raw token string
 */
export const verifyAccessToken = (token: string): TokenPayload => {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
};
