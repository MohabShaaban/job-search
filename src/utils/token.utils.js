import jwt from 'jsonwebtoken';
import { ApiError } from './api-error.utils.js';

export const generateToken = (payload = {}, secretKey = process.env.JWT_SECRET_KEY, expiresIn = process.env.JWT_EXPIRE_TIME) => {
    try {
        if (!secretKey) {
            throw new ApiError('JWT secret key is missing.', 500);
        }
        return jwt.sign(payload, secretKey, { expiresIn });
    } catch (error) {
        throw new ApiError(`Error generating token: ${error.message}`, 500);
    }
}


export const verifyToken = (token, secretKey = process.env.JWT_SECRET_KEY) => {
    return jwt.verify(token, secretKey);
}