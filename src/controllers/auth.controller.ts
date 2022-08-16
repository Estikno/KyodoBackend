import {Request, Response} from 'express';
import User, {IUser} from '../models/User';

/**
 * This function registers the user and creates a new user in the database
 */
export async function register(req: Request, res: Response): Promise<Response> {
    const {username, password, email} = req.body;

    if(!username || !password || !email) {
        return res.json({
            message: 'Missing fields',
            status: false
        });
    }

    const userCheck = await User.findOne({username: username});
    const emailCheck = await User.findOne({email: email});

    if(userCheck || emailCheck) {
        return res.json({
            message: 'User already exists. Email or passowrd is repeated',
            status: false
        });
    }

    const newUser = new User({username, password, email});
    await newUser.save();

    return res.json({message: 'User created', status: true, user: newUser});
}

/*export async function login(req: Request, res: Response): Promise<Response> {
       
}*/