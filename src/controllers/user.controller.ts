import { Request, Response } from "express";
import IClientResponse, { IUserResponse } from "../interfaces/IClientResponse";
import User, { IUser } from "../models/User";
import { deleteImage } from "../utils/cloudinary";
import { getRoomIdFromTwoUsers } from "../utils/roomUser";
import { Schema } from "mongoose";
import RoomUser, { IRoomUser } from "../models/RoomUser";
import { verifyTokenGraphql } from "../middlewares/authJwt";

/**
 * Get all users
 */
export async function getUsers(req: Request, res: Response): Promise<Response> {
    if (!req.body.user_id) {
        return res.json({
            message: "User id not found",
            status: false,
        } as IClientResponse);
    }

    const user_id: string = req.body.user_id;
    const actualUser: IUser | null = await User.findById(user_id);

    if (!actualUser) {
        return res.json({
            message: "User not verified",
            status: false,
        } as IClientResponse);
    }

    const allUsers: IUser[] = await User.find();
    const returningUsers: IUserResponse[] = [];

    for (const user of allUsers) {
        if (user.username !== actualUser.username) {
            let _id: string = "";

            const roomUser1: IRoomUser[] = await RoomUser.find({
                idUser: user.id,
            });
            const roomUser2: IRoomUser[] = await RoomUser.find({
                idUser: actualUser.id,
            });

            if (roomUser1.length === 0 || roomUser2.length === 0) {
                returningUsers.push({
                    username: user.username,
                    email: user.email,
                    avatarUrl: user.avatarImage.avatarImageUrl,
                    verified: user.email_verified,
                });
                continue;
            }

            roomUser1.map((roomUser, index) => {
                if (
                    roomUser.idRoom.toString() ===
                    roomUser2[index].idRoom.toString()
                ) {
                    _id = roomUser.idRoom.toString();
                }
            });

            returningUsers.push({
                username: user.username,
                email: user.email,
                avatarUrl: user.avatarImage.avatarImageUrl,
                verified: user.email_verified,
                idRoom: _id,
            });

            console.log({
                username: user.username,
                email: user.email,
                avatarUrl: user.avatarImage.avatarImageUrl,
                verified: user.email_verified,
                idRoom: _id,
            });
        }
    }

    return res.json({
        message: "All user",
        status: true,
        user: returningUsers,
    } as IClientResponse);
}

export async function getUsersGraphql(token: String): Promise<IClientResponse> {
    const user_id = verifyTokenGraphql(token);

    if (!user_id) {
        return {
            message: "User id not found",
            status: false,
        } as IClientResponse;
    }

    const actualUser: IUser | null = await User.findById(user_id);

    if (!actualUser) {
        return {
            message: "User not verified",
            status: false,
        } as IClientResponse;
    }

    const allUsers: IUser[] = await User.find();
    const returningUsers: IUserResponse[] = [];

    for (const user of allUsers) {
        if (user.username !== actualUser.username) {
            let _id: string = "";

            const roomUser1: IRoomUser[] = await RoomUser.find({
                idUser: user.id,
            });
            const roomUser2: IRoomUser[] = await RoomUser.find({
                idUser: actualUser.id,
            });

            if (roomUser1.length === 0 || roomUser2.length === 0) {
                returningUsers.push({
                    username: user.username,
                    email: user.email,
                    avatarUrl: user.avatarImage.avatarImageUrl,
                    verified: user.email_verified,
                });
                continue;
            }

            roomUser1.map((roomUser, index) => {
                if (
                    roomUser.idRoom.toString() ===
                    roomUser2[index].idRoom.toString()
                ) {
                    _id = roomUser.idRoom.toString();
                }
            });

            returningUsers.push({
                username: user.username,
                email: user.email,
                avatarUrl: user.avatarImage.avatarImageUrl,
                verified: user.email_verified,
                idRoom: _id,
            });
        }
    }

    return {
        message: "All user",
        status: true,
        user: returningUsers,
    } as IClientResponse;
}

/**
 * Get user by id
 */
export async function getUser(req: Request, res: Response): Promise<Response> {
    if (!req.body.user_id) {
        return res.json({
            message: "An error occurred, please try again later",
            status: false,
        });
    }

    const foundUser: IUser | null = await User.findById(req.body.user_id);

    if (!foundUser) {
        return res.json({
            message: "User not found",
            status: false,
        } as IClientResponse);
    }

    const checkedUser: IUserResponse = {
        username: foundUser.username,
        email: foundUser.email,
        avatarUrl: foundUser.avatarImage.avatarImageUrl,
        verified: foundUser.email_verified,
    };

    return res.json({
        user: checkedUser,
        message: "User found",
        status: true,
    } as IClientResponse);
}

export async function getUserGraphql(token: String, username: String): Promise<IClientResponse> {
    const user_id = verifyTokenGraphql(token);

    if (!user_id) {
        return {
            message: "An error occurred, please try again later",
            status: false,
        } as IClientResponse;
    }

    const seeUser: IUser | null = await User.findById(user_id);

    if (!seeUser) {
        return {
            message: "Not valid token",
            status: false,
        } as IClientResponse;
    }

    const foundUser: IUser | null = await User.findOne({username: username.toString()});

    if (!foundUser) {
        return {
            message: "Not valid token",
            status: false,
        } as IClientResponse;
    }

    const checkedUser: IUserResponse = {
        username: foundUser.username,
        email: foundUser.email,
        avatarUrl: foundUser.avatarImage.avatarImageUrl,
        verified: foundUser.email_verified,
    };

    return {
        user: checkedUser,
        message: "User found",
        status: true,
    } as IClientResponse
}

/**
 * Updates a user with the information passed, the update info has to be in the body in a "updateInfo" param
 * * Do not use this method to update the avatar or the password, these functions are already working in other special routes
 */
export async function updateUser(
    req: Request,
    res: Response
): Promise<Response> {
    if (!req.body.user_id) {
        return res.json({
            message: "User id not found",
            status: false,
        } as IClientResponse);
    }

    if (!req.body.updateInfo) {
        return res.json({
            message: "The body is missing",
            status: false,
        } as IClientResponse);
    }

    const foundUser: IUser | null = await User.findById(req.body.user_id);

    if (!foundUser) {
        return res.json({
            message: "User not found",
            status: false,
        } as IClientResponse);
    }

    await User.findByIdAndUpdate(req.body.user_id, req.body.updateInfo);

    return res.json({
        message: "User updated",
        status: true,
    } as IClientResponse);
}

export async function deleteUser(
    req: Request,
    res: Response
): Promise<Response> {
    if (!req.body.user_id) {
        return res.json({
            message: "Token not provided",
            status: false,
        } as IClientResponse);
    }

    const foundUser: IUser | null = await User.findById(req.body.user_id);

    if (!foundUser) {
        return res.json({
            message: "User not found",
            status: false,
        } as IClientResponse);
    }

    if (foundUser.avatarImage.avatarImagePublicId === "") {
        await User.findByIdAndDelete(req.body.user_id);
        return res.json({
            message: "User deleted",
            status: true,
        } as IClientResponse);
    }

    await deleteImage(foundUser.avatarImage.avatarImagePublicId);
    await User.findByIdAndDelete(req.body.user_id);

    return res.json({
        message: "User deleted",
        status: true,
    } as IClientResponse);
}
