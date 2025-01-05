import { createAdapter } from "@socket.io/redis-adapter";
import { Server, Socket } from "socket.io"
import { createClient } from "redis";
import { chatSocket } from "./Chatsockets";
import { verifyRefreshToken } from "../utils/auth.utility";
import { TokenPayload } from "../interfaces/user.interface";
import logger from "../config/logger";

const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();


export const SocketManager = async (io: Server) => {
    await Promise.all([
        pubClient.connect(),
        subClient.connect()
    ]);
    io.adapter(createAdapter(pubClient, subClient));
    setupNamespace(io, '/chat', chatSocket);
}


const setupNamespace = async (io: Server, namespace: string, handler: (socket: Socket, io: Server, nsp: any) => void) => {
    const nsp = io.of(namespace);
    nsp.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token || socket.handshake.query?.token;
            if (!token) {
                nsp.to(socket.id).emit('error', 'Unauthorized: No token provided');
                return;
            }
            const decoded = await verifyRefreshToken(token as string);
            (socket.user as TokenPayload) = decoded;
            next();
        } catch (error) {
            nsp.to(socket.id).emit('error', 'Unauthorized: No token provided');
        }
    });

    nsp.on('connection', (socket) => {
        logger.info(`Socket connected: ${socket.id}`);
        handler(socket, io, nsp);
    });
};