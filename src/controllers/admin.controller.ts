import {Request, Response} from 'express';
import User, {IUser} from '../models/User';
import IClientResponse from '../interfaces/IClientResponse';
import {createToken, getTokenContent} from '../utils/jwt';
import config from "../config";

import {removeAvatar} from '../controllers/profile.controller';
import {deleteUser} from '../controllers/user.controller';

export async function banUser(req: Request, res: Response): Promise<Response>{
    const password = req.body.user_id;
    const userBan = req.body.banUser;

    if(!userBan) return res.json({message: "The user to ban is not found", status: false} as IClientResponse);

    if(password !== config.ADMIN_PASSWORD) return res.json({message: "Password is incorrect", status: false} as IClientResponse);

    const user: IUser | null = await User.findOne({username: userBan});

    if(!user) return res.json({message: "User not found", status: false} as IClientResponse);

    req.body.user_id = user._id;

    await removeAvatar(req, res);
    await deleteUser(req, res);

    return res.json({message: "User has been banned", status: true} as IClientResponse);
}

export async function getToken(req: Request, res: Response): Promise<Response>{
    const password = req.params.password;

    if(password !== config.ADMIN_PASSWORD) return res.json({message: "Invalid password", status: false} as IClientResponse);
    
    const token: string = createToken(password);

    return res.json({message: "Token created", status: true, token: token} as IClientResponse);
}