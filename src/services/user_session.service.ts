
import prisma from "../utils/db";
import { AppError } from "../utils/AppError";
import { ERROR_MESSAGES } from "../common/ErrorMessages";
import { HTTP_CODES } from "../common/StatusCodes";

const { userSessions: UserSessions } = prisma;

const getUserSession = async (refresh_token: string) => {
  const user_session = await UserSessions.findFirst({ where: { refresh_token: refresh_token } })
  if (!user_session) {
    throw new AppError(ERROR_MESSAGES.INVALID_REFRESH_TOKEN, HTTP_CODES.BAD_REQUEST)
  }
  return user_session;
};

const createUserSession = async (user_id: string, refresh_token: string) => {
  const user_session = await UserSessions.create({ data: { userId: user_id, refresh_token: refresh_token } })
  return user_session;
}


export const user_session_service = {
  getUserSession,
  createUserSession
};