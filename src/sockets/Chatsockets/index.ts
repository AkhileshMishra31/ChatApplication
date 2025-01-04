// ChatSocket.ts
import { Socket } from "socket.io";
import { baseSocket } from "../BaseSocket";
import { Server } from "socket.io";


export const chatSocket = (socket: Socket, io: Server, nsp: any) => {
    baseSocket(socket);

    // all listeners will be there
    socket.on('chatMessage', (msg: string) => {
        console.log(`[Chat Message]: ${msg}`);
        nsp.emit('receivedMessage', `Chat Echo: ${msg}`);
    });


    socket.on("sendtest", (msg: string) => {
        console.log(`[Test Message]: ${msg}`);
    })

};
