
import { Request, Response } from 'express';
import { validateLoginInput, validateSignupInput, validateToken } from '../validations/auth.validation';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/common';
import { auth_service } from '../services/auth.service';
import { SUCCESS_MESSAGES } from '../common/SuccessMessages';
import { HTTP_CODES } from '../common/StatusCodes';
import { ERROR_MESSAGES } from '../common/ErrorMessages';



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
    res.cookie("access_token", user.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24,
    });
    res.cookie("refresh_token", user.refresh_token, {
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
    res.cookie("access_token", user.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.status(HTTP_CODES.CREATED).json({
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        data: user
    })
};


export const logout = async (req: Request, res: Response) => {
    const refresh_token = req.cookies.refresh_token; 

    if (!refresh_token) {
        throw new AppError(ERROR_MESSAGES.TOKEN_MISSING, HTTP_CODES.BAD_REQUEST);
    }

    await auth_service.logout(refresh_token);

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    return res.status(HTTP_CODES.OK).json({
        message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
    });
};



// will implement  all oauth here later







export const auth_controller = {
    signup: catchAsync(signup),
    login: catchAsync(login),
    refreshToken: catchAsync(refreshToken),
    logout: catchAsync(logout)
};