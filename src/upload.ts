import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'

export const upload = multer({ storage: multer.memoryStorage() })

export async function uploadToCloudinary(buffer: Buffer, folder: string): Promise<string> {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  return new Promise((resolve, reject) => {
    const base64 = buffer.toString('base64')
    const dataUri = `data:image/jpeg;base64,${base64}`

    cloudinary.uploader.upload(
      dataUri,
      { folder: `ngali-holdings/${folder}` },
      (error, result) => {
        if (error || !result) return reject(error)
        resolve(result.secure_url)
      }
    )
  })
}