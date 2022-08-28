import {Request, Response} from 'express';
import User, {IUser} from '../models/User';
import IClientResponse from '../interfaces/IClientResponse';
import {createToken} from '../utils/jwt';

/**
 * This function registers the user and creates a new user in the database
 */
export async function register(req: Request, res: Response): Promise<Response> {
    const {username, password, email} = req.body;

    if(!username || !password || !email) {
        return res.json({
            message: 'Missing fields',
            status: false
        } as IClientResponse);
    }

    const userCheck = await User.findOne({username: username});
    const emailCheck = await User.findOne({email: email});

    if(userCheck || emailCheck) {
        return res.json({
            message: 'User already exists. Email or passowrd is repeated',
            status: false
        } as IClientResponse);
    }

    const newUser = new User({username, password, email});
    await newUser.save();

    const token: string = createToken(newUser._id);

    return res.json({message: 'User created', status: true, token: token} as IClientResponse);
}

/**
 * This function logs the user in and returns the user if the credentials are correct
 */
export async function login(req: Request, res: Response): Promise<Response> {
    const {username, password} = req.body;

    if(!username || !password) {
        return res.json({
            message: 'Missing fields',
            status: false
        } as IClientResponse);
    }

    const userCheck = await User.findOne({username: username});

    if(!userCheck) {
        return res.json({
            message: 'Incorrect username or password',
            status: false
        } as IClientResponse);
    }

    const isPasswordCorrect = await userCheck.comparePassword(password);

    if(!isPasswordCorrect){
        return res.json({
            message: 'Incorrect username or password',
            status: false
        } as IClientResponse);
    }

    const token: string = createToken(userCheck._id);

    return res.json({message: 'Logged in', status: true, token: token} as IClientResponse);
}