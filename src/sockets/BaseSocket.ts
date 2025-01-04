// BaseSocket.ts
import { Socket } from "socket.io";

export const baseSocket = (socket: Socket) => {
    socket.on('generalMessage', (msg: string) => {
        console.log(`[General Message]: ${msg}`);
        socket.emit('generalMessage', `Echo: ${msg}`);
    });
    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
};
