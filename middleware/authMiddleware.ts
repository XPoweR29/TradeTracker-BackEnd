import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

export const authMiddleware = (req: Record<'user', any> & Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.jwt;
    if(!token) {
        return res.status(401).json({
            message: 'Nieudana autoryzacja'
        });
    }

    jwt.verify(token, process.env.SIGNATURE, (err: Error, data: any) => {
        if(err) {
            return res.status(403).json({
                message: 'Nieudana autoryzacja'
            });
        }
        req.user = data;
        next();
    });
};