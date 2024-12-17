
import { Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/common';
import { SUCCESS_MESSAGES } from '../common/SuccessMessages';
import { HTTP_CODES } from '../common/StatusCodes';




export const getUsersProfile = async (req: Request, res: Response) => {
    
    return res.status(HTTP_CODES.CREATED).json({
        message: SUCCESS_MESSAGES.ACCOUNT_CREATED,
        data:[]
    })
};



export const users_controller = {
    getUsersProfile: catchAsync(getUsersProfile),
};