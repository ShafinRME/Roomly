import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import queryString from 'query-string'
import { AiOutlineSearch } from 'react-icons/ai'

const SearchBar = () => {
    const navigate = useNavigate()
    const [where, setWhere] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [guests, setGuests] = useState(1)
    const [activeSegment, setActiveSegment] = useState(null)

    const today = new Date().toISOString().split('T')[0]

    const handleSearch = () => {
        const url = queryString.stringifyUrl({
            url: '/',
            query: {
                location: where || undefined,
                checkIn: checkIn || undefined,
                checkOut: checkOut || undefined,
                guests: guests > 1 ? guests : undefined,
            },
        })
        navigate(url)
        setActiveSegment(null)
    }

    const seg = (name) =>
        `flex flex-col px-4 py-2 cursor-pointer rounded-full border-r border-neutral-200 hover:bg-neutral-50 hover:rounded-full transition
     ${activeSegment === name ? 'bg-neutral-100' : ''}`

    return (
        <div className='flex items-stretch border border-neutral-300 rounded-full overflow-visible shadow-sm bg-white'>
            {/* Where */}
            <div className={seg('where')} onClick={() => setActiveSegment('where')}>
                <span className='text-xs font-semibold'>Where</span>
                <input
                    className='text-sm text-neutral-500 bg-transparent outline-none w-32 placeholder:text-neutral-400'
                    placeholder='Search destinations'
                    value={where}
                    onChange={(e) => setWhere(e.target.value)}
                />
            </div>

            {/* Check in */}
            <div className={seg('checkin')} onClick={() => setActiveSegment('checkin')}>
                <span className='text-xs font-semibold'>Check in</span>
                <input
                    type='date'
                    min={today}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className='text-sm text-neutral-500 bg-transparent outline-none w-28 cursor-pointer'
                />
            </div>

            {/* Check out */}
            <div className={seg('checkout')} onClick={() => setActiveSegment('checkout')}>
                <span className='text-xs font-semibold'>Check out</span>
                <input
                    type='date'
                    min={checkIn || today}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className='text-sm text-neutral-500 bg-transparent outline-none w-28 cursor-pointer'
                />
            </div>

            {/* Guests */}
            <div
                className={`flex flex-col px-4 py-2 cursor-pointer hover:rounded-full rounded-full  hover:bg-neutral-50 transition border-r
          ${activeSegment === 'guests' ? 'bg-neutral-100' : ''}`}
                onClick={() => setActiveSegment('guests')}
            >
                <span className='text-xs font-semibold'>Who</span>
                {activeSegment === 'guests' ? (
                    <div className='flex items-center gap-2' onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setGuests(g => Math.max(1, g - 1))}
                            className='w-5 h-5 rounded-full border border-neutral-400 flex items-center justify-center text-xs leading-none'
                        >−</button>
                        <span className='text-sm w-4 text-center'>{guests}</span>
                        <button
                            onClick={() => setGuests(g => g + 1)}
                            className='w-5 h-5 rounded-full border border-neutral-400 flex items-center justify-center text-xs leading-none'
                        >+</button>
                    </div>
                ) : (
                    <span className='text-sm text-neutral-500'>
                        {guests > 1 ? `${guests} guests` : 'Add guests'}
                    </span>
                )}
            </div>

            {/* Search Button */}
            <button
                onClick={handleSearch}
                className='bg-rose-500 hover:bg-rose-600 transition rounded-full m-1.5 px-4 flex items-center justify-center'
            >
                <AiOutlineSearch size={18} color='white' />
            </button>
        </div>
    )
}

export default SearchBar