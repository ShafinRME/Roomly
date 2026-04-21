import { useState } from 'react'
import PropTypes from 'prop-types'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import useAuth from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import { AiFillStar } from 'react-icons/ai'

const ReviewModal = ({ isOpen, closeModal, roomId, refetch, bookingId }) => {
    const axiosSecure = useAxiosSecure()
    const { user } = useAuth()
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [hovered, setHovered] = useState(0)

    const handleSubmit = async () => {
        if (!rating) return toast.error('Please select a rating')
        try {
            // 1. Save review & update room avgRating
            await axiosSecure.post('/review', {
                roomId,
                rating,
                comment,
                reviewer: {
                    name: user.displayName,
                    email: user.email,
                    photo: user.photoURL,
                },
            })

            // 2. Mark this booking as reviewed
            await axiosSecure.patch(`/booking/reviewed/${bookingId}`)

            toast.success('Review submitted!')
            refetch()
            closeModal()
        } catch (err) {
            toast.error(err.message)
        }
    }

    if (!isOpen) return null

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'>
            <div className='bg-white rounded-2xl p-6 w-full max-w-md mx-4'>
                <h2 className='text-lg font-semibold mb-4'>Leave a review</h2>

                {/* Star Rating */}
                <div className='flex gap-1 mb-4'>
                    {[1, 2, 3, 4, 5].map(star => (
                        <AiFillStar
                            key={star}
                            size={28}
                            className='cursor-pointer transition'
                            color={(hovered || rating) >= star ? '#f59e0b' : '#d1d5db'}
                            onMouseEnter={() => setHovered(star)}
                            onMouseLeave={() => setHovered(0)}
                            onClick={() => setRating(star)}
                        />
                    ))}
                </div>

                {/* Comment */}
                <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder='Share your experience...'
                    className='w-full border border-neutral-200 rounded-xl p-3 text-sm resize-none outline-none focus:border-neutral-400'
                    rows={4}
                />

                <div className='flex justify-end gap-2 mt-4'>
                    <button onClick={closeModal}
                        className='px-4 py-2 text-sm rounded-full border border-neutral-200 hover:bg-neutral-50'>
                        Cancel
                    </button>
                    <button onClick={handleSubmit}
                        className='px-4 py-2 text-sm rounded-full bg-rose-500 text-white hover:bg-rose-600'>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

ReviewModal.propTypes = {
    isOpen: PropTypes.bool,
    closeModal: PropTypes.func,
    roomId: PropTypes.string,
    refetch: PropTypes.func,
    bookingId: PropTypes.string,
}

export default ReviewModal