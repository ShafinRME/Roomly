import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import './CheckoutForm.css'
import { useEffect, useState } from 'react'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { ImSpinner9 } from 'react-icons/im'
import PropTypes from 'prop-types'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const CheckoutForm = ({ closeModal, bookingInfo, refetch }) => {
    const stripe = useStripe()
    const elements = useElements()
    const axiosSecure = useAxiosSecure()
    const navigate = useNavigate()
    const [cardError, setCardError] = useState('')
    const [clientSecret, setClientSecret] = useState('')
    const [processing, setProcessing] = useState(false)

    // Fetch client secret for payment
    useEffect(() => {
        if (bookingInfo?.price && bookingInfo.price > 1) {
            getClientSecret({ price: bookingInfo?.price })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingInfo?.price])

    // get clientSecret
    const getClientSecret = async price => {
        const { data } = await axiosSecure.post(`/create-payment-intent`, price)
        setClientSecret(data.clientSecret)
    }

    const handleSubmit = async event => {
        event.preventDefault()

        if (!stripe || !elements) {
            return
        }

        const card = elements.getElement(CardElement)
        if (card == null) {
            return
        }

        // card data lookup
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        })

        if (error) {
            console.log('[error]', error)
            setCardError(error.message)
            return
        } else {
            console.log('[PaymentMethod]', paymentMethod)
            setCardError('')
        }

        setProcessing(true)

        // confirm payment
        const { error: confirmError, paymentIntent } =
            await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        email: bookingInfo?.guest?.email,
                        name: bookingInfo?.guest?.name,
                    },
                },
            })

        if (confirmError) {
            console.log(confirmError)
            setCardError(confirmError.message)
            setProcessing(false)
            return
        }

        if (paymentIntent.status === 'succeeded') {
            console.log(paymentIntent)
            // Create the booking object with all required fields
            const bookingData = {
                ...bookingInfo,
                roomId: bookingInfo._id || bookingInfo.roomId,
                startDate: bookingInfo.startDate,
                endDate: bookingInfo.endDate,
                transactionId: paymentIntent.id,
                date: new Date(),
            }

            delete bookingData._id

            try {
                // save payment information to the server
                const { data } = await axiosSecure.post(`/booking`, bookingData)

                console.log(data)

                // Update room status in db (optional - depending on your logic)
                // await axiosSecure.patch(`/room/status/${bookingInfo?._id}`, {
                //   status: true,
                // })

                // update UI
                refetch()
                closeModal()
                toast.success('Room Booked Successfully')
                navigate('/dashboard/my-bookings')
            } catch (err) {
                console.log(err)
                toast.error(err.response?.data?.message || 'Booking failed')
            } finally {
                setProcessing(false)
            }
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
                <div className='flex mt-2 justify-around'>
                    <button
                        type='button'
                        className='inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                    <button
                        type='submit'
                        disabled={!stripe || !clientSecret || processing}
                        className='inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400'
                    >
                        {processing ? (
                            <ImSpinner9 className='animate-spin m-auto' size={24} />
                        ) : (
                            `Pay $${bookingInfo.price}`
                        )}
                    </button>
                </div>
            </form>
            {cardError && <p className='text-red-600 ml-8 mt-4'>{cardError}</p>}
        </>
    )
}

CheckoutForm.propTypes = {
    closeModal: PropTypes.func,
    bookingInfo: PropTypes.object,
    refetch: PropTypes.func,
}

export default CheckoutForm