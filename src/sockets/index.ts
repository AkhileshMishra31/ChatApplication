import { Server, Socket } from "socket.io";
import logger from "../config/logger";
import { createAdapter } from "@socket.io/redis-adapter";
import { verifyRefreshToken } from "../utils/auth.utility";
import { TokenPayload } from "../interfaces/user.interface";
import { SocketManager } from "./SocketManager";



export const SocketInit = async (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    });
    SocketManager(io)
    logger.info('Socket server initialized');
};
