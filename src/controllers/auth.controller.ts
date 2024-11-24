
import { Request, Response } from 'express';
import { validateSignupInput } from '../validations/auth.validation';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/common';
import { auth_service } from '../services/auth.service';
import { SUCCESS_MESSAGES } from '../common/SuccessMessages';
import { HTTP_CODES } from '../common/StatusCodes';



export const signup = async (req: Request, res: Response) => {
    const { value, error } = validateSignupInput(req.body)
    if (error) {
        throw new AppError(error.message, 400)
    }
    const user = await auth_service.signup(value)
    return res.status(HTTP_CODES.CREATED).json({
        message: SUCCESS_MESSAGES.SIGN_UP_SUCCESS,
        data: user
    })
};


export const auth_controller = {
    signup: catchAsync(signup),
};