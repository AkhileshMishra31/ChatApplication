
import { Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/common';
import { SUCCESS_MESSAGES } from '../common/SuccessMessages';
import { HTTP_CODES } from '../common/StatusCodes';
import { two_fa_service } from '../services/two-fa.service';
import { TokenPayload } from '../interfaces/user.interface';
import { validate2faInput } from '../validations/two-fa.validation';




export const enableTwoFA = async (req: Request, res: Response) => {
    const qrcode = await two_fa_service.enableTwoFa(req.user as TokenPayload)
    return res.status(HTTP_CODES.CREATED).json({
        message: SUCCESS_MESSAGES.TWO_FA_ENABLED,
        data: qrcode
    })
};

const verifyTwoFa = async (req: Request, res: Response) => {
    const { value, error } = validate2faInput(req.body)
    if (error) {
        throw new AppError(error.message, 400)
    }
    const user = await two_fa_service.verifyTwoFa(req.user as TokenPayload, value.otp)
    return res.status(HTTP_CODES.CREATED).json({
        message: SUCCESS_MESSAGES.TWO_FA_VERIFIED,
        data: user
    })
}



export const two_fa_controller = {
    enableTwoFA: catchAsync(enableTwoFA),
    verifyTwoFa: catchAsync(verifyTwoFa)
};