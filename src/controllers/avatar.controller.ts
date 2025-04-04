
import { Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/common';
import { SUCCESS_MESSAGES } from '../common/SuccessMessages';
import { HTTP_CODES } from '../common/StatusCodes';
import { avatar_service } from '../services/avatar.service';
import { Iuser } from '../interfaces/user.interface';


export const uploadAvatar = async (req: Request, res: Response) => {
    const user = req.user as Iuser;
    console.log(req.file)
    const avatar = await avatar_service.uploadAvatar(user, req.file as Express.Multer.File);

    return res.status(HTTP_CODES.CREATED).json({
        message: SUCCESS_MESSAGES.AVATAR_UPLOAD_SUCCESS,
        data: avatar
    })
};



export const avatar_controller = {
    uploadAvatar: catchAsync(uploadAvatar),
};