import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (buffer, folder = "BackMyDay") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resourse_type: "auto",
        folder,
      },
      (error, result) => {
        if (error) {
          console.error("ERROR :: Cloudinary upload error :: ", error);
          reject(error);
        } else {
          console.log(
            "File uploaded successfully on cloudinary :: ",
            result.secure_url
          );
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export { uploadOnCloudinary };
