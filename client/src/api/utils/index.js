import axios from 'axios'

// OLD: ImgBB upload (keep for backward compatibility)
export const imageUpload = async image => {
    const formData = new FormData()
    formData.append('image', image)
    const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        formData
    )
    return data.data.display_url
}

// NEW: Cloudinary functions
const getCloudinaryConfig = () => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary configuration is missing. Please check your .env.local file.')
    }

    return { cloudName, uploadPreset }
}

export const uploadImageToCloudinary = async (image) => {
    const config = getCloudinaryConfig()
    const formData = new FormData()

    formData.append('file', image)
    formData.append('upload_preset', config.uploadPreset)

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        )

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`)
        }

        const data = await response.json()
        return data.secure_url
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error)
        throw new Error('Failed to upload image. Please try again.')
    }
}

export const uploadMultipleImagesToCloudinary = async (images, onProgress) => {
    try {
        const imageArray = Array.from(images)
        const uploadPromises = imageArray.map(async (image, index) => {
            const url = await uploadImageToCloudinary(image)
            if (onProgress) {
                onProgress(index + 1, imageArray.length)
            }
            return url
        })

        const imageUrls = await Promise.all(uploadPromises)
        return imageUrls
    } catch (error) {
        console.error('Error uploading multiple images:', error)
        throw new Error('Failed to upload one or more images. Please try again.')
    }
}