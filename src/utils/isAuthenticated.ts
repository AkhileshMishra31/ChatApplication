import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyRefreshToken } from "../utils/auth.utility";
import { AppError } from "../utils/AppError";
import { ERROR_MESSAGES } from "../common/ErrorMessages";
import { HTTP_CODES } from "../common/StatusCodes";
import { AuthRequest, TokenPayload } from "../interfaces/user.interface";


const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({ message: "Unauthorized: No token provided" });
            return;
        }
        const decoded = await verifyRefreshToken(token as string);
        req.user = decoded as TokenPayload;
        next();
    } catch (error) {
        next(error)
    }
};

export default isAuthenticated;
