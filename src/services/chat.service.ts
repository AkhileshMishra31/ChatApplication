import { ChatType } from "@prisma/client"
import { ERROR_MESSAGES } from "../common/ErrorMessages"
import { HTTP_CODES } from "../common/StatusCodes"
import { IGroup } from "../interfaces/game.interface"
import { Iuser } from "../interfaces/user.interface"
import { AppError } from "../utils/AppError"
import prisma from "../utils/db"
import { user_service } from "./user.service"
import { Prisma } from "@prisma/client"

const { chat: Chat } = prisma;



const getChatList = async (page: number, itemNo: number, query: { name?: string, cursor?: string }, user: Iuser) => {
    const user_data = await user_service.findUser({ email: user.email })
    if (!user_data) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.INTERNAL_SERVER_ERROR)
    }
    const selectQuery = Prisma.sql`
     SELECT c.*, 
           (SELECT m."createdAt" 
            FROM "Message" m 
            WHERE m."chatId" = c."id" 
            ORDER BY m."createdAt" DESC 
            LIMIT 1) AS lastMessageAt
    `;
    const baseQuery = Prisma.sql`
    FROM "Chat" c
    JOIN "Participant" p ON p."chatId" = c."id"
    JOIN "User" u ON p."userId" = u."id"`;

    const UserQuery = Prisma.sql`
    WHERE p."userId" = ${user_data.id}
    `;
    const SearchQuery = query.name
        ? Prisma.sql`AND LOWER(u."username") LIKE LOWER(${`%${query.name}%`})`
        : Prisma.sql``;

    const CursorQuery = query.cursor
        ? Prisma.sql`
            AND (SELECT m."createdAt" 
                 FROM "Message" m 
                 WHERE m."chatId" = c."id" 
                 ORDER BY m."createdAt" DESC 
                 LIMIT 1) < ${query.cursor}
        `
        : Prisma.sql``;

    const orderQuery = Prisma.sql`
    ORDER BY lastMessageAt DESC
    `;
    const paginationQuery = Prisma.sql`
    LIMIT ${itemNo}  
    `;
    const finalQuery = Prisma.sql`
            ${selectQuery}
            ${baseQuery}
            ${UserQuery}
            ${SearchQuery}
            ${CursorQuery}
            ${orderQuery}
            ${paginationQuery}
    `;
    const chats: any = await prisma.$queryRaw(finalQuery);
    if (!chats) {
        throw new AppError(ERROR_MESSAGES.CHAT_NOT_FOUND, HTTP_CODES.INTERNAL_SERVER_ERROR)
    }
    const nextCursor = chats.length > 0 ? chats[chats.length - 1].lastMessageAt : null;
    return {
        data: chats,
        nextCursor
    }

}

const initiateChat = async (userId: string, userId2: string, tx: Prisma.TransactionClient) => {
    const user1_data = await user_service.getUser(userId)
    const user2_data = await user_service.getUser(userId2)
    if (!user1_data || !user2_data) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.INTERNAL_SERVER_ERROR)
    }
    const prismaClient = tx ?? prisma;
    const chat = await prismaClient.chat.create({
        data: {
            type: ChatType.DIRECT,
            participants: {
                create: [
                    { userId: user1_data.id },
                    { userId: user2_data.id }
                ]
            }
        }
    })
    if (!chat) {
        throw new AppError(ERROR_MESSAGES.CHAT_NOT_CREATED, HTTP_CODES.INTERNAL_SERVER_ERROR)
    }
    return chat
}


export const chat_service = {
    getChatList,
    initiateChat
}