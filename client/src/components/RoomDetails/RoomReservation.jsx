import PropTypes from 'prop-types'
import Button from '../Shared/Button/Button'
import { useState } from 'react'
import { DateRange } from 'react-date-range'
import { differenceInCalendarDays, eachDayOfInterval } from 'date-fns'
import BookingModal from '../Modal/BookingModal'
import useAuth from '../../hooks/useAuth'

const RoomReservation = ({ room, refetch, bookedDates = [] }) => {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  // Initialize with room's available range
  const [state, setState] = useState([
    {
      startDate: new Date(room.from),
      endDate: new Date(room.to),
      key: 'selection',
    },
  ])

  const closeModal = () => {
    setIsOpen(false)
  }

  // Calculate disabled dates based on existing bookings
  const getDisabledDates = () => {
    const disabledDates = []

    bookedDates.forEach(booking => {
      const dates = eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate)
      })
      disabledDates.push(...dates)
    })

    return disabledDates
  }

  // Calculate total price based on selected dates
  const totalDays = differenceInCalendarDays(
    state[0].endDate,
    state[0].startDate
  )
  const totalPrice = totalDays * room?.price

  // Check if selected dates overlap with booked dates
  const hasOverlap = () => {
    const selectedStart = state[0].startDate
    const selectedEnd = state[0].endDate

    return bookedDates.some(booking => {
      const bookedStart = new Date(booking.startDate)
      const bookedEnd = new Date(booking.endDate)
      return selectedStart <= bookedEnd && bookedStart <= selectedEnd
    })
  }

  // Check if dates are valid
  const isValidDateRange = () => {
    const selectedStart = state[0].startDate
    const selectedEnd = state[0].endDate
    const roomStart = new Date(room.from)
    const roomEnd = new Date(room.to)

    // Must be within room's availability
    if (selectedStart < roomStart || selectedEnd > roomEnd) {
      return false
    }

    // Must not overlap with existing bookings
    if (hasOverlap()) {
      return false
    }

    // Must be at least 1 day
    if (totalDays < 1) {
      return false
    }

    return true
  }

  return (
    <div className='rounded-xl border-[1px] border-neutral-200 overflow-hidden bg-white'>
      <div className='flex items-center gap-1 p-4'>
        <div className='text-2xl font-semibold'>$ {room?.price}</div>
        <div className='font-light text-neutral-600'>/night</div>
      </div>
      <hr />

      <div className='p-4'>
        <div className='text-sm text-gray-600 mb-2'>
          Available from {new Date(room.from).toLocaleDateString()} to{' '}
          {new Date(room.to).toLocaleDateString()}
        </div>
        <div className='text-xs text-rose-500 mb-3'>
          Select your preferred dates
        </div>
      </div>

      <div className='flex justify-center'>
        {/* Calendar with disabled dates */}
        <DateRange
          showDateDisplay={true}
          rangeColors={['#F6536D']}
          onChange={item => setState([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={state}
          minDate={new Date(room.from)}
          maxDate={new Date(room.to)}
          disabledDates={getDisabledDates()}
          direction="vertical"
        />
      </div>

      <hr />

      <div className='p-4 space-y-2'>
        {!isValidDateRange() && (
          <div className='text-xs text-rose-500 mb-2'>
            {hasOverlap()
              ? 'Selected dates overlap with existing bookings. Please choose different dates.'
              : totalDays < 1
                ? 'Please select at least 1 night'
                : 'Selected dates are outside available range'
            }
          </div>
        )}

        <div className='text-sm text-gray-600 flex justify-between'>
          <span>Selected nights:</span>
          <span className='font-semibold'>{totalDays > 0 ? totalDays : 0}</span>
        </div>

        <Button
          disabled={!isValidDateRange()}
          onClick={() => setIsOpen(true)}
          label={!isValidDateRange() ? 'Select Valid Dates' : 'Reserve'}
        />
      </div>

      {/* Modal */}
      <BookingModal
        isOpen={isOpen}
        refetch={refetch}
        closeModal={closeModal}
        bookingInfo={{
          ...room,
          roomId: room._id,
          startDate: state[0].startDate,
          endDate: state[0].endDate,
          price: totalPrice,
          guest: {
            name: user?.displayName,
            email: user?.email,
            image: user?.photoURL,
          },
        }}
      />

      <hr />

      <div className='p-4 flex items-center justify-between font-semibold text-lg'>
        <div>Total</div>
        <div>${totalPrice > 0 ? totalPrice : 0}</div>
      </div>
    </div>
  )
}

RoomReservation.propTypes = {
  room: PropTypes.object,
  refetch: PropTypes.func,
  bookedDates: PropTypes.array,
}

export default RoomReservation