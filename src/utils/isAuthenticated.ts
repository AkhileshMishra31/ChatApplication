import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    // try {
    //     const token = req.header("Authorization")?.replace("Bearer ", "");
    //     if (!token) {
    //         return res.status(401).json({ message: "Unauthorized: No token provided" });
    //     }
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    //     req.user = decoded;
    //     next();
    // } catch (error) {
    //     console.error("Authentication failed:", error);
    //     return res.status(401).json({ message: "Unauthorized: Invalid token" });
    // }
};
