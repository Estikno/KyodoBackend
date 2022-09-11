import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import IJwt from '../interfaces/IJWT';

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["token"] as string;

    if (!token) {
        return res.json({ message: "No token provided", status: false });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET as string) as IJwt; //the decoded token will be an _id of an user
        req.body.user_id = decoded.id;

        next();
    } catch (error) {
        return res.json({ message: "Invalid token", status: false });
    }
}