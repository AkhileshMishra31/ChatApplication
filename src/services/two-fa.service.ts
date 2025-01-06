
import prisma from "../utils/db";
import { AppError } from "../utils/AppError";
import { user_service } from "./user.service";
import { ERROR_MESSAGES } from "../common/ErrorMessages";
import { HTTP_CODES } from "../common/StatusCodes";
import dotenv from "dotenv";
import { TokenPayload } from "../interfaces/user.interface";
import speakeasy from "speakeasy";
import qrcode from "qrcode";


dotenv.config();

const { twoFaAuth: TwoFaAuth } = prisma;

export const enableTwoFa = async (user: TokenPayload) => {
    const users = await user_service.getUser(user.id)
    if (!users) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.BAD_REQUEST)
    }
    const TwoFa = await TwoFaAuth.findUnique({ where: { userId: user.id } })

    if (TwoFa && TwoFa.isEnabled) {
        throw new AppError(ERROR_MESSAGES.TWOFA_ALREADY_ENABLED, HTTP_CODES.CONFLICT)
    }
    const secret = speakeasy.generateSecret({
        name: `${users.username}`,
        issuer: process.env.APP_NAME,
    });
    let url = speakeasy.otpauthURL({ secret: secret.base32, label: `${users.username}`, issuer: process.env.APP_NAME, encoding: 'base32' })
    
    if (!secret) {
        throw new AppError(ERROR_MESSAGES.TWOFA_CREATION_FAILED, HTTP_CODES.INTERNAL_SERVER_ERROR)
    }
    await TwoFaAuth.upsert({
        where: {
            userId: user.id
        },
        update: {
            secret: secret.base32,
            isEnabled: true
        },
        create: {
            userId: user.id,
            secret: secret.base32,
            isEnabled: true
        }
    })
    const qrCode = await qrcode.toDataURL(url as string);
    return qrCode
};


const verifyTwoFa = async (user: TokenPayload, code: string) => {
    const users = await user_service.getUser(user.id)
    if (!users) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.BAD_REQUEST)
    }
    const TwoFa = await TwoFaAuth.findUnique({ where: { userId: user.id } })
    if (!TwoFa || !TwoFa.isEnabled) {
        throw new AppError(ERROR_MESSAGES.TWOFA_NOT_ENABLED, HTTP_CODES.BAD_REQUEST)
    }
    const verified = speakeasy.totp.verify({
        secret: TwoFa.secret,
        encoding: 'base32',
        token: code,
        window: 1,
    });

    if (!verified) {
        throw new AppError(ERROR_MESSAGES.INVALID_OTP, HTTP_CODES.BAD_REQUEST)
    }
    return verified
}


export const two_fa_service = {
    enableTwoFa,
    verifyTwoFa
};