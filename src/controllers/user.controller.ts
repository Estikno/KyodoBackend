import {Request, Response} from 'express';
import User, {IUser} from '../models/User';

export async function getUsers(req: Request, res: Response): Promise<Response> {
    return res.json(await User.find());
}

export async function createUser(req: Request, res: Response): Promise<Response> {
    if(!req.body.email || !req.body.username || !req.body.password) {
        return res.status(400).json({
            message: 'Missing fields'
        });
    }

    const userEmail = await User.findOne({email: req.body.email});
    const userName = await User.findOne({username: req.body.username});

    if(userEmail || userName) {
        return res.status(400).json({
            message: 'User already exists. Email or passowrd is repeated'
        });
    }

    const newUser = new User(req.body);
    await newUser.save();

    return res.status(201).json(newUser);
}