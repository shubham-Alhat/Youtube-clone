// Here, the file is already in our server and further code is written. In this we are uploading file in cloudinary from OUR SERVER.

// Also Once we successfully uploaded file in cloudinary, we dont need file in OUR SERVER, so we have to remove it.

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    // Check if localFilePath is there or not
    if (!localFilePath) return null;

    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // file has uploaded successfully
    // console.log("file uploaded successfully on cloudinary", response.url);

    // after uploading successfully, unlink the files fro server BEFORE MOVING FORWARD
    fs.unlinkSync(localFilePath); // when uploaded then it will remove and when error occured then also. IMP thing is in public/temp/.gitkeep  this file actually imp for storing the tempory files.
    return response;
  } catch (error) {
    fs.unlink(localFilePath); // remove the locally saved temporary file as the upload operation got failed.
    return null;
  }
};

export { uploadOnCloudinary };
