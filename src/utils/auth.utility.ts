// utils/hashPassword.ts
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
import jwt from "jsonwebtoken"
import { ERROR_MESSAGES } from '../common/ErrorMessages';
import { HTTP_CODES } from '../common/StatusCodes';
import { AppError } from './AppError';
dotenv.config();

export const hashPassword = async (password: string): Promise<string> => {
    const hashedPassword = await bcrypt.hash(password, process.env.SALTROUND || 10);
    return hashedPassword;
};

export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword);
};


export const generateAccessToken = async (userId: string): Promise<string> => {
    const payload = {
        id: userId,
    };

    const secretKey = process.env.JWT_SECRET || "your_default_secret_key";
    const options = {
        expiresIn: '1h',
    };
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
export const generateRefreshToken = async (userId: string): Promise<string> => {
    const payload = {
        id: userId,
    };

    const secretKey = process.env.JWT_SECRET || "your_default_secret_key";
    const options = {
        expiresIn: '7h',
    };
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