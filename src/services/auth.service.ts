
import prisma from "../utils/db";
import { AppError } from "../utils/AppError";
import { SignupInput } from "../interfaces/auth.interface";
import { user_service } from "./user.service";
import { ERROR_MESSAGES } from "../common/ErrorMessages";
import { HTTP_CODES } from "../common/StatusCodes";
import { otp_service } from "./otp.service";


export const signup = async (user_data: SignupInput) => {
    const user = await user_service.findUser({ email: user_data.email })
    if (user) {
        if (user && user.UserActivityStatus && !(user.UserActivityStatus.is_signup_email_verified)) {
            await otp_service.deleteSignUpOtp(user.id);
            await user_service.deleteUser(user.id)
        }
        else {
            throw new AppError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS, HTTP_CODES.CONFLICT)
        }
    }
    const is_phone_number_already_taken = await user_service.findUser({ phone_number: user_data.phone_number })
    if (is_phone_number_already_taken) {
        throw new AppError(ERROR_MESSAGES.PHONE_ALREADY_EXISTS, HTTP_CODES.CONFLICT)
    }

    const created_user = await user_service.signUpUser(user_data as SignupInput)
    if (!created_user) {
        throw new AppError(ERROR_MESSAGES.USER_CREATION_FAILED, HTTP_CODES.INTERNAL_SERVER_ERROR)
    }

    const otp = await otp_service.SendSignupOtp(created_user.id)

    return {
        otp_expiry_time: otp.expiresAt,
    }
};



export const auth_service = {
    signup,
};