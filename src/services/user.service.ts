import prisma from "../utils/db";
import { AppError } from "../utils/AppError";
import { IcreateUser } from "../interfaces/auth.interface";
import { ERROR_MESSAGES } from "../common/ErrorMessages";
import { HTTP_CODES } from "../common/StatusCodes";
import { user_activiy_service } from "./user_activity.service";

const { user: User } = prisma;

export const findUser = async (filter: { email?: string; phone_number?: string; username?: string }) => {
    const { email, phone_number, username } = filter;
    if (!email && !phone_number && !username) {
        throw new AppError(ERROR_MESSAGES.USER_DATA_REQUIRED, HTTP_CODES.BAD_REQUEST);
    }
    const user = await User.findFirst({
        where: {
            ...(email && { email: email }),
            ...(phone_number && { phone_number: phone_number }),
            ...(username && { username: username })
        },
        include: {
            UserActivityStatus: true,
            OTPRequest: true
        }
    });

    return user;
};

const createUser = async (payload: IcreateUser) => {
    const user = await User.create({
        data: payload,
    })
    if (!user) {
        throw new AppError(ERROR_MESSAGES.USER_CREATION_FAILED, HTTP_CODES.INTERNAL_SERVER_ERROR)
    }

    return user
}

const getUser = async (user_id: string) => {
    const user = await User.findUnique({
        where: {
            id: user_id
        }
    })
    if (!user) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.BAD_REQUEST)
    }
    return user
}

const signUpUser = async (payload: IcreateUser) => {
    const user = await createUser(payload)
    if (!user) {
        throw new AppError(ERROR_MESSAGES.USER_CREATION_FAILED, HTTP_CODES.INTERNAL_SERVER_ERROR)
    }
    await user_activiy_service.createUserActivity(user.id)
    return user;
}

const deleteUser = async (user_id: string) => {
    return await User.delete({
        where: {
            id: user_id
        }
    })
}


export const user_service = {
    findUser,
    createUser,
    getUser,
    signUpUser,
    deleteUser
};
