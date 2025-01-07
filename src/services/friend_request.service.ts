import prisma from "../utils/db";
import { AppError } from "../utils/AppError";
import { ERROR_MESSAGES } from "../common/ErrorMessages";
import { HTTP_CODES } from "../common/StatusCodes";
import { Iuser } from "../interfaces/user.interface";
import { user_service } from "./user.service";
import { friend_service } from "./friends.service";

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


export const friend_request_service = {
    sendFriendRequest,
    acceptFriendRequest,
    cancelFriendRequest
};
