import { useState } from 'react'
import AddRoomForm from '../../../components/Form/AddRoomForm'
import useAuth from '../../../hooks/useAuth'
import { Helmet } from 'react-helmet-async'
import { useMutation } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { uploadMultipleImagesToCloudinary } from '../../../api/utils'

const AddRoom = () => {
    const navigate = useNavigate()
    const axiosSecure = useAxiosSecure()
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()
    const [selectedImages, setSelectedImages] = useState([])
    const [imagePreviews, setImagePreviews] = useState([])
    const [dates, setDates] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    })

    // Date range handler
    const handleDates = item => {
        setDates(item.selection)
    }

    const { mutateAsync } = useMutation({
        mutationFn: async roomData => {
            const { data } = await axiosSecure.post(`/room`, roomData)
            return data
        },
        onSuccess: () => {
            toast.success('Room Added Successfully!')
            navigate('/dashboard/my-listings')
            setLoading(false)
        },
    })

    // Handle multiple image selection
    const handleImages = e => {
        const files = Array.from(e.target.files)

        // Limit to 5 images
        if (files.length + selectedImages.length > 5) {
            toast.error('You can only upload up to 5 images')
            return
        }

        // Validate file types
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif']
        const invalidFiles = files.filter(file => !validTypes.includes(file.type))

        if (invalidFiles.length > 0) {
            toast.error('Please upload only JPG, PNG, WebP, or AVIF images')
            return
        }

        // Add new files to existing ones
        setSelectedImages(prev => [...prev, ...files])

        // Create preview URLs
        const newPreviews = files.map(file => URL.createObjectURL(file))
        setImagePreviews(prev => [...prev, ...newPreviews])
    }

    // Remove image from selection
    const removeImage = index => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index))
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    // Form handler
    const handleSubmit = async e => {
        e.preventDefault()

        if (selectedImages.length === 0) {
            toast.error('Please upload at least one image')
            return
        }

        setLoading(true)
        const form = e.target
        const location = form.location.value
        const category = form.category.value
        const title = form.title.value
        const to = dates.endDate
        const from = dates.startDate
        const price = form.price.value
        const guests = form.total_guest.value
        const bathrooms = form.bathrooms.value
        const description = form.description.value
        const bedrooms = form.bedrooms.value

        const host = {
            name: user?.displayName,
            image: user?.photoURL,
            email: user?.email,
        }

        try {
            // Upload all images to Cloudinary
            const imageUrls = await uploadMultipleImagesToCloudinary(selectedImages)

            const roomData = {
                location,
                category,
                title,
                to,
                from,
                price,
                guests,
                bathrooms,
                bedrooms,
                host,
                description,
                images: imageUrls, // Changed from single 'image' to 'images' array
            }

            console.table(roomData)

            // Post request to server
            await mutateAsync(roomData)
        } catch (err) {
            console.log(err)
            toast.error(err.message)
            setLoading(false)
        }
    }

    return (
        <>
            <Helmet>
                <title>Add Room | Dashboard</title>
            </Helmet>

            {/* Form */}
            <AddRoomForm
                dates={dates}
                handleDates={handleDates}
                handleSubmit={handleSubmit}
                imagePreviews={imagePreviews}
                handleImages={handleImages}
                removeImage={removeImage}
                loading={loading}
            />
        </>
    )
}

export default AddRoom
