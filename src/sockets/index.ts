import { Server, Socket } from "socket.io";
import logger from "../config/logger";
import redisClient from "../redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { verifyRefreshToken } from "../utils/auth.utility";
import { TokenPayload } from "../interfaces/user.interface";


const pubClient = redisClient
const subClient = pubClient.duplicate();

export const SocketInit = async (server: any) => {
    await Promise.all([
        pubClient.connect(),
        subClient.connect()
    ]);
    const io = new Server(server, {
        adapter: createAdapter(pubClient, subClient),
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        logger.info(`Socket connected: ${socket.id}`);
        // chat listener

        socket.on("disconnect", () => {
            logger.info(`Socket disconnected: ${socket.id}`);
        });
    });

    io.use(async (socket: Socket, next) => {
        const token = socket.handshake.auth.token;

        const decoded = await verifyRefreshToken(token as string);
        if (!decoded) {
            io.emit('error', 'Unauthorized');
            return;
        }
        (socket.user as TokenPayload) = decoded;
        next();
    });



    logger.info(`[socket]: WebSocket server initialized`);
};
