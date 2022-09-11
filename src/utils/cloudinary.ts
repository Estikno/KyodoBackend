import { v2 as cloudinary, UploadApiOptions, UploadApiResponse, DeleteApiResponse } from "cloudinary";
import config from '../config';


cloudinary.config({
    cloud_name: config.CLOUD_NAME,
    api_key: config.API_KEY,
    api_secret: config.API_SECRET,
    secure: true
});

/**
 * Quick demo of how to upload an image to Cloudinary
 * ! Do not use this in production, it is just a quick demo
 */
export async function uploadImage(filePath: string, options: UploadApiOptions): Promise<UploadApiResponse> {
    return await cloudinary.uploader.upload(filePath, options);
}

export async function deleteImage(publicId: string): Promise<DeleteApiResponse> {
    return await cloudinary.uploader.destroy(publicId);
}
