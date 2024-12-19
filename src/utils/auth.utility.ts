// utils/hashPassword.ts
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken"
import { ERROR_MESSAGES } from '../common/ErrorMessages';
import { HTTP_CODES } from '../common/StatusCodes';
import { AppError } from './AppError';
import { TokenPayload } from '../interfaces/user.interface';
import { User } from '@prisma/client';
dotenv.config();

export const hashPassword = async (password: string): Promise<string> => {
    const hashedPassword = await bcrypt.hash(password, process.env.SALTROUND || 10);
    return hashedPassword;
};

export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword);
};


// Generate an access token with user details
export const generateAccessToken = async (user: User): Promise<string> => {
    const payload: TokenPayload = {
        id: user.id,
        username: user.username,
        email: user.email,
    };
    const secretKey = process.env.JWT_SECRET || 'your_default_secret_key';
    const options = { expiresIn: '1h' };

    return new Promise((resolve, reject) => {
        jwt.sign(payload, secretKey, options, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token as string);
            }
        });
    });
};

// Generate a refresh token with user details
export const generateRefreshToken = async (user: User): Promise<string> => {
    const payload: TokenPayload = {
        id: user.id,
        username: user.username,
        email: user.email,
    };
    const secretKey = process.env.JWT_SECRET || 'your_default_secret_key';
    const options = { expiresIn: '7h' };

    return new Promise((resolve, reject) => {
        jwt.sign(payload, secretKey, options, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token as string);
            }
        });
    });
};

export const verifyRefreshToken = async (
    token: string
): Promise<{ id: string }> => {
    const secretKey = process.env.JWT_SECRET || "your_default_secret_key";

    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                reject(
                    new AppError(ERROR_MESSAGES.INVALID_REFRESH_TOKEN, HTTP_CODES.UNAUTHORIZED)
                );
            } else {
                resolve(decoded as { id: string });
            }
        });
    });
};