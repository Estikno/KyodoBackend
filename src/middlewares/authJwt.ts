import { Request, Response, NextFunction } from "express";
import {getTokenContent, verifyToken as vf} from '../utils/jwt';
import IClientResponse from '../interfaces/IClientResponse';

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["token"] as string;

    if (!token) {
        return res.json({ message: "No token provided", status: false } as IClientResponse);
    }

    if(!vf(token)) return res.json({ message: "Invalid token", status: false } as IClientResponse);

    req.body.user_id = getTokenContent(token);
    next();

    /*try {
        const decoded = jwt.verify(token, config.JWT_SECRET as string) as IJwt; //the decoded token will be an _id of an user
        req.body.user_id = decoded.id;

        next();
    } catch (error) {
        return res.json({ message: "Invalid token", status: false });
    }*/
}