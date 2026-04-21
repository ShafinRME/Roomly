import { format } from 'date-fns'
import PropTypes from 'prop-types'
import { useState } from 'react'
import DeleteModal from '../../Modal/DeleteModal'
import ReviewModal from '../../Modal/ReviewModal'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const BookingDataRow = ({ booking, refetch }) => {
    const axiosSecure = useAxiosSecure()
    const [isOpen, setIsOpen] = useState(false)
    const [reviewOpen, setReviewOpen] = useState(false)

    const closeModal = () => setIsOpen(false)

    const isCompleted = new Date(booking?.to) < new Date()

    // Get the first image from images array, fallback to single image for backward compatibility
    const displayImage = booking?.images?.[0] || booking?.image || '/placeholder.jpg'

    const { mutateAsync } = useMutation({
        mutationFn: async id => {
            const { data } = await axiosSecure.delete(`/booking/${id}`)
            return data
        },
        onSuccess: async () => {
            refetch()
            toast.success('Booking Canceled')
            await axiosSecure.patch(`/room/status/${booking?.roomId}`, { status: false })
        },
    })

    const handleDelete = async id => {
        try {
            await mutateAsync(id)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <tr>
            {/* Title */}
            <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                <div className='flex items-center'>
                    <div className='flex-shrink-0'>
                        <img
                            alt='room'
                            src={displayImage}
                            className='mx-auto object-cover rounded h-10 w-15'
                        />
                    </div>
                    <div className='ml-3'>
                        <p className='text-gray-900 whitespace-no-wrap'>{booking?.title}</p>
                    </div>
                </div>
            </td>

            {/* Guest Info */}
            <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                <div className='flex items-center'>
                    <img
                        alt='guest'
                        src={booking?.guest?.image}
                        className='mx-auto object-cover rounded h-10 w-15'
                    />
                    <div className='ml-3'>
                        <p className='text-gray-900 whitespace-no-wrap'>{booking?.guest?.name}</p>
                    </div>
                </div>
            </td>

            {/* Price */}
            <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                <p className='text-gray-900 whitespace-no-wrap'>${booking?.price}</p>
            </td>

            {/* From */}
            <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                <p className='text-gray-900 whitespace-no-wrap'>
                    {format(new Date(booking?.from), 'P')}
                </p>
            </td>

            {/* To */}
            <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                <p className='text-gray-900 whitespace-no-wrap'>
                    {format(new Date(booking?.to), 'P')}
                </p>
            </td>

            {/* Action */}
            <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                <div className='flex flex-col gap-2 items-start'>

                    {/* Cancel — only if not yet started */}
                    {!isCompleted && (
                        <button
                            onClick={() => setIsOpen(true)}
                            className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight'
                        >
                            <span aria-hidden='true'
                                className='absolute inset-0 bg-red-200 opacity-50 rounded-full'></span>
                            <span className='relative'>Cancel</span>
                        </button>
                    )}

                    {/* Review — only after checkout & not yet reviewed */}
                    {isCompleted && !booking?.reviewed && (
                        <button
                            onClick={() => setReviewOpen(true)}
                            className='relative cursor-pointer inline-block px-3 py-1 font-semibold leading-tight'
                        >
                            <span aria-hidden='true'
                                className='absolute inset-0 bg-rose-200 opacity-50 rounded-full'></span>
                            <span className='relative text-rose-800'>Review</span>
                        </button>
                    )}

                    {/* Already reviewed */}
                    {booking?.reviewed && (
                        <span className='px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full'>
                            ✓ Reviewed
                        </span>
                    )}
                </div>

                <DeleteModal
                    handleDelete={handleDelete}
                    closeModal={closeModal}
                    isOpen={isOpen}
                    id={booking?._id}
                />
                <ReviewModal
                    isOpen={reviewOpen}
                    closeModal={() => setReviewOpen(false)}
                    roomId={booking?.roomId}
                    refetch={refetch}
                    bookingId={booking?._id}
                />
            </td>
        </tr>
    )
}

BookingDataRow.propTypes = {
    booking: PropTypes.object,
    refetch: PropTypes.func,
}

export default BookingDataRow