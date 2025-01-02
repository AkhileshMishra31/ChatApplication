import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError';
import logger from './loggerWrapper';
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    logger.error(err.stack || 'An error occurred');
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: 'error',
            statusCode: err.statusCode,
            message: err.message
        });
        return;
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
