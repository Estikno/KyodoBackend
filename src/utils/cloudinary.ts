import { v2 as cloudinary, UploadApiOptions, UploadApiResponse, DeleteApiResponse } from "cloudinary";
import config from '../config';


cloudinary.config({
    cloud_name: config.CLOUD_NAME,
    api_key: config.API_KEY,
    api_secret: config.API_SECRET,
    secure: true
});

/**
 * Uploads an image file to the Cloudinary service
 * @param filePath the path to the file to upload
 * @param options options for the uploaded file
 * @returns Upload response
 */
export async function uploadImage(filePath: string, options: UploadApiOptions): Promise<UploadApiResponse> {
    return await cloudinary.uploader.upload(filePath, options);
}

/**
 * Deletes an image from the cloudinary service
 * @param publicId the image's public id
 * @returns Promise that resolves with a DeleteApiResponse object upon successful deletion of the image
 */
export async function deleteImage(publicId: string): Promise<DeleteApiResponse> {
    return await cloudinary.uploader.destroy(publicId);
}
