import prisma from "../utils/db";
import { AppError } from "../utils/AppError";
import { ERROR_MESSAGES } from "../common/ErrorMessages";
import { HTTP_CODES } from "../common/StatusCodes";
import { Iuser } from "../interfaces/user.interface";
import { user_service } from "./user.service";
import { IAddFriends } from "../interfaces/friends.interface";
import { paginated_query } from "../utils/pagination_utility";
import { equal } from "joi";

const { friends: Friends } = prisma;

const areFriends = async (receiverId: string, senderId: string): Promise<boolean> => {
    const friendship = await Friends.findFirst({
        where: {
            OR: [
                { initiatorId: senderId, friendId: receiverId },
                { initiatorId: receiverId, friendId: senderId },
            ],
        },
    });

    return friendship !== null;
};

const addFriend = async (payload: IAddFriends, tx: any) => {
    await tx.friends.create({
        data: payload
    });
};


const getFriendsList = async (page: number, itemNo: number, query: { name?: string }, user: Iuser) => {
    const users = await user_service.getUser(user.id)
    if (!users) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.BAD_REQUEST)
    }
    const pagination_query = paginated_query(page, itemNo)
    let name_query = {};
    if (query.name) {
        name_query = {
            OR: [
                { initiator: { username: { contains: query.name, mode: 'insensitive' } } },
                { friend: { username: { contains: query.name, mode: 'insensitive' } } },
            ],
        };
    }
    let friend_query = {
        OR: [{ initiatorId: { equals: user.id } }, { friendId: { equals: user.id } }]
    }
    const order_query = [
        { initiator: { username: 'asc' } },
        { friend: { username: 'asc' } }
    ]

    const friends = await Friends.findMany({
        where: {
            AND: [
                friend_query,
                name_query
            ]
        },
        ...pagination_query,
        orderBy: order_query as any,
        select: {
            initiator: {
                select: {
                    id: true,
                    username: true,
                    profile_picture: true,
                    email: true,
                }
            },
            friend: {
                select: {
                    id: true,
                    username: true,
                    profile_picture: true,
                    email: true,
                }
            },
            createdAt: true
        }
    })

    const total_count = await Friends.count({
        where: {
            AND: [friend_query, name_query],
        },
    });
    const formatted_friends = friends
        .map((friendship) => {
            const isInitiator = friendship.initiator.id === user.id;
            const friend = isInitiator ? friendship.friend : friendship.initiator;
            return {
                ...friend,
                createdAt: friendship.createdAt,
            };
        })
        .sort((a, b) => a.username.localeCompare(b.username));

    return {
        data: formatted_friends,
        total_count: total_count
    }
}





export const friend_service = {
    areFriends,
    addFriend,
    getFriendsList
};
