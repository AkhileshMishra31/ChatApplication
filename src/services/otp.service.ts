import prisma from "../utils/db";
import { AppError } from "../utils/AppError";
import { ERROR_MESSAGES } from "../common/ErrorMessages";
import { HTTP_CODES } from "../common/StatusCodes";
import { user_service } from "./user.service";
import { generateOTP } from "../utils/otp.utility";
import { user_activiy_service } from "./user_activity.service";

const { oTPRequest: OTPRequest } = prisma;

export const SendSignupOtp = async (user_id: string) => {
    const user = await user_service.getUser(user_id)
    if (!user) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.BAD_REQUEST)
    }
    const otp = await OTPRequest.findFirst({
        where: {
            userId: user_id,
            type: "SIGNUP"
        }
    })
    if (otp) {
        throw new AppError(ERROR_MESSAGES.OTP_CREATION_FAILED, HTTP_CODES.INTERNAL_SERVER_ERROR)
    }
    const otpCode = generateOTP(6);
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000);
    const newOTP = await OTPRequest.create({
        data: {
            otp: otpCode,
            email: user.email,
            userId: user_id,
            type: "SIGNUP",
            status: "PENDING",
            expiresAt: expiryTime,
        },
    })
    return newOTP;
};

const deleteSignUpOtp = async (user_id: string) => {
    const user = await user_service.getUser(user_id)
    if (!user) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.BAD_REQUEST)
    }
    const otp = await OTPRequest.deleteMany({
        where: {
            userId: user_id,
            type: "SIGNUP"
        }
    })
    return otp;
}

const verifySignUpOTP = async (value: { email: string, otp: string }) => {
    const user = await user_service.findUser({ email: value.email })
    if (!user) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.BAD_REQUEST)
    }
    if (user.UserActivityStatus?.is_signup_email_verified) {
        throw new AppError(ERROR_MESSAGES.SIGNUP_ALREADY, HTTP_CODES.CONFLICT)
    }
    const otpRecord = await OTPRequest.findFirst({
        where: {
            userId: user.id,
            type: "SIGNUP"
        }
    })
    if (!otpRecord) {
        throw new AppError(ERROR_MESSAGES.OTP_NOT_FOUND, HTTP_CODES.BAD_REQUEST);
    }
    if (new Date() > otpRecord.expiresAt) {
        throw new AppError(ERROR_MESSAGES.OTP_EXPIRED, HTTP_CODES.BAD_REQUEST);
    }
    if (otpRecord.otp !== value.otp) {
        throw new AppError(ERROR_MESSAGES.INVALID_OTP, HTTP_CODES.BAD_REQUEST);
    }
    await user_activiy_service.updateUserActivityForSignup(user.id)
    await OTPRequest.delete({
        where: {
            id: otpRecord.id
        }
    });
}

const resendSignUpOTP = async (value: { email: string }) => {
    const user = await user_service.findUser({ email: value.email })
    if (!user) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.BAD_REQUEST)
    }
    if (user.UserActivityStatus?.is_signup_email_verified) {
        throw new AppError(ERROR_MESSAGES.SIGNUP_ALREADY, HTTP_CODES.CONFLICT)
    }
    const otpRecord = await OTPRequest.findFirst({
        where: {
            userId: user.id,
            type: "SIGNUP"
        }
    })
    if (!otpRecord) {
        throw new AppError(ERROR_MESSAGES.OTP_NOT_FOUND, HTTP_CODES.BAD_REQUEST);
    }
    const otpCode = generateOTP(6);
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000);
    const updatedOTP = await OTPRequest.update({
        where: {
            id: otpRecord.id
        },
        data: {
            otp: otpCode,
            type: "SIGNUP",
            status: "PENDING",
            expiresAt: expiryTime,
        }
    });

    return {
        otp_expiry_time: updatedOTP.expiresAt,
    }

}

export const otp_service = {
    SendSignupOtp,
    deleteSignUpOtp,
    verifySignUpOTP,
    resendSignUpOTP
};
