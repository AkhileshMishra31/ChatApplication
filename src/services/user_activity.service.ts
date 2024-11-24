import prisma from "../utils/db";
import { AppError } from "../utils/AppError";
import { IcreateUser } from "../interfaces/auth.interface";
import { ERROR_MESSAGES } from "../common/ErrorMessages";
import { HTTP_CODES } from "../common/StatusCodes";
import { user_service } from "./user.service";

const { userActivityStatus: UserActivityStatus } = prisma;


const createUserActivity = async (user_id: string) => {
    return await UserActivityStatus.create({
        data: {
            userId: user_id,
            is_signup_email_verified: false
        }
    })
}

const updateUserActivityForSignup = async (user_id: string) => {
    const userActivity = await UserActivityStatus.findFirst({
        where: {
            userId: user_id
        }
    })

    if (!userActivity) {
        throw new AppError(ERROR_MESSAGES.USER_ACTIVITY_NOT_FOUND, HTTP_CODES.NOT_FOUND)
    }
    const updatedUserActivity = await UserActivityStatus.update({
        where: {
            id: userActivity.id
        },
        data: {
            is_signup_email_verified: true,
        }
    })
    if (!updatedUserActivity) {
        throw new AppError(ERROR_MESSAGES.USER_ACTIVITY_FAILED, HTTP_CODES.INTERNAL_SERVER_ERROR)
    }

    return updatedUserActivity
}



export const user_activiy_service = {
    createUserActivity,
    updateUserActivityForSignup
};
