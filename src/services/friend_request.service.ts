import prisma from "../utils/db";
import { AppError } from "../utils/AppError";
import { ERROR_MESSAGES } from "../common/ErrorMessages";
import { HTTP_CODES } from "../common/StatusCodes";
import { Iuser } from "../interfaces/user.interface";
import { user_service } from "./user.service";
import { friend_service } from "./friends.service";
import { chat_service } from "./chat.service"
import { paginated_query } from "../utils/pagination_utility";

const { friendRequest: FriendRequest } = prisma;

const sendFriendRequest = async (receiverId: string, senderId: Iuser) => {
    const sender = await user_service.getUser(senderId.id);
    if (!sender) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.INTERNAL_SERVER_ERROR)
    }
    const receiver = await user_service.getUser(receiverId);
    if (!receiver) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.INTERNAL_SERVER_ERROR)
    }
    if (sender.id === receiver.id) {
        throw new AppError(ERROR_MESSAGES.SELF_FRIEND_REQUEST, HTTP_CODES.BAD_REQUEST)
    }
    const existingFriend = await friend_service.areFriends(sender.id, receiver.id);
    if (existingFriend) {
        throw new AppError(ERROR_MESSAGES.FRIEND_ALREADY_EXIST, HTTP_CODES.CONFLICT);
    }
    const existingRequest = await FriendRequest.findFirst({
        where: {
            OR: [
                { senderId: sender.id, receiverId: receiver.id },
                { senderId: receiver.id, receiverId: sender.id },
            ],
        },
        orderBy: {
            createdAt: 'desc',
        }
    });
    if (existingRequest && (existingRequest.status !== 'CANCELLED' && existingRequest.status !== 'DECLINED')) {
        throw new AppError(ERROR_MESSAGES.FRIEND_REQUEST_ALREADY_SENT, HTTP_CODES.CONFLICT);
    }
    const friendRequest = await FriendRequest.create({
        data: {
            senderId: sender.id,
            receiverId: receiver.id
        }
    });
    return friendRequest;
}


const acceptFriendRequest = async (FriendRequestId: string, user: Iuser) => {
    const tx = await prisma.$transaction(async (tx) => {
        const friendRequest = await tx.friendRequest.findFirst({
            where: {
                id: FriendRequestId,
                receiverId: user.id
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        if (!friendRequest) {
            throw new AppError(ERROR_MESSAGES.FRIEND_REQUEST_NOT_FOUND, HTTP_CODES.NOT_FOUND);
        }
        if (friendRequest.status !== 'PENDING') {
            throw new AppError(ERROR_MESSAGES.FRIEND_REQUEST_ALREADY_ACCEPTED, HTTP_CODES.CONFLICT);
        }
        const existingFriend = await friend_service.areFriends(friendRequest.senderId, friendRequest.receiverId);
        if (existingFriend) {
            throw new AppError(ERROR_MESSAGES.FRIEND_ALREADY_EXIST, HTTP_CODES.CONFLICT);
        }

        await tx.friendRequest.update({
            where: {
                id: friendRequest.id
            },
            data: {
                status: 'ACCEPTED'
            }
        });
        const friends_payload = {
            senderId: friendRequest.senderId,
            receiverId: friendRequest.receiverId
        };
        await friend_service.addFriend(friends_payload, tx);
        await chat_service.initiateChat(friendRequest.senderId, friendRequest.receiverId, tx);

        return { message: "Friend request accepted, and friendship created" };
    });
    return tx;
};

const cancelFriendRequest = async (FriendRequestId: string, user: Iuser) => {
    const friendRequest = await FriendRequest.findFirst({
        where: {
            id: FriendRequestId,
            receiverId: user.id,
            status: "PENDING"
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    if (!friendRequest) {
        throw new AppError(ERROR_MESSAGES.FRIEND_REQUEST_NOT_FOUND, HTTP_CODES.NOT_FOUND);
    }
    const existingFriend = await friend_service.areFriends(friendRequest.senderId, friendRequest.receiverId);
    if (existingFriend) {
        throw new AppError(ERROR_MESSAGES.FRIEND_ALREADY_EXIST, HTTP_CODES.CONFLICT);
    }
    const request = await FriendRequest.update({
        where: {
            id: FriendRequestId
        },
        data: {
            status: "DECLINED"
        }
    })
    if (!request) {
        throw new AppError(ERROR_MESSAGES.FRIEND_REQUEST_UPDATED_FAILED, HTTP_CODES.INTERNAL_SERVER_ERROR)
    }
    return request
}

const getAllFriendRequests = async (user: Iuser, page: number, itemNo: number, query: { startDate?: string; endDate?: string; username?: string; }) => {
    let where_query = {};
    const pagination_query = paginated_query(page, itemNo)
    let date_query = {};
    if (query.username) {
        where_query = {
            ...where_query,
            sender: {
                username: {
                    contains: query.username,
                    mode: "insensitive"
                }
            }
        }
    }
    if (query.startDate && !query.endDate) {
        date_query = {
            createdAt: {
                gte: new Date(Number(query.startDate))
            }
        };
    } else if (query.endDate && !query.startDate) {
        date_query = {
            createdAt: {
                lt: new Date(Number(query.endDate))
            }
        };
    } else if (query.startDate && query.endDate) {
        date_query = {
            createdAt: {
                gte: new Date(Number(query.startDate)),
                lt: new Date(Number(query.endDate))
            }
        };
    }
    const friendRequest = await FriendRequest.findMany({
        where: {
            ...where_query,
            ...date_query,
            receiverId: user.id,
            status: "PENDING"
        },
        ...pagination_query,
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            sender: {
                select: {
                    id: true,
                    username: true,
                }
            },
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });

    const total_count = await FriendRequest.count({
        where: {
            ...where_query,
            ...date_query,
            receiverId: user.id,
            status: "PENDING"
        }
    });
    return {
        friendRequest,
        total_count
    };
}


export const friend_request_service = {
    sendFriendRequest,
    acceptFriendRequest,
    cancelFriendRequest,
    getAllFriendRequests
};
