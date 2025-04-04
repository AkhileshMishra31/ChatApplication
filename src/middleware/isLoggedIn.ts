import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { HTTP_CODES } from '../common/StatusCodes';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const multerValidation = (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
        return next(new AppError('No file uploaded', HTTP_CODES.BAD_REQUEST));
    }

    console.log("req.file", req.file)

    if (req.file.size > MAX_FILE_SIZE) {
        return next(new AppError('File size exceeds the 5MB limit', HTTP_CODES.BAD_REQUEST));

    }

    next();
};
