import { Server } from "socket.io";
import logger from "../config/logger";
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
