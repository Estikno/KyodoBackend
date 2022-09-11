import { Request, Response } from "express";
import { uploadImage, deleteImage } from "../utils/cloudinary";
import fs from "fs-extra";
import User, { IUser } from "../models/User";
import config from "../config";

//interfaces
import { CChangePassword } from "../interfaces/IUsersInterfaces";
import { UploadedFile } from "express-fileupload";
import { UploadApiOptions, UploadApiResponse } from "cloudinary";
import IClientResponse from "../interfaces/IClientResponse";

export async function changeAvatar(
    req: Request,
    res: Response
): Promise<Response> {
    if (!req.body.user_id) {
        return res.json({
            message: "No user id provided",
            status: false,
        } as IClientResponse);
    }

    const beforeUser = (await User.findById(req.body.user_id)) as IUser;

    if (!beforeUser) {
        return res.json({
            message: "User not found",
            status: false,
        } as IClientResponse);
    }

    if (!req.files?.image) {
        return res.json({
            message: "No image provided",
            status: false,
        } as IClientResponse);
    }

    const image = req.files.image as UploadedFile;
    const options: UploadApiOptions = {
        folder: "kyodo/avatars",
        aspect_ratio: "1:1",
        gravity: "auto",
        opacity: 100,
        radius: "max",
        width: 300,
        crop: "fill",
        format: "png",
    };
    const result: UploadApiResponse = await uploadImage(
        image.tempFilePath,
        options
    );
    await fs.unlink(image.tempFilePath);

    if (!(beforeUser.avatarImage.avatarImagePublicId === "")) {
        await deleteImage(beforeUser.avatarImage.avatarImagePublicId);
    }

    await User.findByIdAndUpdate(
        req.body.user_id,
        {
            avatarImage: {
                avatarImageUrl: result.secure_url,
                avatarImagePublicId: result.public_id,
            },
        },
        { new: true }
    );

    return res.json({
        message:
            "Image uploaded successfully. Reload the page to see the changes",
        status: true,
    } as IClientResponse);
}

export async function changePassword(
    req: Request,
    res: Response
): Promise<Response> {
    const passwords = req.body as CChangePassword;

    if (!passwords.oldPassword || !passwords.newPassword) {
        return res.json({
            message: "Missing passwords",
            status: false,
        } as IClientResponse);
    }

    const founduser = await User.findById(req.body.user_id);

    if (!founduser) {
        return res.json({
            message: "User not found",
            status: false,
        } as IClientResponse);
    }

    if (!(await founduser.comparePassword(passwords.oldPassword))) {
        return res.json({
            message: "Old password is incorrect",
            status: false,
        } as IClientResponse);
    }

    founduser.password = passwords.newPassword;
    const user = await founduser.save();

    return res.json({
        status: true,
        message: "Password changed",
    } as IClientResponse);
}

export async function removeAvatar(
    req: Request,
    res: Response
): Promise<Response> {
    if (!req.body.user_id) {
        return res.json({
            message: "No user id provided",
            status: false,
        } as IClientResponse);
    }

    const foundUser = await User.findById(req.body.user_id);

    if (!foundUser) {
        return res.json({
            message: "User not found",
            status: false,
        } as IClientResponse);
    }

    //the user is already with the default avatar
    if (foundUser.avatarImage.avatarImagePublicId === "") {
        return res.json({
            message: "Already with the default avatar",
            status: false,
        } as IClientResponse);
    }

    await deleteImage(foundUser.avatarImage.avatarImagePublicId);

    if (!config.DEFAULT_AVATAR_URL)
        return res.json({
            message: "Default avatar url is not set",
            status: false,
        } as IClientResponse);

    foundUser.avatarImage = {
        avatarImageUrl: config.DEFAULT_AVATAR_URL,
        avatarImagePublicId: "",
    };

    foundUser.save();

    return res.json({
        message: "Avatar removed successfully",
        status: true,
    } as IClientResponse);
}
