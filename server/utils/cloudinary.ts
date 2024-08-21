import { v2 as cloudinary } from "cloudinary";

import dotenv from "dotenv";
dotenv.config({ path: "config/.env.local" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = async (
  image: string,
  folder: string
) => {
  const result = await cloudinary.uploader.upload(image, { folder });
  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};

export const uploadMultipleImages = async (
  images: string[],
  folder: string
) => {
  const uploadPromises = images?.map((image) =>
    uploadImageToCloudinary(image, folder)
  );
  return Promise.all(uploadPromises);
};

export const deleteImageToCloudinary = async (publicId: string) => {
  const res = await cloudinary.uploader.destroy(publicId);

  return res?.result === "ok";
};
