import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError'; 
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err.stack); 
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: 'error',
            statusCode: err.statusCode,
            message: err.message
        });
    }
    if (err instanceof Error && err.message.includes('PrismaClientKnownRequestError')) {
        res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: err.message
        });
    }
    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
};
