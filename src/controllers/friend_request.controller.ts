
import { Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/common';
import { SUCCESS_MESSAGES } from '../common/SuccessMessages';
import { HTTP_CODES } from '../common/StatusCodes';
import { friend_request_service } from '../services/friend_request.service';
import { validateFriendRequestInput } from '../validations/friend_request.validation';
import { Iuser } from '../interfaces/user.interface';




export const sendFriendRequest = async (req: Request, res: Response) => {
    const { value, error } = validateFriendRequestInput(req.body)
    if (error) {
        throw new AppError(error.message, 400)
    }
    const friend_request = await friend_request_service.sendFriendRequest(value.receiverId, req.user as Iuser)
    return res.status(HTTP_CODES.CREATED).json({
        message: SUCCESS_MESSAGES.FRIEND_REQUEST_SENT,
        data: friend_request
    })
};

export const acceptFriendRequest = async (req: Request, res: Response) => {
    const { FriendRequestId } = req.params;
    const user = req.user as Iuser; 

    const result = await friend_request_service.acceptFriendRequest(FriendRequestId, user);

    return res.status(HTTP_CODES.OK).json({
        message: SUCCESS_MESSAGES.FRIEND_REQUEST_ACCEPTED,
        data: result,
    });
};



export const friend_request_controller = {
    sendFriendRequest: catchAsync(sendFriendRequest),
    acceptFriendRequest: catchAsync(acceptFriendRequest)
};