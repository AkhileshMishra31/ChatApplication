
import { Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/common';
import { SUCCESS_MESSAGES } from '../common/SuccessMessages';
import { HTTP_CODES } from '../common/StatusCodes';
import { validateOTPInput, validateResendOTPInput } from '../validations/otp.validation';
import { otp_service } from '../services/otp.service';



export const verifySignUpOTP = async (req: Request, res: Response) => {
    const { value, error } = validateOTPInput(req.body)
    if (error) {
        throw new AppError(error.message, 400)
    }
    const user = await otp_service.verifySignUpOTP(value)
    return res.status(HTTP_CODES.CREATED).json({
        message: SUCCESS_MESSAGES.ACCOUNT_CREATED,
        data: user
    })
};

const resendSignUpOTP=async(req: Request, res: Response)=>{
    const { value, error } = validateResendOTPInput(req.body)
    if (error) {
        throw new AppError(error.message, 400)
    }
    const user = await otp_service.resendSignUpOTP(value)
    return res.status(HTTP_CODES.CREATED).json({
        message: SUCCESS_MESSAGES.SIGN_UP_SUCCESS,
        data: user
    })
}


export const otp_controller = {
    verifySignUpOTP: catchAsync(verifySignUpOTP),
    resendSignUpOTP: catchAsync(resendSignUpOTP)
};