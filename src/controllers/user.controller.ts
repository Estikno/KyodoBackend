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
        return res.json({ message: "User not found" , status: false});
    }

    const checkedUser: IUserResponse = {
        username: foundUser.username,
        email: foundUser.email,
        avatarUrl: foundUser.avatarImage.avatarImageUrl
    };

    return res.json({user: checkedUser, message: "User found", status: true} as IClientResponse);
}

/**
 * Update a user by id or username
 * ! Do not use this function, it's deprecated and will be removed soon
 */
export async function updateUser(
    req: Request,
    res: Response
): Promise<Response> {
    //* Check if the user exists and if the body is valid
    if (!req.body.type)
        return res.status(400).json({
            message: "The type of search has not been said in the body",
        });

    if (req.body.type !== "id" && req.body.type !== "username")
        return res.status(400).json({ message: "Invalid type of search" });

    if (req.body.username) {
        if (await User.findOne({ username: req.body.username }))
            return res
                .status(400)
                .json({ message: "Cant update username, it is repeated" });
    }

    if (req.body.email) {
        if (await User.findOne({ email: req.body.email }))
            return res
                .status(400)
                .json({ message: "cannt update email, it is repeated" });
    }

    //* Update the user depending on the type of search
    if (req.body.type === "id") {
        let user = null;

        try {
            user = await User.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });
        } catch (err) {
            return res
                .status(500)
                .json({ message: "Internal server error, error: " + err });
        }

        if (!user) return res.status(404).json({ message: "User not found" });

        return res.json(user);
    } else {
        let user = null;

        try {
            user = await User.findOneAndUpdate(
                { username: req.params.id },
                req.body,
                { new: true }
            );
        } catch (err) {
            return res
                .status(500)
                .json({ message: "Internal server error, error: " + err });
        }

        if (!user) return res.status(404).json({ message: "User not found" });

        return res.json(user);
    }
}