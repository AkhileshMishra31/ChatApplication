
import prisma from "../utils/db";
import { AppError } from "../utils/AppError";
import { ERROR_MESSAGES } from "../common/ErrorMessages";
import { HTTP_CODES } from "../common/StatusCodes";

const { role: Role } = prisma;

const getRoleByName = async (name: string) => {
    const role = await Role.findFirst({
        where: {
            name: name
        }
    })
    if (!role) {
        throw new AppError(ERROR_MESSAGES.ROLE_NOT_FOUND, HTTP_CODES.INTERNAL_SERVER_ERROR)
    }
    return role;
};




export const role_service = {
    getRoleByName
};