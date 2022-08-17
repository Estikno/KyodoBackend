import { Request, Response } from "express";
import { uploadImage, deleteImage } from "../utils/cloudinary";
import fs from "fs-extra";
import { UploadedFile } from "express-fileupload";
import { UploadApiOptions } from "cloudinary";
import User from '../models/User';

/**
 * TODO: Add the image url to the database
 */
export async function changeAvatar(
    req: Request,
    res: Response
): Promise<Response> {
    if(!req.params.id){
        return res.json({message: "No user id provided", status: false});
    }

    if(!(await User.findById(req.params.id))){
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
        width: 400,
        crop: "fill",
        format: "png"
    };
    const result = await uploadImage(image.tempFilePath, options);
    await fs.unlink(image.tempFilePath);

    const updadedUser = await User.findByIdAndUpdate(req.params.id, {avatarImage: {
        isAvatarImageSet: true,
        avatarImageUrl: result.secure_url,
        avatarImagePublicId: result.public_id
    }}, {new: true});

    return res.json({
        result,
        message: "Image uploaded successfully",
        status: true,
        user: updadedUser
    });
}
