import { Request, Response, NextFunction } from "express";
import {getTokenContent, verifyToken as vf} from '../utils/jwt';
import IClientResponse from '../interfaces/IClientResponse';

//rest api method
export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["token"] as string;

    if (!token) {
        return res.json({ message: "No token provided", status: false } as IClientResponse);
    }

    if(!vf(token)) return res.json({ message: "Invalid token", status: false } as IClientResponse);

    req.body.user_id = getTokenContent(token);
    next();
}

/**
 * Sees if the token is valid and if it is returns its content
 * @param token the session's token
 * @returns token content
 */
export function verifyTokenGraphql(token: String): string | null {
    const _token = token.toString();

    if (!_token) return null;
    if(!vf(_token)) return null;

    return getTokenContent(_token);
}