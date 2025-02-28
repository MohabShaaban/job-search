import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
import path from 'path'

import { ApiError } from './api-error.utils.js';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
export const uploadSingleFileToCloudinary = async (file, folderName) => {
    try {
        // Upload file to Cloudinary
        const data = await cloudinary.uploader.upload(file, {
            folder: folderName,
            resource_type: 'raw'
        });
        return data;
    } catch (error) {
        throw new ApiError('Failed to upload file to Cloudinary', 500, 'file upload service.');
    }
};


export const deleteFileFromCloudinary = async (publicId) => {
    try {
        // remove file to Cloudinary
        const data = await cloudinary.uploader.destroy(publicId);
        return data;
    } catch (error) {
        throw new ApiError('Failed to upload file to Cloudinary', 500, 'file upload service.');
    }
};
