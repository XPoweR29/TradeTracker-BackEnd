import { Request } from 'express';
import { UserRecord } from '../../records/user.record';

export interface User {
    id?: string;
    username: string;
    email: string;
    pwd: string;
    currentTokenId?: string;
}

export interface RequestWithUserObj extends Request{
    user: UserRecord;
}