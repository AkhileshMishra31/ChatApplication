// src/types/socket.d.ts

import { Socket } from "socket.io";

import { TokenPayload } from './src/interfaces/user.interface';
// Extend the `Socket` interface to include `user`
declare module "socket.io" {
    interface Socket {
        user?: TokenPayload; 
    }
}
