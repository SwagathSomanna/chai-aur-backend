import { v2 as cloudinary} from "cloudinary";
import fs from "fs";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadToCloudinary = async (localFilePath, folder) => {
    try {
        if(!localFilePath) return null;
        //upload file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file uploaded to cloudinary, now remove from local uploads folder
        console.log("File uploaded to Cloudinary, now removing from local uploads folder",response.url);
        return response.url;
    } catch (error) {
        fs.unlinkSync(localFilePath); //remove file from local uploads folder
        return null;
    }
}

export {uploadToCloudinary};
