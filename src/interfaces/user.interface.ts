import { Request } from "express";

export interface User {
    id: string;
    username: string;
    email: string;
    phone_number: string;
    profile_picture: string | null;
    country: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TokenPayload  {
    id: string;
    username: string;
    email: string;
}

export interface Iuser extends TokenPayload {
    
}


export interface AuthRequest extends Request {
    user:User
}
