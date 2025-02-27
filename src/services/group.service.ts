import { ChatType } from "@prisma/client"
import { ERROR_MESSAGES } from "../common/ErrorMessages"
import { HTTP_CODES } from "../common/StatusCodes"
import { IGroup } from "../interfaces/game.interface"
import { Iuser } from "../interfaces/user.interface"
import { AppError } from "../utils/AppError"
import prisma from "../utils/db"
import { role_service } from "./role.service"
import { user_service } from "./user.service"

const { group: Groups } = prisma;


const createGroup = async (user: Iuser, payload: IGroup) => {
    const user_data = await user_service.findUser({ email: user.email })
    if (!user_data) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.INTERNAL_SERVER_ERROR)
    }
    const role = await role_service.getRoleByName("ADMIN");
    if (!role) {
        throw new AppError(ERROR_MESSAGES.ROLE_NOT_FOUND, HTTP_CODES.INTERNAL_SERVER_ERROR)
    }

    await Groups.create({
        data: {
            name: payload.name,
            description: payload.description,
            profile_picture: payload.profile_picture,
            createdById: user_data.id,
            participants: {
                create: {
                    userId: user_data.id,
                    roleId: role.id,
                }
            },
            chat: {
                create: {
                    type: ChatType.GROUP,
                    participants: {
                        create: {
                            userId: user_data.id,
                        }
                    }
                }
            }
        },
        select: {
            id: true,
            name: true,
            description: true,
            profile_picture: true,
            chat: {
                select: {
                    id: true,
                    messages:{
                        select: {
                            id: true,
                            content: true,
                            messageReceipts: {
                                select:{
                                    
                                }
                            }
                        },
                        orderBy: {
                            createdAt: 'desc'
                        },
                        take: 1
                    }
                }
            }
        }
    })
}





const group_service = {
    createGroup
}