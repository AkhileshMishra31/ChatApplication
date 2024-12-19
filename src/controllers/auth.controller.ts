
import { Request, Response } from 'express';
import { validateLoginInput, validateSignupInput, validateToken } from '../validations/auth.validation';
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
export const login = async (req: Request, res: Response) => {
    const { value, error } = validateLoginInput(req.body)
    if (error) {
        throw new AppError(error.message, 400)
    }
    const user = await auth_service.login(value)
    res.cookie("token", user.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24,
    });
    res.cookie("token", user.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.status(HTTP_CODES.CREATED).json({
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        data: user
    })
};

export const refreshToken = async (req: Request, res: Response) => {
    const { value, error } = validateToken(req.body)
    if (error) {
        throw new AppError(error.message, 400)
    }
    const user = await auth_service.refreshToken(value.token)
    res.cookie("token", user.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.status(HTTP_CODES.CREATED).json({
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        data: user
    })
};



export const auth_controller = {
    signup: catchAsync(signup),
    login: catchAsync(login),
    refreshToken: catchAsync(refreshToken)
};