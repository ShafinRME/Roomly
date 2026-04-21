import Container from '../../components/Shared/Container'
import { Helmet } from 'react-helmet-async'
import RoomReservation from '../../components/RoomDetails/RoomReservation'
import Heading from '../../components/Shared/Heading'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import LoadingSpinner from '../../components/Shared/LoadingSpinner'
import useAxiosCommon from '../../hooks/useAxiosCommon'
import { useState } from 'react'

const RoomDetails = () => {
  const { id } = useParams()
  const axiosCommon = useAxiosCommon()
  const [showAllPhotos, setShowAllPhotos] = useState(false)

  const {
    data: room = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['room', id],
    queryFn: async () => {
      const { data } = await axiosCommon.get(`/room/${id}`)
      return data
    },
  })

  // Fetch booked dates for this room
  const { data: bookedDates = [] } = useQuery({
    queryKey: ['booked-dates', id],
    queryFn: async () => {
      const { data } = await axiosCommon.get(`/room/${id}/booked-dates`)
      return data
    },
    enabled: !!id
  })

  if (isLoading) return <LoadingSpinner />

  // Get images array - fallback to single image for backward compatibility
  const images = room?.images || (room?.image ? [room.image] : [])

  return (
    <Container>
      <Helmet>
        <title>{room?.title}</title>
      </Helmet>
      {room && (
        <div className='max-w-screen-lg mx-auto'>
          {/* Header */}
          <div className='flex flex-col gap-6'>
            <div>
              <Heading title={room.title} subtitle={room.location} />

              {/* Image Gallery */}
              {images.length > 0 && (
                <div className='relative'>
                  {/* Desktop Grid Layout */}
                  <div className='hidden md:grid md:grid-cols-4 md:gap-2 rounded-xl overflow-hidden h-[60vh]'>
                    {/* Main/Cover Image - Takes 2 columns and full height */}
                    <div className='col-span-2 row-span-2 h-full'>
                      <img
                        className='object-cover w-full h-full cursor-pointer hover:brightness-95 transition'
                        src={images[0]}
                        alt='Cover image'
                        onClick={() => setShowAllPhotos(true)}
                      />
                    </div>

                    {/* Right side images - 4 smaller images in 2x2 grid */}
                    {images.slice(1, 5).map((image, index) => (
                      <div key={index} className='h-[calc(30vh-4px)]'>
                        <img
                          className='object-cover w-full h-full cursor-pointer hover:brightness-95 transition'
                          src={image}
                          alt={`Room image ${index + 2}`}
                          onClick={() => setShowAllPhotos(true)}
                        />
                      </div>
                    ))}

                    {/* Show all photos button - only if more than 5 images */}
                    {images.length > 5 && (
                      <button
                        onClick={() => setShowAllPhotos(true)}
                        className='absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition flex items-center gap-2 font-semibold text-sm'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='w-4 h-4'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z'
                          />
                        </svg>
                        Show all photos
                      </button>
                    )}
                  </div>

                  {/* Mobile Single Image View */}
                  <div className='md:hidden w-full h-[60vh] overflow-hidden rounded-xl'>
                    <img
                      className='object-cover w-full h-full'
                      src={images[0]}
                      alt='header image'
                      onClick={() => setShowAllPhotos(true)}
                    />
                    {images.length > 1 && (
                      <button
                        onClick={() => setShowAllPhotos(true)}
                        className='absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 font-semibold text-sm'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='w-4 h-4'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z'
                          />
                        </svg>
                        {images.length} photos
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Full Photo Gallery Modal */}
          {showAllPhotos && (
            <div className='fixed inset-0 bg-white z-50 overflow-y-auto'>
              <div className='p-8'>
                <button
                  onClick={() => setShowAllPhotos(false)}
                  className='fixed top-8 left-8 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition flex items-center gap-2 px-4'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-5 h-5'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                  Close
                </button>
                <div className='max-w-4xl mx-auto pt-16'>
                  <h2 className='text-2xl font-semibold mb-6'>All photos</h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {images.map((image, index) => (
                      <div key={index} className='rounded-lg overflow-hidden'>
                        <img
                          className='object-cover w-full h-auto'
                          src={image}
                          alt={`Room photo ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className='grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6'>
            {/* Room Info */}
            <div className='col-span-4 flex flex-col gap-8'>
              <div className='flex flex-col gap-2'>
                <div
                  className='
                text-xl 
                font-semibold 
                flex 
                flex-row 
                items-center
                gap-2
              '
                >
                  <div>Hosted by {room?.host?.name}</div>

                  <img
                    className='rounded-full'
                    height='30'
                    width='30'
                    alt='Avatar'
                    referrerPolicy='no-referrer'
                    src={room?.host?.image}
                  />
                </div>
                <div
                  className='
                flex 
                flex-row 
                items-center 
                gap-4 
                font-light
                text-neutral-500
              '
                >
                  <div>{room?.guests} guests</div>
                  <div>{room?.bedrooms} rooms</div>
                  <div>{room?.bathrooms} bathrooms</div>
                </div>
              </div>

              <hr />
              <div
                className='
          text-lg font-light text-neutral-500'
              >
                {room?.description}
              </div>
              <hr />
            </div>

            <div className='md:col-span-3 order-first md:order-last mb-10'>
              {/* RoomReservation */}
              <RoomReservation refetch={refetch} room={room} bookedDates={bookedDates} />
            </div>
          </div>
        </div>
      )}
    </Container>
  )
}

export default RoomDetails