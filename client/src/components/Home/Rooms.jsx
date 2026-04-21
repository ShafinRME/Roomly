import Card from './Card'
import Container from '../Shared/Container'
import Heading from '../Shared/Heading'
import LoadingSpinner from '../Shared/LoadingSpinner'
import { useQuery } from '@tanstack/react-query'
import useAxiosCommon from '../../hooks/useAxiosCommon'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

const Rooms = () => {
  const axiosCommon = useAxiosCommon()
  const [params] = useSearchParams()
  const category = params.get('category')
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(9)

  const { data, isLoading } = useQuery({
    queryKey: ['rooms', category, currentPage, limit],
    queryFn: async () => {
      const url = category
        ? `/rooms?category=${category}&page=${currentPage}&limit=${limit}`
        : `/rooms?page=${currentPage}&limit=${limit}`
      const { data } = await axiosCommon.get(url)
      return data
    },
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [category, limit])

  if (isLoading) return <LoadingSpinner />

  const rooms = data?.rooms || []
  const totalPages = data?.totalPages || 1
  const total = data?.total || 0
  const start = (currentPage - 1) * limit + 1
  const end = Math.min(currentPage * limit, total)

  return (
    <Container>
      {rooms.length > 0 ? (
        <>
          <div className='pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
            {rooms.map(room => (
              <Card key={room._id} room={room} />
            ))}
          </div>

          {/* Pagination */}
          <div className='flex flex-col items-center gap-3 my-10'>

            {/* Info text */}
            <p className='text-sm text-gray-500'>
              Showing {start}–{end} of {total} rooms
            </p>

            {/* Buttons */}
            {totalPages > 1 && (
              <div className='flex items-center gap-2 flex-wrap justify-center'>
                <button
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={currentPage === 1}
                  className='px-4 py-2 rounded-full border border-gray-300 text-sm font-medium hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition'
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-full text-sm font-medium transition
                      ${currentPage === page
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'border border-gray-300 hover:bg-gray-100'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage === totalPages}
                  className='px-4 py-2 rounded-full border border-gray-300 text-sm font-medium hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition'
                >
                  Next →
                </button>
              </div>
            )}

            {/* Limit dropdown */}
            <div className='flex items-center gap-2 mt-1'>
              <span className='text-sm text-gray-500'>Rooms per page:</span>
              <select
                value={limit}
                onChange={e => setLimit(Number(e.target.value))}
                className='border border-gray-300 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer'
              >
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </div>

          </div>
        </>
      ) : (
        <div className='flex items-center justify-center min-h-[calc(100vh-300px)]'>
          <Heading
            center={true}
            title='No Rooms Available In This Category!'
            subtitle='Please Select Other Categories.'
          />
        </div>
      )}
    </Container>
  )
}

export default Rooms