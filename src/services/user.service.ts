import prisma from "../utils/db";
import { AppError } from "../utils/AppError";
import { IcreateUser } from "../interfaces/auth.interface";
import { ERROR_MESSAGES } from "../common/ErrorMessages";
import { HTTP_CODES } from "../common/StatusCodes";
import { user_activiy_service } from "./user_activity.service";
import { hashPassword } from "../utils/auth.utility";
import { Iuser } from "../interfaces/user.interface";

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
    payload = {
        ...payload,
        password: await hashPassword(payload.password)
    }
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


const listUsersRandomly = async (user: Iuser, query: { name?: string }) => {
    const current_user = await User.findUnique({
        where: {
            id: user.id,
            UserActivityStatus: {
                is_signup_email_verified: true
            }
        },
        select: {
            id: true,
            friendshipsInitiated: { select: { friendId: true } },
            friendshipsReceived: { select: { initiatorId: true } },
            GroupParticipant: { select: { groupId: true } },
        }
    })
    if (!current_user) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.BAD_REQUEST)
    }
    const currentFriendIds = new Set([
        ...current_user.friendshipsInitiated.map(f => f.friendId),
        ...current_user.friendshipsReceived.map(f => f.initiatorId),
    ]);

    const currentGroupIds = new Set(current_user.GroupParticipant.map(f => f.groupId));

    const users = await User.findMany({
        where: {
            id: {
                not: user.id,
            },
            ...(query.name ? { username: { contains: query.name, mode: 'insensitive' } } : {}),
        },
        select: {
            id: true,
            username: true,
            email: true,
            phone_number: true,
            profile_picture: true,
            country: true,
            _count: {
                select: {
                    friendshipsInitiated: {
                        where: {
                            friendId: {
                                in: [...currentFriendIds]
                            }
                        }
                    },
                    friendshipsReceived: {
                        where: {
                            initiatorId: {
                                in: [...currentFriendIds]
                            }
                        }
                    },
                    GroupParticipant: {
                        where: {
                            groupId: {
                                in: [...currentGroupIds]
                            }
                        }
                    }
                }
            }
        }
    })

    const ranked_users = users.map((user) => {
        const mutualFriends = user._count.friendshipsInitiated + user._count.friendshipsReceived;
        const sharedGroups = user._count.GroupParticipant;
        return {
            ...user,
            isFrinds: currentFriendIds.has(user.id),
            mutualFriends,
            sharedGroups,
            score: (currentFriendIds.has(user.id) ? 1000 : 0) + mutualFriends * 2 + sharedGroups,
        }
    })
    ranked_users.sort((a, b) => b.score - a.score);
    return ranked_users.slice(0, 20)
}

export const user_service = {
    findUser,
    createUser,
    getUser,
    signUpUser,
    deleteUser,
    listUsersRandomly
};
