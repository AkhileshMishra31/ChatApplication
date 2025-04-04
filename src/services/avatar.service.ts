
import prisma from "../utils/db";
import { AppError } from "../utils/AppError";
import { ERROR_MESSAGES } from "../common/ErrorMessages";
import { HTTP_CODES } from "../common/StatusCodes";
import { Iuser } from "../interfaces/user.interface";
import { user_service } from "./user.service";


const uploadAvatar = async (user: Iuser, file: Express.Multer.File) => {
    const user_details = await user_service.getUser(user.id)
    if (!user_details) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.BAD_REQUEST)
    }
    const profile = await user_service.updateProfilePicture(user.id, file.path)
    if(!profile){
        throw new AppError(ERROR_MESSAGES.PROFILE_PICTURE_FAILED, HTTP_CODES.BAD_REQUEST);
    }

    return profile;
}



export const avatar_service = {
    uploadAvatar,
};