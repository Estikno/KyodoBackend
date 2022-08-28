import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from "cloudinary";
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

export async function deleteImage(publicId: string) {
    return await cloudinary.uploader.destroy(publicId);
}

/*import { uploadImage } from "../utils/cloudinary";
import { UploadedFile } from "express-fileupload";

export async function uploadTest(req: Request, res: Response) {
    if(!req.files?.image){
        return res.status(400).json({});
    }
    
    const image = req.files.image as UploadedFile;
    const result = await uploadImage(image.tempFilePath);

    await fs.unlink(image.tempFilePath);

    console.log(result);
    return res.status(200).json({});
}*/
