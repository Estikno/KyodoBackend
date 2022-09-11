import { Request, Response } from "express";
import IClientResponse, { IUserResponse } from "../interfaces/IClientResponse";
import User, { IUser } from "../models/User";

/**
 * Get all users
 */
export async function getUsers(req: Request, res: Response): Promise<Response> {
    return res.json(await User.find());
}

/**
 * Get user by id
 */
export async function getUser(req: Request, res: Response): Promise<Response> {
    if(!req.body.user_id) {
        return res.json({
            message: "An error occurred, please try again later",
            status: false
        });
    }

    const foundUser: IUser | null = await User.findById(req.body.user_id);

    if (!foundUser) {
        return res.json({ message: "User not found" , status: false} as IClientResponse);
    }

    const checkedUser: IUserResponse = {
        username: foundUser.username,
        email: foundUser.email,
        avatarUrl: foundUser.avatarImage.avatarImageUrl
    };

    return res.json({user: checkedUser, message: "User found", status: true} as IClientResponse);
}

/**
 * Updates a user with the information passed, the update info has to be in the body in a "updateInfo" param
 * * Do not use this method to update the avatar or the password, these functions are already working in other special routes
 */
export async function updateUser(
    req: Request,
    res: Response
): Promise<Response> {
    if(!req.body.user_id){
        return res.json({ message: "User id not found" , status: false} as IClientResponse);
    }

    if(!req.body.updateInfo){
        return res.json({ message: "The body is missing" , status: false} as IClientResponse);
    }

    const foundUser: IUser | null = await User.findById(req.body.user_id);

    if(!foundUser){
        return res.json({ message: "User not found" , status: false} as IClientResponse);
    }

    await User.findByIdAndUpdate(req.body.user_id, req.body.updateInfo);

    return res.json({ message: "User updated" , status: true} as IClientResponse);
}