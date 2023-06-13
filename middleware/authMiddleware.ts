import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { RequestWithUserObj } from "../types";
import { UserRecord } from "../records/user.record";

dotenv.config();

export const authMiddleware = (req: RequestWithUserObj, res: Response, next: NextFunction) => {
    const token = req.cookies?.jwt; 
    if(!token) {
        return res.status(401).json({
            message: 'Nieudana autoryzacja'
        });
    }

    jwt.verify(token, process.env.SIGNATURE, async(err: Error, data: any) => {
        if(err) {
            return res.status(403).json({message: 'Nieudana autoryzacja'});
        }

        const user = await UserRecord.getByTokenId(data.tokenId);
        if(!user) {
            return res.status(403).json({message: 'Nieudana autoryzacja'});
        }

        req.user = user;
        next();

    });
};