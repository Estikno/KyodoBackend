import { Request, Response } from "express";
import { uploadImage, deleteImage } from "../utils/cloudinary";
import fs from "fs-extra";
import User, { IUser } from '../models/User';

//interfaces
import {CChangePassword} from '../interfaces/IUsersInterfaces';
import { UploadedFile } from "express-fileupload";
import { UploadApiOptions, UploadApiResponse} from "cloudinary";
import IClientResponse from '../interfaces/IClientResponse';

export async function changeAvatar(
    req: Request,
    res: Response
): Promise<Response> {
    if(!req.body.user_id){
        return res.json({message: "No user id provided", status: false});
    }

    const beforeUser = await User.findById(req.body.user_id) as IUser;

    if(!beforeUser){
        return res.json({message: "User not found", status: false});
    }

    if (!req.files?.image) {
        return res.json({ message: "No image provided", status: false });
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
        format: "png"
    };
    const result: UploadApiResponse = await uploadImage(image.tempFilePath, options);
    await fs.unlink(image.tempFilePath);

    if(!(beforeUser.avatarImage.avatarImagePublicId === "")){
        await deleteImage(beforeUser.avatarImage.avatarImagePublicId);
    }

    const updadedUser = await User.findByIdAndUpdate(req.body.user_id, {avatarImage: {
        isAvatarImageSet: true,
        avatarImageUrl: result.secure_url,
        avatarImagePublicId: result.public_id
    }}, {new: true});

    return res.json({
        message: "Image uploaded successfully. Reload the page to see the changes",
        status: true
    } as IClientResponse);
}

export async function changePassword(req: Request, res: Response): Promise<Response> {
    const passwords = req.body as CChangePassword;

    if (!passwords.oldPassword || !passwords.newPassword) {
        return res.json({
            message: "Missing passwords",
            status: false
        } as IClientResponse);
    }

    const founduser = await User.findById(req.body.user_id);

    if (!founduser) {
        return res.json({
            message: "User not found",
            status: false
        } as IClientResponse);
    }

    if(!await founduser.comparePassword(passwords.oldPassword)){
        return res.json({
            message: "Old password is incorrect",
            status: false
        } as IClientResponse);
    }

    founduser.password = passwords.newPassword;
    const user = await founduser.save();

    return res.json({status: true, message: "Password changed"} as IClientResponse);
}