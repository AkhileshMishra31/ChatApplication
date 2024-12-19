// src/types/express.d.ts
import { User } from '@prisma/client';
import { TokenPayload } from './src/interfaces/user.interface';


declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload
        }
    }
}