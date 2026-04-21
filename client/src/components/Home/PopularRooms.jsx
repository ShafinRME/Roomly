// src/components/Home/PopularRooms.jsx
import usePopularRooms from '../../hooks/usePopularRooms'
// import RoomCard from '../Room/RoomCard'
import RoomCard from "./Card";
import LoadingSpinner from '../Shared/LoadingSpinner'

const PopularRooms = () => {
    const { popularRooms, isLoading } = usePopularRooms()

    if (isLoading) return <LoadingSpinner />
    if (!popularRooms.length) return null

    return (
        <section className='max-w-7xl mx-auto px-6 py-10'>
            <h2 className='text-2xl font-semibold mb-2'>Popular homes</h2>
            <p className='text-sm text-gray-500 mb-6'>Highest rated by guests</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {popularRooms.map(room => (
                    <div key={room._id} className='relative'>
                        {/* Guest Favorite Badge */}
                        <span className='absolute top-3 left-3 z-10 bg-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm'>
                            ★ {room.avgRating?.toFixed(2)} · {room.reviewCount} reviews
                        </span>
                        <RoomCard room={room} />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default PopularRooms